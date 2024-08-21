from common.models import BaseModel
from common.utils.db import track_model_history
from core.validators.user import username_validator
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _


@track_model_history
class User(AbstractUser, BaseModel):
    username = models.CharField(
        verbose_name=_("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters (lowercase), digits or hyphens only, can't start with letters or hyphens."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
