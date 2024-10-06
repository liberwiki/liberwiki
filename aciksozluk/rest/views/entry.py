from common.utils.pyutils import cloned
from core.models import Entry
from drf_spectacular.utils import extend_schema
from rest.serializers import EntrySerializer
from rest.utils.permissions import ReadOnly, is_owner, prevent_actions
from rest.utils.schema_helpers import error_serializer, fake_serializer
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

    list = extend_schema(
        summary="List Entries",
        description="List entries with optional filters",
        responses={
            200: EntrySerializer(many=True),
        },
    )(cloned(BaseModelViewSet.list))

    retrieve = extend_schema(
        summary="Retrieve Entry",
        description="Retrieve entry by id",
        responses={
            200: EntrySerializer,
        },
    )(cloned(BaseModelViewSet.retrieve))

    create = extend_schema(
        summary="Create Entry",
        description="Create a new entry",
        responses={
            201: EntrySerializer,
            400: error_serializer(EntrySerializer),
        },
    )(cloned(BaseModelViewSet.create))

    update = extend_schema(
        summary="Put Entry",
        description="Update an existing entry",
        request=fake_serializer(name="EntryUpdateSerializer", base=EntrySerializer, remove_fields=["title"]),
        responses={
            200: EntrySerializer,
            400: error_serializer(EntrySerializer),
        },
    )(cloned(BaseModelViewSet.update))

    partial_update = extend_schema(
        summary="Patch Entry",
        description="Partially update an existing entry",
        responses={
            200: EntrySerializer,
            400: error_serializer(EntrySerializer),
        },
    )(cloned(BaseModelViewSet.partial_update))

    destroy = extend_schema(
        summary="Delete Entry",
        description="Delete an existing entry",
        responses={
            204: None,
            400: BaseModelViewSet.destroy.default_400_schema("EntryDestroyError"),
        },
    )(cloned(BaseModelViewSet.destroy))

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related("title", "author")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
