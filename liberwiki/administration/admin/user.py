from common.admin import BaseModelAdmin
from core.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import Count, Q
from django.utils.translation import gettext_lazy as _


@admin.register(User)
class UserAdmin(BaseModelAdmin, BaseUserAdmin):
    autocomplete_fields = ["groups", "user_permissions"]
    list_display = [
        "username",
        "email",
        "entry_count",
        "draft_count",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
        "updated_at",
    ]
    list_filter = [
        "role",
        "is_staff",
        "is_active",
        "created_at",
        "updated_at",
    ]
    readonly_fields = [
        "last_login",
        "created_at",
        "updated_at",
        "entry_count",
        "draft_count",
    ]

    def get_fieldsets(self, request, obj=None):
        fieldset = self.fieldset_field
        add_fieldsets = fieldset(None, fields=["username", "password1", "password2"], collapse=False)
        fieldsets = [
            fieldset(None, ["username", "password"]),
            fieldset(_("Personal info"), ["first_name", "last_name", "email"], collapse=False),
            fieldset(_("Metrics"), ["entry_count", "draft_count"]),
            fieldset(
                _("Permissions"),
                ["role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions"],
            ),
            fieldset(_("Important dates"), ["last_login", "date_joined", "created_at", "updated_at"]),
        ]
        return add_fieldsets if not obj else fieldsets

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related("entries")
        queryset = queryset.annotate(entry_count=Count("entries", filter=Q(entries__is_draft=False)))
        queryset = queryset.annotate(draft_count=Count("entries", filter=Q(entries__is_draft=True)))
        return queryset

    @admin.display(description=_("Entry Count"))
    def entry_count(self, obj):
        return obj.entry_count

    @admin.display(description=_("Draft Count"))
    def draft_count(self, obj):
        return obj.draft_count
