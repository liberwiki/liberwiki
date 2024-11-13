import string
from datetime import timedelta

from common.models import BaseModel
from common.utils.db import get_longest_choice_length, track_model_history
from common.validators import AllowedCharactersValidator
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _


@track_model_history
class User(AbstractUser, BaseModel):
    REPR_STRING = "{self.username}"

    class Roles(models.TextChoices):
        READER = "READER", _("Reader")
        NEW_RECRUIT = "NEW_RECRUIT", _("New Recruit")
        CONTRIBUTOR = "CONTRIBUTOR", _("Contributor")
        TRUSTED = "TRUSTED", _("Trusted")
        __all__ = [item[0] for item in [READER, NEW_RECRUIT, CONTRIBUTOR, TRUSTED]]

    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(
        verbose_name=_("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. "
            "Letters (lowercase), digits or hyphens only, can't start with digits or hyphens."
        ),
        validators=[
            AllowedCharactersValidator(
                allowed_characters=string.ascii_lowercase + string.digits + "-",
                allowed_first=string.ascii_lowercase,
                allowed_last=string.ascii_lowercase + string.digits,
            ),
        ],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    role = models.CharField(
        max_length=get_longest_choice_length(Roles),
        choices=Roles.choices,
        default=Roles.NEW_RECRUIT,
    )

    @property
    def can_invite_new_users(self):
        if self.role == self.Roles.TRUSTED:
            return True
        if self.role == self.Roles.CONTRIBUTOR:
            if not self.invitations.filter(used_by__isnull=True).exists():
                invalid_roles = [self.Roles.READER, self.Roles.NEW_RECRUIT]
                used_invitations = self.invitations.filter(~Q(used_by__role__in=invalid_roles))
                if used_invitations.exists():
                    return True
        return False

    @property
    def can_create_new_entry(self):
        # This includes throttling logic, I'm not sure if this belongs here but this is APP specific
        # throttling logic, so I'm putting it here for now.
        # Arbitrary throttling rule itself is also in here instead of being in some config
        if self.role in [self.Roles.CONTRIBUTOR, self.Roles.TRUSTED]:
            return True
        if self.role == self.Roles.NEW_RECRUIT:
            last_entry = self.entries.order_by("created_at").last()
            if last_entry:
                return last_entry.created_at < self.created_at + timedelta(days=1)
        return False

    def role_is_at_least(self, level: str):
        hierarchy = self.Roles.__all__[::-1]
        return hierarchy.index(self.role) <= hierarchy.index(level)

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
