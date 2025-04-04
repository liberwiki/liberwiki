from pathlib import Path

from allauth.account.adapter import DefaultAccountAdapter
from allauth.core import context as allauth_context
from allauth.headless.adapter import DefaultHeadlessAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from common.utils.email import mjml_template, text_template
from django.core.mail import send_mail
from rest_framework.settings import settings


class LiberWikiAllauthAccountAdapter(DefaultAccountAdapter):
    email_folder = Path("")

    def send_mail(self, template_prefix, email, context):
        request = allauth_context.request
        context.update({"email": email})
        html_content = mjml_template(self.email_folder / template_prefix / "message.html", context, request)
        text_content = text_template(self.email_folder / template_prefix / "message.txt", context, request)
        send_mail(
            text_template(self.email_folder / template_prefix / "subject.txt", context, request).strip(),
            text_content,
            settings.DEFAULT_AUTH_FROM_EMAIL,
            [email],
            fail_silently=False,
            html_message=html_content,
        )

    def save_user(self, request, user, form, commit=True):
        """
        Save the user instance and set the username to an unusable value.
        """
        with user.skip_full_clean():
            user = super().save_user(request, user, form, commit)
        return user

    def populate_username(self, request, user):
        user.set_unusable_username()


class LiberWikiAllauthSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        with sociallogin.user.skip_full_clean():
            user = super().save_user(request, sociallogin, form)
        return user


class LiberWikiAllauthHeadlessAccountAdapter(DefaultHeadlessAdapter):
    def serialize_user(self, user):
        data = super().serialize_user(user)
        data["signup_completed"] = getattr(user, user.SIGNUP_COMPLETED_FIELD, False)
        return data
