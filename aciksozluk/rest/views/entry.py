from core.models import Entry, EntryBookmark, Vote
from django.db.models import BooleanField, CharField, Exists, OuterRef, Subquery, Value
from django_filters import BooleanFilter, ChoiceFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import EntrySerializer
from rest.utils.permissions import ReadOnly, is_owner, prevent_actions
from rest.utils.schema_helpers import fake_serializer
from rest_framework.decorators import action
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework.response import Response

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

    declared_filters = {
        "vote": ChoiceFilter(choices=Vote.VoteType.choices),
        "vote__isnull": BooleanFilter(field_name="vote", lookup_expr="isnull"),
        "is_bookmarked": BooleanFilter(field_name="is_bookmarked", lookup_expr="exact"),
    }

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
        queryset = self.annotate_votes(queryset, self.request)
        queryset = self.annotate_bookmarks(queryset, self.request)
        return queryset.select_related("title", "author")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @staticmethod
    def annotate_votes(queryset, request):
        queryset = queryset.annotate(vote=Value(None, output_field=CharField(null=True)))
        if request and request.user and request.user.is_authenticated:
            user_vote = Vote.objects.filter(entry=OuterRef("pk"), user=request.user).values("vote")[:1]
            queryset = queryset.annotate(vote=Subquery(user_vote, output_field=CharField(null=True)))
        return queryset

    @staticmethod
    def annotate_bookmarks(queryset, request):
        queryset = queryset.annotate(is_bookmarked=Value(False, output_field=BooleanField()))
        if request and request.user and request.user.is_authenticated:
            user_bookmark = EntryBookmark.objects.filter(entry=OuterRef("pk"), user=request.user)
            queryset = queryset.annotate(is_bookmarked=Exists(user_bookmark))
        return queryset

    @extend_schema(
        summary=f"Upvote Entry",
        description=f"Cast an down vote to an entry by id",
        responses={204: None},
    )
    @action(detail=True, methods=["POST"], url_path="upvote", serializer_class=None)
    @django_to_drf_validation_error
    def upvote(self, *args, **kwargs):
        Vote.cast(self.request.user, self.get_object(), Vote.VoteType.UPVOTE)
        return Response(status=204)

    @extend_schema(
        summary=f"Downvote Entry",
        description=f"Cast an up vote to an entry by id",
        responses={204: None},
    )
    @action(detail=True, methods=["POST"], url_path="downvote", serializer_class=None)
    @django_to_drf_validation_error
    def downvote(self, *args, **kwargs):
        Vote.cast(self.request.user, self.get_object(), Vote.VoteType.DOWNVOTE)
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Vote",
        description=f"Remove vote from entry by id",
        responses={204: None},
    )
    @action(detail=True, methods=["POST"], url_path="unvote", serializer_class=None)
    @django_to_drf_validation_error
    def unvote(self, *args, **kwargs):
        Vote.cast(self.request.user, self.get_object(), None)
        return Response(status=204)

    @extend_schema(
        summary=f"Bookmark Entry",
        description=f"Bookmark an entry by id",
        responses={204: None},
    )
    @action(detail=True, methods=["POST"], url_path="bookmark", serializer_class=None)
    @django_to_drf_validation_error
    def bookmark(self, *args, **kwargs):
        EntryBookmark.bookmark(self.request.user, self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Bookmark",
        description=f"Remove bookmark from entry by id",
        responses={204: None},
    )
    @action(detail=True, methods=["POST"], url_path="unbookmark", serializer_class=None)
    @django_to_drf_validation_error
    def unbookmark(self, *args, **kwargs):
        EntryBookmark.unbookmark(self.request.user, self.get_object())
        return Response(status=204)
