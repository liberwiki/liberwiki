from drf_spectacular.utils import extend_schema
from rest.serializers import AuthTokenSerializer
from rest.utils.schema_helpers import error_serializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class AuthTokenView(APIView):
    permission_classes = [AllowAny]
    serializer_class = AuthTokenSerializer

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
        },
        request=AuthTokenSerializer,
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})

    @extend_schema(
        summary="Delete Auth Token",
        description="Delete auth token, logging out of all devices",
        responses={
            204: None,
        },
        request=AuthTokenSerializer,
    )
    def delete(self):
        self.request.auth_token.delete()
        return Response(status=204)
