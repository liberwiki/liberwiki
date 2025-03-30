from core.models import Entry, EntryBookmark, EntryVote, Title, User
from django.db.models import BooleanField, CharField, Count, Exists, OuterRef, Prefetch, Q, Subquery, Value
from django_filters import BooleanFilter, ChoiceFilter, NumberFilter
from drf_spectacular.utils import extend_schema
from rest.serializers import EntrySerializer
from rest.utils.filters import make_filters
from rest.utils.permissions import (
    IsAuthenticatedANDSignupCompleted,
    IsSuperUser,
    ReadOnly,
    is_owner,
    prevent_actions,
    user_property,
)
from rest.utils.schema_helpers import fake_serializer
from rest_framework.decorators import action
from rest_framework.response import Response

from .base import BaseModelViewSet, django_to_drf_validation_error


class EntryViewSet(BaseModelViewSet):
    endpoint = "entries"
    model = Entry
    serializer_class = EntrySerializer

    permission_classes = [
        IsSuperUser
        | (
            IsAuthenticatedANDSignupCompleted
            & (user_property(User.can_create_new_entry) | prevent_actions("create"))
            & (is_owner("author") | prevent_actions("update", "partial_update", "destroy"))
        )
        | ReadOnly
    ]

    update_schema = fake_serializer(name="EntryUpdateSerializer", base=EntrySerializer, remove_fields=["title"])
    crud_extend_default_schema = {
        "create": {
            "description": (
                f"Permissions:\n"
                f"    {User.Roles.READER} can't create entries,\n"
                f"    {User.Roles.NEW_RECRUIT} can create 1 entry per day,\n"
                f"    {User.Roles.CONTRIBUTOR} and {User.Roles.TRUSTED} can create as many entries as they want.\n"
            ),
        },
        "update": {"description": "Only the author can update the entry.", "request": update_schema},
        "partial_update": {"description": "Only the author can update the entry.", "request": update_schema},
        "destroy": {"description": "Only the author can delete the entry."},
    }

    declared_filters = {
        "vote": ChoiceFilter(choices=EntryVote.VoteType.choices),
        "vote__isnull": BooleanFilter(field_name="vote", lookup_expr="isnull"),
        "is_bookmarked": BooleanFilter(field_name="is_bookmarked", lookup_expr="exact"),
        **make_filters("like_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("dislike_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("bookmark_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    filterset_fields = {
        "author": ["exact"],
        "author__username": ["exact"],
        "title": ["exact"],
        "title__slug": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
        "is_draft": ["exact"],
    }

    ordering_fields = [
        "created_at",
        "updated_at",
        "like_count",
        "dislike_count",
        "bookmark_count",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.add_drafts_for_self(queryset, self.request)
        queryset = self.annotate_votes(queryset, self.request)
        queryset = self.annotate_bookmarks(queryset, self.request)
        queryset = self.annotate_likes_dislikes_bookmarks(queryset)
        queryset = queryset.prefetch_related(
            Prefetch("author", queryset=self.author_queryset()),
            Prefetch("title", queryset=self.title_queryset()),
        )
        return queryset

    @staticmethod
    def author_queryset():
        queryset = User.objects.annotate(
            entry_count=Count("entries", filter=Q(entries__is_draft=False)),
            title_count=Count("titles", distinct=True),
        )
        return queryset

    @staticmethod
    def title_queryset():
        queryset = Title.objects.annotate(
            entry_count=Count("entries", filter=Q(entries__is_draft=False)),
        )
        return queryset

    @staticmethod
    def add_drafts_for_self(queryset, request):
        if request and request.user and request.user.is_authenticated:
            queryset = queryset.filter(Q(is_draft=False) | Q(is_draft=True, author=request.user))
        return queryset

    @staticmethod
    def annotate_likes_dislikes_bookmarks(queryset):
        dislike, like = EntryVote.VoteType.DOWNVOTE, EntryVote.VoteType.UPVOTE
        queryset = queryset.prefetch_related("entry_votes", "entry_bookmarks")
        queryset = queryset.annotate(like_count=Count("entry_votes", filter=Q(entry_votes__vote=like)))
        queryset = queryset.annotate(dislike_count=Count("entry_votes", filter=Q(entry_votes__vote=dislike)))
        queryset = queryset.annotate(bookmark_count=Count("entry_bookmarks"))
        return queryset

    @staticmethod
    def annotate_votes(queryset, request):
        queryset = queryset.annotate(vote=Value(None, output_field=CharField(null=True)))
        if request and request.user and request.user.is_authenticated:
            user_vote = EntryVote.objects.filter(entry=OuterRef("pk"), user=request.user).values("vote")[:1]
            queryset = queryset.annotate(vote=Subquery(user_vote, output_field=CharField(null=True)))
        return queryset

    @staticmethod
    def annotate_bookmarks(queryset, request):
        queryset = queryset.annotate(is_bookmarked=Value(False, output_field=BooleanField()))
        if request and request.user and request.user.is_authenticated:
            user_bookmark = EntryBookmark.objects.filter(entry=OuterRef("pk"), user=request.user)
            queryset = queryset.annotate(is_bookmarked=Exists(user_bookmark))
        return queryset

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @extend_schema(
        summary=f"Upvote Entry",
        description=f"Cast a down vote to an entry by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="upvote",
        serializer_class=fake_serializer("UpvoteEntry", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def upvote(self, *args, **kwargs):
        EntryVote.cast(self.request.user, self.get_object(), EntryVote.VoteType.UPVOTE)
        return Response(status=204)

    @extend_schema(
        summary=f"Downvote Entry",
        description=f"Cast an up vote to an entry by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="downvote",
        serializer_class=fake_serializer("DownvoteEntry", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def downvote(self, *args, **kwargs):
        EntryVote.cast(self.request.user, self.get_object(), EntryVote.VoteType.DOWNVOTE)
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Entry Vote",
        description=f"Remove vote from entry by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unvote",
        serializer_class=fake_serializer("UnvoteEntry", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def unvote(self, *args, **kwargs):
        EntryVote.cast(self.request.user, self.get_object(), None)
        return Response(status=204)

    @extend_schema(
        summary=f"Bookmark Entry",
        description=f"Bookmark an entry by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="bookmark",
        serializer_class=fake_serializer("BookmarkEntry", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def bookmark(self, *args, **kwargs):
        EntryBookmark.bookmark(self.request.user, self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Entry Bookmark",
        description=f"Remove bookmark from entry by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unbookmark",
        serializer_class=fake_serializer("UnbookmarkEntry", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def unbookmark(self, *args, **kwargs):
        EntryBookmark.unbookmark(self.request.user, self.get_object())
        return Response(status=204)
