from common.admin import BaseModelAdmin
from core.models import Title
from django.contrib import admin
from django.db.models import Count, Q
from django.utils.translation import gettext_lazy as _


@admin.register(Title)
class TitleAdmin(BaseModelAdmin):
    fields = ["name"]
    readonly_fields = ["created_at", "updated_at", "slug", "entry_count", "draft_count"]
    list_display = ["name", "created_by", "entry_count", "draft_count", "created_at", "updated_at"]
    search_fields = ["name"]
    list_filter = ["created_by", "created_at", "updated_at"]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related("entries")
        queryset = queryset.select_related("created_by")
        queryset = queryset.annotate(entry_count=Count("entries", filter=Q(entries__is_draft=False)))
        queryset = queryset.annotate(draft_count=Count("entries", filter=Q(entries__is_draft=True)))
        return queryset

    @admin.display(description=_("Entry Count"))
    def entry_count(self, obj):
        return obj.entry_count

    @admin.display(description=_("Draft Count"))
    def draft_count(self, obj):
        return obj.draft_count
