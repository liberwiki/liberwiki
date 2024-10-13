from core.models import Invitation, User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import transaction
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.settings import settings


class AuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField(label=_("Email"), write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    token = serializers.CharField(label=_("Token"), read_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get("request"), username=email, password=password)

        if not user:
            raise ValidationError(_("Invalid email or password"))

        if not user.is_active:
            raise ValidationError(_("User account is disabled"))

        token, created = Token.objects.get_or_create(user=user)

        attrs["token"] = token.key
        self.user = user  # NOQA
        return attrs

    class Meta:
        fields = ["email", "password", "token"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    password_confirmation = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    invitation_code = serializers.CharField(
        write_only=True,
        required=True,
        validators=Invitation.code.field.validators,  # NOQA
    )

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password_confirmation")
        code = attrs.get("invitation_code")

        if password != password2:
            raise ValidationError(_("Passwords do not match"))

        if not Invitation.objects.filter(code=code, used_by__isnull=True).exists():
            raise ValidationError(_("Invalid or previously used invitation code"))

        self.invitation = Invitation.objects.get(code=code)  # NOQA
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(  # NOQA
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            is_active=False,
        )
        self.invitation.update(used_by=user)
        self.send_verification_email(
            user,
            urlsafe_base64_encode(str(user.pk).encode()),
            PasswordResetTokenGenerator().make_token(user),
        )
        self.invitation.update(used_by=user)
        return user

    def send_verification_email(self, user, uidb64, token):
        url = settings.AUTH_VERIFY_EMAIL_URL_TEMPLATE.format(domain=settings.PARENT_HOST, uidb64=uidb64, token=token)
        print(url)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "password_confirmation",
            "invitation_code",
        ]
        write_only_fields = ["password", "password_confirmation", "invitation_code"]


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True, required=True)
    uidb64 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        token = attrs.get("token")
        uidb64 = attrs.get("uidb64")

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError(_("Invalid user or token"))

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise ValidationError(_("Invalid user or token"))

        self.user = user  # NOQA
        return attrs

    def save(self):
        user = self.user.update(is_active=True)
        return user

    class Meta:
        fields = [
            "token",
            "uidb64",
        ]
