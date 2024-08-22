from common.admin import BaseModelAdmin
from core.models import Title
from django.contrib import admin


@admin.register(Title)
class TitleAdmin(BaseModelAdmin):
    fields = ["name", "slug"]
    readonly_fields = ["created_at", "updated_at"]
    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
