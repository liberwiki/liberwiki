from common.utils.pyutils import cloned, raises
from core.models import User
from django.db.models import Count
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import PublicUserSerializer, UserSerializer
from rest.utils.filters import make_filters
from rest.utils.schema_helpers import error_serializer
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed

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
        "created_at": ["exact", "gte", "lte"],
        "updated_at": ["exact", "gte", "lte"],
    }

    declared_filters = {
        **make_filters("entry_count", NumberFilter, ["exact", "gte", "lte"]),
        **make_filters("title_count", NumberFilter, ["exact", "gte", "lte"]),
    }

    create = extend_schema(exclude=True)(raises(MethodNotAllowed("Create is not allowed for this endpoint")))
    update = extend_schema(exclude=True)(raises(MethodNotAllowed("Put is not allowed for this endpoint")))
    partial_update = extend_schema(exclude=True)(raises(MethodNotAllowed("Patch is not allowed for this endpoint")))
    destroy = extend_schema(exclude=True)(raises(MethodNotAllowed("Destroy is not allowed for this endpoint")))

    list = extend_schema(
        summary="List Users",
        description="List users with optional filters",
        responses={
            200: PublicUserSerializer(many=True),
        },
    )(cloned(BaseModelViewSet.list))

    retrieve = extend_schema(
        summary="Retrieve User",
        description="Retrieve user by id",
        responses={
            200: PublicUserSerializer,
        },
    )(cloned(BaseModelViewSet.retrieve))

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
