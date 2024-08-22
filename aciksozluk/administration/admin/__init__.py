from admin_interface.models import Theme
from django.contrib import admin

from .entry import EntryAdmin
from .group import GroupAdmin
from .permission import PermissionAdmin
from .title import TitleAdmin
from .user import UserAdmin

__all__ = [
    "EntryAdmin",
    "GroupAdmin",
    "PermissionAdmin",
    "TitleAdmin",
    "UserAdmin",
]

admin.site.unregister(Theme)
