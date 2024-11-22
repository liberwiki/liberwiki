import secrets
import string

from common.models import BaseModel
from common.utils.db import track_model_history
from django.core.exceptions import ValidationError
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_lifecycle import BEFORE_CREATE, hook


@track_model_history()
class Invitation(BaseModel):
    REPR_STRING = "{self.user}->{self.used_by}:{self.code}"
    INVITATION_TOKEN_LENGTH = 8

    user = models.ForeignKey(
        to="core.User",
        on_delete=models.PROTECT,
        related_name="invitations",
        help_text=_("Owner of the invitation."),
    )

    code = models.CharField(
        max_length=INVITATION_TOKEN_LENGTH,
        validators=[MinLengthValidator(INVITATION_TOKEN_LENGTH), MaxLengthValidator(INVITATION_TOKEN_LENGTH)],
        unique=True,
        help_text=_("Invitation code."),
        editable=False,
    )

    used_by = models.OneToOneField(
        to="core.User",
        on_delete=models.PROTECT,
        related_name="invitation",
        blank=True,
        null=True,
        help_text=_("User who used the invitation."),
        editable=False,
    )

    @hook(BEFORE_CREATE)
    def generate_invitation_code(self):
        self.code = self.get_unique_code(tries=10)

    @hook(BEFORE_CREATE)
    def check_user_invitation_limit(self):
        if not self.user.can_invite_new_users:
            raise ValidationError(_("You can't invite new users."))

    def generate_code(self):
        # https://docs.python.org/3/library/secrets.html#recipes-and-best-practices
        alphabet = string.ascii_letters.lower() + string.digits
        return "".join(secrets.choice(alphabet) for i in range(self.INVITATION_TOKEN_LENGTH))

    def get_unique_code(self, tries=1):
        for __ in range(tries):
            code = self.generate_code()
            if not Invitation.objects.filter(code=code).exists():
                return code
        raise ValidationError(_(f"Unable to generate a unique code after {tries} tries."))

    class Meta:
        verbose_name = _("Invitation")
        verbose_name_plural = _("Invitations")
