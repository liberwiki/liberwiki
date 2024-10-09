from core.models import Entry
from rest.serializers import EntrySerializer
from rest.utils.permissions import ReadOnly, is_owner, prevent_actions
from rest.utils.schema_helpers import fake_serializer
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated

from .base import BaseModelViewSet, django_to_drf_validation_error


class EntryViewSet(BaseModelViewSet):
    endpoint = "entries"
    model = Entry
    serializer_class = EntrySerializer

    permission_classes = [
        IsAuthenticated & DjangoModelPermissions & (is_owner("author"))
        | prevent_actions("update", "partial_update", "destroy", "create")
        | ReadOnly
    ]

    filterset_fields = {
        "author": ["exact"],
        "title": ["exact"],
        "title__slug": ["exact"],
        "created_at": ["exact", "gte", "lte"],
        "updated_at": ["exact", "gte", "lte"],
    }

    update_schema = fake_serializer(name="EntryUpdateSerializer", base=EntrySerializer, remove_fields=["title"])
    crud_extend_default_schema = dict(
        update=dict(request=update_schema),
        partial_update=dict(request=update_schema),
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related("title", "author")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
