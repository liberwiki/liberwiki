from common.admin import BaseModelAdmin
from core.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


@admin.register(User)
class UserAdmin(BaseModelAdmin, BaseUserAdmin):
    autocomplete_fields = ["groups", "user_permissions"]
    list_filter = [
        "is_staff",
        "is_active",
        "created_at",
        "updated_at",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    def get_fieldsets(self, request, obj=None):
        fieldset = self.fieldset_field
        add_fieldsets = fieldset(None, fields=["username", "password1", "password2"], collapse=False)
        fieldsets = [
            fieldset("Personal info", ["first_name", "last_name", "email"], collapse=False),
            fieldset("Permissions", ["is_active", "is_staff", "is_superuser", "groups", "user_permissions"]),
            fieldset("Important dates", ["last_login", "date_joined", "created_at", "updated_at"]),
        ]
        return add_fieldsets if not obj else fieldsets
