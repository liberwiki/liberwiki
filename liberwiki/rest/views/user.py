from core.models import User
from django.db.models import Count
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import PublicUserSerializer, UserSerializer
from rest.utils.filters import make_filters
from rest.utils.schema_helpers import error_serializer
from rest_framework.decorators import action

from .base import BaseModelViewSet


class UserViewSet(BaseModelViewSet):
    endpoint = "users"
    model = User
    serializer_class = PublicUserSerializer

    serializer_class_action_map = {
        "me": UserSerializer,
        "patch_me": UserSerializer,
        "put_me": UserSerializer,
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

    @extend_schema(
        summary="Retrieve Me",
        description="Retrieve the current user",
        responses={
            200: UserSerializer,
        },
    )
    @action(detail=False, methods=["GET"], serializer_class=UserSerializer)
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

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.annotate(entry_count=Count("entries"), title_count=Count("titles"))
