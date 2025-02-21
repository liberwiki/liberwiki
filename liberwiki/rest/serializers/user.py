from core.models import User
from rest_framework import serializers

from .base import BaseModelSerializer


class PublicUserSerializer(BaseModelSerializer):
    title_count = serializers.IntegerField(required=False, read_only=True)
    entry_count = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "is_active",
            "is_staff",
            "is_superuser",
            "role",
            "created_at",
            "updated_at",
            "title_count",
            "entry_count",
        ]
        read_only_fields = fields


class UserSerializer(BaseModelSerializer):
    title_count = serializers.IntegerField(required=False, read_only=True)
    entry_count = serializers.IntegerField(required=False, read_only=True)

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
            "role",
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
            "role",
            "created_at",
            "updated_at",
            "title_count",
            "entry_count",
        ]
