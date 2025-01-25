from common.admin import BaseModelAdmin
from core.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _


@admin.register(User)
class UserAdmin(BaseModelAdmin, BaseUserAdmin):
    autocomplete_fields = ["groups", "user_permissions"]
    list_display = [
        "username",
        "email",
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
    ]

    def get_fieldsets(self, request, obj=None):
        fieldset = self.fieldset_field
        add_fieldsets = fieldset(None, fields=["username", "password1", "password2"], collapse=False)
        fieldsets = [
            fieldset(None, ["username", "password"]),
            fieldset(_("Personal info"), ["first_name", "last_name", "email"], collapse=False),
            fieldset(
                _("Permissions"),
                ["role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions"],
            ),
            fieldset(_("Important dates"), ["last_login", "date_joined", "created_at", "updated_at"]),
        ]
        return add_fieldsets if not obj else fieldsets
