from core.models import User
from django.contrib.auth import update_session_auth_hash
from django.db.models import Count, Q
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import PublicUserSerializer, UserSerializer
from rest.utils.filters import make_filters
from rest.utils.schema_helpers import error_serializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers.user import UserCompleteSignupSerializer
from .base import BaseModelViewSet


class UserViewSet(BaseModelViewSet):
    endpoint = "users"
    model = User
    serializer_class = PublicUserSerializer

    serializer_class_action_map = {
        "me": UserSerializer,
        "patch_me": UserSerializer,
        "put_me": UserSerializer,
        "complete_signup": UserCompleteSignupSerializer,
    }

    filterset_fields = {
        "username": ["iexact", "icontains"],
        "is_active": ["exact"],
        "is_staff": ["exact"],
        "is_superuser": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    declared_filters = {
        **make_filters("entry_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("title_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    disallowed_methods = ["create", "update", "partial_update", "destroy"]

    crud_extend_default_schema = {
        "list": {"responses": {200: PublicUserSerializer(many=True)}},
        "retrieve": {"responses": {200: PublicUserSerializer}},
    }

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(
            entry_count=Count("entries", filter=Q(entries__is_draft=False)),
            title_count=Count("titles", distinct=True),
        )
        return queryset

    @extend_schema(
        summary="Retrieve Me",
        description="Retrieve the current user",
        responses={
            200: UserSerializer,
        },
    )
    @action(detail=False, methods=["GET"], serializer_class=UserSerializer, permission_classes=[IsAuthenticated])
    def me(self, request):
        self.kwargs["pk"] = request.user.pk
        return super().retrieve(request)

    @extend_schema(
        summary="Patch Me",
        description="Partially update the current user",
        responses={200: UserSerializer, 400: error_serializer(UserSerializer)},
    )
    @me.mapping.patch
    def patch_me(self, request):
        self.kwargs["pk"] = request.user.pk
        self.kwargs["partial"] = True
        return BaseModelViewSet.update(self, request)

    @extend_schema(
        summary="Put Me",
        description="Update the current user",
        responses={200: UserSerializer, 400: error_serializer(UserSerializer)},
    )
    @me.mapping.put
    def put_me(self, request):
        self.kwargs["pk"] = request.user.pk
        return BaseModelViewSet.update(self, request)

    @extend_schema(
        summary="Complete Signup",
        description="Complete the signup process for the current user",
        responses={200: UserSerializer, 400: error_serializer(UserCompleteSignupSerializer)},
    )
    @action(
        detail=False,
        methods=["POST"],
        serializer_class=UserCompleteSignupSerializer,
        url_path="me/complete-signup",
        permission_classes=[IsAuthenticated],
    )
    def complete_signup(self, request):
        user = request.user
        if not getattr(user, User.SIGNUP_COMPLETED_FIELD, False):
            serializer = self.get_serializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save(request.user)
                update_session_auth_hash(request, user)
                response = Response(UserSerializer(user).data)
            else:
                response = Response(serializer.errors, status=400)
        else:
            response = Response({"non_field_errors": ["User has completed signup previously"]}, status=400)
        return response
