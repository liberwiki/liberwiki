from core.models import Title
from django.db.models import Count
from django_filters import NumberFilter
from rest.serializers import TitleSerializer
from rest.utils.filters import make_filters

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

    disallowed_methods = ["update", "partial_update"]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.annotate(entry_count=Count("entries")).select_related("created_by")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
