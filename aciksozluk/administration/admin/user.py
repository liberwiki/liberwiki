from common.admin import BaseModelAdmin
from core.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


@admin.register(User)
class UserAdmin(BaseModelAdmin, BaseUserAdmin):
    autocomplete_fields = ["groups", "user_permissions"]
    list_filter = ["is_staff", "is_active"]

    def get_fieldsets(self, request, obj=None):
        fieldset = self.fieldset_field
        add_fieldsets = fieldset(None, fields=["username", "password1", "password2"], collapse=False)
        fieldsets = [
            fieldset("Personal info", ["first_name", "last_name", "email"], collapse=False),
            fieldset("Permissions", ["is_active", "is_staff", "is_superuser", "groups", "user_permissions"]),
            fieldset("Important dates", ["last_login", "date_joined"]),
        ]
        return add_fieldsets if not obj else fieldsets
