from common.models import BaseModel
from common.utils.db import track_model_history
from django.db import models
from django.utils.translation import gettext as _
from django_lifecycle import AFTER_DELETE, hook


@track_model_history
class Entry(BaseModel):
    REPR_STRING = "{self.title}#{self.hex}"

    title = models.ForeignKey(
        to="core.Title",
        on_delete=models.PROTECT,
        related_name="entries",
        help_text=_("Title of the entry."),
    )
    author = models.ForeignKey(
        to="core.User",
        on_delete=models.PROTECT,
        related_name="entries",
        help_text=_("Author of the entry."),
    )
    content = models.JSONField(
        # We are using tiptap.dev for the content of the entry. It is a WYSIWYG editor that produces JSON output.
        # The client side will limit the functionality of the editor to only allow the features that we want.
        # However, the server side will not enforce any restrictions on the content for now.
        # We'll slowly add or remove features as needed by the community.
        # Since the front-end won't render anything that's not included in the editor - this is OK.
        verbose_name=_("Content"),
        help_text=_("Content of the entry. In tiptap format."),
    )

    class Meta:
        verbose_name = _("Entry")
        verbose_name_plural = _("Entries")

    @hook(AFTER_DELETE)
    def delete_title_if_no_entries(self):
        if self.title.entries.count() == 0:
            self.title.delete()
