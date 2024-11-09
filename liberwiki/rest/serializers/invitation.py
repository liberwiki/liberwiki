from core.models import Invitation

from .base import BaseModelSerializer, s


class InvitationSerializer(BaseModelSerializer):
    class Meta:
        model = Invitation
        fields = ["id", "user", "code", "used_by"]
        read_only_fields = ["id", "user", "code", "used_by"]
        relational_fields = {
            "used_by": s("UserSerializer")(),
        }
