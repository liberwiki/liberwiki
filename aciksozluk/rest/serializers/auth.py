from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError


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
