from common.models import BaseModel
from common.utils.db import get_longest_choice_length, track_model_history
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_model_history()
class EntryVote(BaseModel):
    REPR_STRING = "{self.user}->{self.vote}->{self.entry}"

    class VoteType(models.TextChoices):
        UPVOTE = "UPVOTE", _("Upvote")
        DOWNVOTE = "DOWNVOTE", _("Downvote")

    user = models.ForeignKey(
        to="core.User",
        on_delete=models.CASCADE,
        related_name="entry_votes",
        help_text=_("User who voted."),
    )
    entry = models.ForeignKey(
        to="core.Entry",
        on_delete=models.CASCADE,
        related_name="entry_votes",
        help_text=_("Entry that was voted."),
    )
    vote = models.CharField(
        max_length=get_longest_choice_length(VoteType),
        choices=VoteType.choices,
        help_text=_("Vote"),
    )

    @classmethod
    def cast(cls, user, entry, vote):
        if vote is None:
            cls.objects.filter(user=user, entry=entry).delete()
        else:
            cls.objects.update_or_create(user=user, entry=entry, defaults={"vote": vote})

    class Meta:
        verbose_name = _("Entry Vote")
        verbose_name_plural = _("Entry Votes")
        constraints = [models.UniqueConstraint(fields=["user", "entry"], name="unique_user_entry_vote")]
