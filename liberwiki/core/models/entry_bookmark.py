from common.models import BaseModel
from common.utils.db import track_model_history
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_model_history()
class EntryBookmark(BaseModel):
    REPR_STRING = "{self.user}->bookmark->{self.entry}"

    user = models.ForeignKey(
        to="core.User",
        on_delete=models.CASCADE,
        related_name="entry_bookmarks",
        help_text=_("User who bookmarked."),
    )
    entry = models.ForeignKey(
        to="core.Entry",
        on_delete=models.CASCADE,
        related_name="entry_bookmarks",
        help_text=_("Entry that was bookmarked."),
    )

    @classmethod
    def bookmark(cls, user, entry):
        cls.objects.get_or_create(user=user, entry=entry)

    @classmethod
    def unbookmark(cls, user, entry):
        cls.objects.filter(user=user, entry=entry).delete()

    class Meta:
        verbose_name = _("Entry Bookmark")
        verbose_name_plural = _("Entry Bookmarks")
        constraints = [models.UniqueConstraint(fields=["user", "entry"], name="unique_user_entry_bookmark")]
