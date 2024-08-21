from common.admin import BaseModelAdmin
from common.utils.pyutils import returns
from django.contrib import admin
from django.contrib.auth.models import Permission


@admin.register(Permission)
class PermissionAdmin(BaseModelAdmin):
    search_fields = ["name", "codename"]
    list_filter = ["group"]
    list_display = ["name", "content_type", "codename"]
    fields = ["name", "content_type", "codename"]
    has_add_permission = returns(False)
    has_change_permission = returns(False)
    has_delete_permission = returns(False)
