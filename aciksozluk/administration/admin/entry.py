from common.admin import BaseModelAdmin
from common.utils.pyutils import returns
from core.models import Entry
from django.contrib import admin


@admin.register(Entry)
class EntryAdmin(BaseModelAdmin):
    readonly_fields = ["content", "created_at", "updated_at", "author"]
    list_display = ["title", "created_at", "updated_at"]
    autocomplete_fields = ["title"]

    has_add_permission = returns(False)
    has_delete_permission = returns(False)
