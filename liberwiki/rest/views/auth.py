from drf_spectacular.utils import extend_schema
from rest.serializers import AuthTokenSerializer, SignupSerializer, VerifyEmailSerializer
from rest.utils.permissions import IsAnonymous, prevent_actions
from rest.utils.schema_helpers import error_serializer
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class AuthViewSet(GenericViewSet):
    endpoint = "auth"

    def get_serializer_context(self):
        return {"request": self.request, "format": self.format_kwarg, "view": self}

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)

    @extend_schema(
        summary="Obtain Auth Token",
        description="Get your active auth token",
        responses={
            400: error_serializer(AuthTokenSerializer),
            200: AuthTokenSerializer(read_only=True),
            201: AuthTokenSerializer(read_only=True),
        },
        request=AuthTokenSerializer,
    )
    @action(
        detail=False,
        methods=["POST"],
        serializer_class=AuthTokenSerializer,
        url_path="tokens",
        permission_classes=[
            (IsAnonymous & prevent_actions("delete")) | IsAuthenticated & prevent_actions("obtain_auth_token"),
        ],
    )
    def obtain_auth_token(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=201 if created else 200)

    @extend_schema(
        summary="Delete Auth Token",
        description="Delete auth token, logging out of all devices",
        responses={
            204: None,
        },
        request=AuthTokenSerializer,
    )
    @obtain_auth_token.mapping.delete
    def delete_auth_token(self, request, *args, **kwargs):
        self.request.auth_token.delete()
        return Response(status=204)

    @extend_schema(
        summary="Signup",
        description="Signup with an invitation code",
        responses={
            400: error_serializer(SignupSerializer),
            201: None,
        },
    )
    @action(detail=False, methods=["POST"], serializer_class=SignupSerializer, permission_classes=[IsAnonymous])
    def signup(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    @extend_schema(
        summary="Verify Email",
        description="Verify email address",
        responses={
            400: error_serializer(VerifyEmailSerializer),
            204: None,
        },
    )
    @action(
        detail=False,
        methods=["POST"],
        serializer_class=VerifyEmailSerializer,
        permission_classes=[IsAnonymous],
        url_path="verify-email",
    )
    def verify_email(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=204)
