from core.models import Title

from .base import BaseModelSerializer, ModelRelatedCountField, s


class TitleSerializer(BaseModelSerializer):
    entry_count = ModelRelatedCountField("entries")

    class Meta:
        model = Title
        fields = ["id", "name", "slug", "entry_count", "created_by"]
        read_only_fields = ["id", "slug", "entry_count", "created_by"]
        relational_fields = {
            "created_by": s("PublicUserSerializer")(),
        }
