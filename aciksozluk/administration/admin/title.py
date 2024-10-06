from common.admin import BaseModelAdmin
from core.models import Title
from django.contrib import admin
from django.db.models import Count


@admin.register(Title)
class TitleAdmin(BaseModelAdmin):
    fields = ["name"]
    readonly_fields = ["created_at", "updated_at", "slug"]
    list_display = ["name", "created_by", "entry_count", "created_at", "updated_at"]
    search_fields = ["name"]
    list_filter = [
        "created_by",
        "created_at",
        "updated_at",
    ]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(entry_count=Count("entries")).select_related("created_by")

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    @admin.display(description="Entry Count")
    def entry_count(self, obj):
        return obj.entry_count
