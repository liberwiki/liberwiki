from core.models import User

from .base import BaseModelSerializer, ModelRelatedCountField


class PublicUserSerializer(BaseModelSerializer):
    title_count = ModelRelatedCountField("titles")
    entry_count = ModelRelatedCountField("entries")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "title_count",
            "entry_count",
        ]
        read_only_fields = fields


class UserSerializer(BaseModelSerializer):
    title_count = ModelRelatedCountField("titles")
    entry_count = ModelRelatedCountField("entries")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "title_count",
            "entry_count",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "title_count",
            "entry_count",
        ]
