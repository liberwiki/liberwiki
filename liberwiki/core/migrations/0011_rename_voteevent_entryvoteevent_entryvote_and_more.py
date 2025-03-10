# Generated by Django 5.1 on 2024-10-26 12:40

import uuid

import django.db.models.deletion
import django.utils.timezone
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0010_entrybookmark_entrybookmarkevent_and_more"),
        ("pghistory", "0006_delete_aggregateevent"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="VoteEvent",
            new_name="EntryVoteEvent",
        ),
        migrations.CreateModel(
            name="EntryVote",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="Unique identifier for this object",
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        db_index=True,
                        default=django.utils.timezone.now,
                        editable=False,
                        help_text="Date and time this object was created",
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, help_text="Date and time this object was last updated"
                    ),
                ),
                (
                    "vote",
                    models.CharField(
                        choices=[("UPVOTE", "Upvote"), ("DOWNVOTE", "Downvote")], help_text="Vote", max_length=8
                    ),
                ),
                (
                    "entry",
                    models.ForeignKey(
                        help_text="Entry that was voted.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="entry_votes",
                        to="core.entry",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="User who voted.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="entry_votes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Entry Vote",
                "verbose_name_plural": "Entry Votes",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.AlterField(
            model_name="entryvoteevent",
            name="pgh_obj",
            field=models.ForeignKey(
                db_constraint=False,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="events",
                to="core.entryvote",
            ),
        ),
        migrations.DeleteModel(
            name="Vote",
        ),
        migrations.AddConstraint(
            model_name="entryvote",
            constraint=models.UniqueConstraint(fields=("user", "entry"), name="unique_user_entry_vote"),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="entryvote",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_entryvoteevent" ("created_at", "entry_id", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "user_id", "vote") VALUES (NEW."created_at", NEW."entry_id", NEW."id", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."updated_at", NEW."user_id", NEW."vote"); RETURN NULL;',
                    hash="3e81607a7ed8d51bcdc52eb5a818a56d39ab8e13",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_93b7d",
                    table="core_entryvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="entryvote",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_entryvoteevent" ("created_at", "entry_id", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "user_id", "vote") VALUES (NEW."created_at", NEW."entry_id", NEW."id", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."updated_at", NEW."user_id", NEW."vote"); RETURN NULL;',
                    hash="bf5f9fdbdb5d7524cd211cdc707fba0cd05c91c5",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_9e24d",
                    table="core_entryvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="entryvote",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_entryvoteevent" ("created_at", "entry_id", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "user_id", "vote") VALUES (OLD."created_at", OLD."entry_id", OLD."id", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."updated_at", OLD."user_id", OLD."vote"); RETURN NULL;',
                    hash="afff649ffb1c93f1b86379234290f8c9a404087f",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_610e1",
                    table="core_entryvote",
                    when="AFTER",
                ),
            ),
        ),
    ]
