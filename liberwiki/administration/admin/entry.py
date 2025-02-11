from common.admin import BaseModelAdmin
from core.models import Entry
from django.contrib import admin


@admin.register(Entry)
class EntryAdmin(BaseModelAdmin):
    readonly_fields = ["author", "title", "content", "created_at", "updated_at"]
    list_display = ["author", "title", "created_at", "updated_at"]
    autocomplete_fields = ["title"]
    list_filter = ["author", "title", "created_at", "updated_at", "is_draft"]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related("author", "title")
