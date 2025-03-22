def monkeypatch_allauth_oauth2_client():
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
