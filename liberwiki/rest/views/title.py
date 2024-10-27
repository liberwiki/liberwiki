from core.models import Title, TitleBookmark
from django.db.models import BooleanField, Count, Exists, OuterRef, Value
from django_filters import NumberFilter
from rest.serializers import TitleSerializer
from rest.utils.filters import make_filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .base import BaseModelViewSet, django_to_drf_validation_error


class TitleViewSet(BaseModelViewSet):
    endpoint = "titles"
    model = Title
    serializer_class = TitleSerializer

    filterset_fields = {
        "name": ["exact", "iexact", "contains", "icontains"],
        "slug": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    declared_filters = {
        **make_filters("entry_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    disallowed_methods = ["update", "partial_update"]

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.annotate_bookmarks(queryset, self.request)
        return queryset.annotate(entry_count=Count("entries")).select_related("created_by")

    @staticmethod
    def annotate_bookmarks(queryset, request):
        queryset = queryset.annotate(is_bookmarked=Value(False, output_field=BooleanField()))
        if request and request.user and request.user.is_authenticated:
            user_bookmark = TitleBookmark.objects.filter(title=OuterRef("pk"), user=request.user)
            queryset = queryset.annotate(is_bookmarked=Exists(user_bookmark))
        return queryset

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["POST"], url_path="bookmark", serializer_class=None)
    @django_to_drf_validation_error
    def bookmark(self, *args, **kwargs):
        TitleBookmark.bookmark(self.request.user, self.get_object())
        return Response(status=204)

    @action(detail=True, methods=["POST"], url_path="unbookmark", serializer_class=None)
    @django_to_drf_validation_error
    def unbookmark(self, *args, **kwargs):
        TitleBookmark.unbookmark(self.request.user, self.get_object())
        return Response(status=204)