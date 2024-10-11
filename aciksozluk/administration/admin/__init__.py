from admin_interface.models import Theme
from django.contrib import admin
from rest_framework.authtoken.models import TokenProxy

from .entry import EntryAdmin
from .group import GroupAdmin
from .invitation import InvitationAdmin
from .permission import PermissionAdmin
from .title import TitleAdmin
from .user import UserAdmin

__all__ = [
    "EntryAdmin",
    "GroupAdmin",
    "InvitationAdmin",
    "PermissionAdmin",
    "TitleAdmin",
    "UserAdmin",
]

admin.site.unregister(Theme)
admin.site.unregister(TokenProxy)
