from common.admin import BaseModelAdmin
from core.models import Entry
from django.contrib import admin


@admin.register(Entry)
class EntryAdmin(BaseModelAdmin):
    fields = ["title"]  # We will need to add an iframe that has a full-featured tiptap editor for "content"
    readonly_fields = ["content", "created_at", "updated_at"]
    list_display = ["title", "created_at", "updated_at"]
    autocomplete_fields = ["title"]
