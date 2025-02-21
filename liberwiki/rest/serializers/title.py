from core.models import Title
from rest_framework import serializers

from .base import BaseModelSerializer, s


class TitleSerializer(BaseModelSerializer):
    entry_count = serializers.IntegerField(required=False, read_only=True)
    is_bookmarked = serializers.BooleanField(required=False, read_only=True)

    class Meta:
        model = Title
        fields = ["id", "name", "slug", "entry_count", "created_by", "is_bookmarked"]
        read_only_fields = ["id", "slug", "entry_count", "created_by", "is_bookmarked"]
        relational_fields = {
            "created_by": s("PublicUserSerializer")(),
        }
