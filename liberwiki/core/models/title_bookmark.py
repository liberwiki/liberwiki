from common.models import BaseModel
from common.utils.db import track_model_history
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_model_history()
class TitleBookmark(BaseModel):
    REPR_STRING = "{self.user}->bookmark->{self.title}"

    user = models.ForeignKey(
        to="core.User",
        on_delete=models.CASCADE,
        related_name="title_bookmarks",
        help_text=_("User who bookmarked."),
    )
    title = models.ForeignKey(
        to="core.Title",
        on_delete=models.CASCADE,
        related_name="title_bookmark",
        help_text=_("Title that was bookmarked."),
    )

    @classmethod
    def bookmark(cls, user, title):
        cls.objects.get_or_create(user=user, title=title)

    @classmethod
    def unbookmark(cls, user, title):
        cls.objects.filter(user=user, title=title).delete()

    class Meta:
        verbose_name = _("Title Bookmark")
        verbose_name_plural = _("Title Bookmarks")
        constraints = [models.UniqueConstraint(fields=["user", "title"], name="unique_user_title_bookmark")]
