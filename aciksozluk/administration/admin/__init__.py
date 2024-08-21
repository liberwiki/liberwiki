from admin_interface.models import Theme
from django.contrib import admin

from .group import GroupAdmin
from .permission import PermissionAdmin
from .user import UserAdmin

__all__ = [
    "UserAdmin",
    "PermissionAdmin",
    "GroupAdmin",
]

admin.site.unregister(Theme)
