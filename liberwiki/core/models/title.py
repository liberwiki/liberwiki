import string

from common.models import BaseModel
from common.utils.db import track_model_history
from common.validators import AllowedCharactersValidator
from django.db import models
from django.template.defaultfilters import slugify
from django.utils.translation import gettext_lazy as _
from django_lifecycle import AFTER_UPDATE, BEFORE_CREATE, hook


@track_model_history
class Title(BaseModel):
    REPR_STRING = "{self.name}"

    name = models.CharField(
        verbose_name=_("Title"),
        max_length=255,
        unique=True,
        validators=[
            AllowedCharactersValidator(
                allowed_characters=string.ascii_letters + string.digits + string.punctuation + " "
            ),
        ],
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
    @hook(AFTER_UPDATE)
    def create_slug(self):
        self.slug = slugify(self.name)