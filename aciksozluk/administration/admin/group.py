from common.admin import BaseModelAdmin
from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import Group

admin.site.unregister(Group)


@admin.register(Group)
class GroupAdmin(BaseModelAdmin, BaseGroupAdmin):
    autocomplete_fields = ["permissions"]
    search_fields = ["name"]
    ordering = ["name"]
    list_display = ["name", "permission_count"]
    fields = ["name", "permissions"]
    readonly_fields = ["permission_count"]

    @staticmethod
    @admin.display(description="Permission Count")
    def permission_count(obj):
        return obj.permissions.count()
