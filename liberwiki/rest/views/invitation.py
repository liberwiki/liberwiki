from core.models import Invitation, User
from rest.serializers import InvitationSerializer
from rest.utils.permissions import IsSuperUser, ReadOnly, user_property
from rest_framework.permissions import IsAuthenticated

from .base import BaseModelViewSet, django_to_drf_validation_error


class InvitationViewSet(BaseModelViewSet):
    endpoint = "invitations"
    model = Invitation
    serializer_class = InvitationSerializer
    permission_classes = [IsSuperUser | (IsAuthenticated & user_property(User.can_invite_new_users)) | ReadOnly]

    crud_extend_default_schema = {
        "create": {
            "description": (
                f"Permissions:\n"
                f"    {User.Roles.READER} can't create invites,\n"
                f"    {User.Roles.NEW_RECRUIT} can't create invites,\n"
                f"    {User.Roles.CONTRIBUTOR} can create 1 invite until that user is processed.\n"
                f"    {User.Roles.TRUSTED} can create as many invites as they want.\n"
            ),
        },
    }

    disallowed_methods = ["update", "partial_update", "destroy"]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).select_related("used_by")

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
