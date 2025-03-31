def monkeypatch_allauth_oauth2_client():
    # This is probably one of the perma monkeypatches since this is not a bug but something
    # really rare that virtually no one would need
    import allauth.socialaccount.providers.oauth2.client
    from django.conf import settings

    auth_domain = f"{settings.AUTH_SUBDOMAIN}.{settings.DOMAIN}"
    oauth2_auth_domain_override = f"{settings.OAUTH2_REDIRECT_DOMAIN_OVERRIDE}"

    class CallbackURLInterceptor:
        def __get__(self, instance, owner):
            if instance is None:
                return self
            return getattr(instance, "_real_callback_url", "").replace(auth_domain, oauth2_auth_domain_override)

        def __set__(self, instance, value):
            instance._real_callback_url = value

    if settings.OAUTH2_REDIRECT_DOMAIN_OVERRIDE:
        allauth.socialaccount.providers.oauth2.client.OAuth2Client.callback_url = CallbackURLInterceptor()


def monkeypatch_allauth_username_email_login():
    # https://codeberg.org/allauth/django-allauth/pulls/4326
    import allauth.headless.account.inputs
    from allauth.account import app_settings as account_settings
    from allauth.account.adapter import get_adapter as get_account_adapter
    from allauth.account.internal import flows
    from allauth.account.models import Login
    from allauth.core import context

    def clean(self):
        cleaned_data = super().clean()
        if self.errors:
            return cleaned_data
        credentials = {}
        for login_method in account_settings.LOGIN_METHODS:
            value = cleaned_data.get(login_method)
            if value is not None and login_method in self.data.keys():
                credentials[login_method] = value
        if len(credentials) != 1:
            raise get_account_adapter().validation_error("invalid_login")
        password = cleaned_data.get("password")
        if password:
            auth_method = next(iter(credentials.keys()))
            credentials["password"] = password
            user = get_account_adapter().authenticate(context.request, **credentials)
            if user:
                self.login = Login(user=user, email=credentials.get("email"))
                if flows.login.is_login_rate_limited(context.request, self.login):
                    raise get_account_adapter().validation_error("too_many_login_attempts")
            else:
                error_code = "%s_password_mismatch" % auth_method.value
                self.add_error("password", get_account_adapter().validation_error(error_code))
        return cleaned_data

    allauth.headless.account.inputs.LoginInput.clean = clean
