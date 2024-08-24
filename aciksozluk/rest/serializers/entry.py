from core.models import Entry

from .base import BaseModelSerializer, s


class EntrySerializer(BaseModelSerializer):
    class Meta:
        model = Entry
        fields = ["id", "author", "title", "content", "created_at", "updated_at"]
        read_only_fields = ["author"]
        relational_fields = {
            "author": s("PublicUserSerializer")(),
            "title": s("TitleSerializer")(),
        }
        create_no_update_fields = ["title"]
