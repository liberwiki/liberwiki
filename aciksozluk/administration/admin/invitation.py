from common.admin import BaseModelAdmin
from common.utils.pyutils import returns
from core.models import Invitation
from django.contrib import admin


@admin.register(Invitation)
class InvitationAdmin(BaseModelAdmin):
    readonly_fields = ["user", "used_by", "created_at", "updated_at", "code"]
    list_display = ["user", "used_by", "created_at", "updated_at"]
    search_fields = ["name"]
    list_filter = [
        "user",
        "used_by",
        ["used_by", admin.EmptyFieldListFilter],
        "created_at",
        "updated_at",
    ]

    # Invitations are read only in admin
    # If an admin wants to create an invitation they can go through the usual method from the app UI
    # They can't also delete invitations but rather they should ban the user from the platform instead
    has_change_permissions = returns(False)
    has_delete_permissions = returns(False)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related("user", "used_by")
