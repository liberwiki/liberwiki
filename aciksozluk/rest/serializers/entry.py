from core.models import Entry, Vote
from rest_framework import serializers

from .base import BaseModelSerializer, s


class EntrySerializer(BaseModelSerializer):
    vote = serializers.ChoiceField(choices=Vote.VoteType.choices, required=False, read_only=True, allow_null=True)
    is_bookmarked = serializers.BooleanField(required=False, read_only=True)

    class Meta:
        model = Entry
        fields = ["id", "author", "title", "content", "created_at", "updated_at", "vote", "is_bookmarked"]
        read_only_fields = ["author", "vote", "is_bookmarked"]
        relational_fields = {
            "author": s("PublicUserSerializer")(),
            "title": s("TitleSerializer")(),
        }
        create_no_update_fields = ["title"]
