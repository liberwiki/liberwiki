from admin_interface.models import Theme
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from django.contrib import admin

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

admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
admin.site.unregister(EmailAddress)
admin.site.unregister(Theme)
