import string

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def username_validator(value):
    allowed_characters = string.ascii_lowercase + string.digits + "-"
    if not all(char in allowed_characters for char in value):
        raise ValidationError(_("Username can only contain lowercase letters, digits, and hyphens."))
    if any(value.startswith(char) for char in string.digits + "-"):
        raise ValidationError(_("Username can't start with a digit or hyphen."))
