import string

from common.models import BaseModel
from common.utils.db import track_model_history
from common.validators import AllowedCharactersValidator
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _


@track_model_history
class User(AbstractUser, BaseModel):
    REPR_STRING = "{self.username}"

    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(
        verbose_name=_("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. "
            "Letters (lowercase), digits or hyphens only, can't start with letters or hyphens."
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

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
