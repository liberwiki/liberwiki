from common.utils.pyutils import cloned, raises
from core.models import Title
from django.db.models import Count
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import TitleSerializer
from rest.utils.filters import make_filters
from rest.utils.schema_helpers import error_serializer
from rest_framework.exceptions import MethodNotAllowed

from .base import BaseModelViewSet, django_to_drf_validation_error


class TitleViewSet(BaseModelViewSet):
    endpoint = "titles"
    model = Title
    serializer_class = TitleSerializer

    filterset_fields = {
        "name": ["exact", "iexact", "contains", "icontains"],
        "slug": ["exact"],
        "created_at": ["exact", "gte", "lte"],
        "updated_at": ["exact", "gte", "lte"],
    }

    declared_filters = {
        **make_filters("entry_count", NumberFilter, ["exact", "gt", "lt", "gte", "lte"]),
    }

    list = extend_schema(
        summary="List Titles",
        description="List titles with optional filters",
        responses={
            200: TitleSerializer(many=True),
        },
    )(cloned(BaseModelViewSet.list))

    retrieve = extend_schema(
        summary="Retrieve Title",
        description="Retrieve title by id",
        responses={
            200: TitleSerializer,
        },
    )(cloned(BaseModelViewSet.retrieve))

    create = extend_schema(
        summary="Create Title",
        description="Create a title",
        responses={
            201: TitleSerializer,
            400: error_serializer(TitleSerializer),
        },
    )(cloned(BaseModelViewSet.create))

    update = extend_schema(exclude=True)(raises(MethodNotAllowed("Put is not allowed for this endpoint")))
    partial_update = extend_schema(exclude=True)(raises(MethodNotAllowed("Patch is not allowed for this endpoint")))

    destroy = extend_schema(
        summary="Delete Title",
        description="Delete a title",
        responses={
            204: None,
            400: BaseModelViewSet.destroy.default_400_schema("TitleDestroyError"),
        },
    )(cloned(BaseModelViewSet.destroy))

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.annotate(entry_count=Count("entries")).select_related("created_by")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
