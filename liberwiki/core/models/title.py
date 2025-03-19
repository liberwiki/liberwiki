import string

from common.models import BaseModel
from common.utils.db import track_model_history
from common.validators import AllowedCharactersValidator
from django.conf import settings
from django.db import models
from django.template.defaultfilters import slugify
from django.utils.translation import gettext_lazy as _
from django_lifecycle import BEFORE_CREATE, BEFORE_UPDATE, hook


@track_model_history()
class Title(BaseModel):
    REPR_STRING = "{self.name}"
    TITLE_NAME_ALLOWED_EXTRA_CHARS = settings.TITLE_NAME_ALLOWED_EXTRA_CHARS
    TITLE_SLUG_CHARACTERS_LANGUAGE_MAP = settings.TITLE_SLUG_CHARACTERS_LANGUAGE_MAP
    TITLE_NAME_VALIDATOR = AllowedCharactersValidator(
        allowed_characters=string.ascii_letters + string.digits + " " + TITLE_NAME_ALLOWED_EXTRA_CHARS,
        allowed_first=string.ascii_letters + string.digits + TITLE_NAME_ALLOWED_EXTRA_CHARS,
        allowed_last=string.ascii_letters + string.digits + TITLE_NAME_ALLOWED_EXTRA_CHARS,
    )

    name = models.CharField(
        verbose_name=_("Title"),
        max_length=255,
        unique=True,
        help_text=_("Name of the title."),
    )
    slug = models.SlugField(
        verbose_name=_("Slug"),
        max_length=255,
        unique=True,
        help_text=_("Slug of the title to display in urls."),
    )
    created_by = models.ForeignKey(
        to="core.User",
        on_delete=models.PROTECT,
        related_name="titles",
        help_text=_("Creator of the title."),
        editable=False,
    )

    class Meta:
        verbose_name = _("Title")
        verbose_name_plural = _("Titles")

    @hook(BEFORE_CREATE)
    @hook(BEFORE_UPDATE)
    def create_slug(self):
        # We apply normalizations for extra chars in settings
        normalize_map = dict(char_map.split(":") for char_map in self.TITLE_SLUG_CHARACTERS_LANGUAGE_MAP.split(","))
        self.slug = slugify("".join(normalize_map.get(char, char) for char in self.name))

    @hook(BEFORE_CREATE)
    @hook(BEFORE_UPDATE)
    def validate_name(self):
        self.TITLE_NAME_VALIDATOR(self.name)
