from core.models import Entry, EntryVote
from rest_framework import serializers

from .base import BaseModelSerializer, s


class EntrySerializer(BaseModelSerializer):
    vote = serializers.ChoiceField(choices=EntryVote.VoteType.choices, required=False, read_only=True, allow_null=True)
    is_bookmarked = serializers.BooleanField(required=False, read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    dislike_count = serializers.IntegerField(read_only=True)
    bookmark_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Entry
        fields = [
            "id",
            "author",
            "title",
            "content",
            "is_draft",
            "created_at",
            "updated_at",
            "vote",
            "is_bookmarked",
            "like_count",
            "dislike_count",
            "bookmark_count",
        ]
        read_only_fields = [
            "author",
            "vote",
            "is_bookmarked",
            "like_count",
            "dislike_count",
            "bookmark_count",
        ]
        relational_fields = {
            "author": s("PublicUserSerializer")(),
            "title": s("TitleSerializer")(),
        }
        create_no_update_fields = ["title"]
