# Generated by Django 5.1 on 2024-10-10 01:26

import uuid

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import pgtrigger.compiler
import pgtrigger.migrations
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_invitation"),
        ("pghistory", "0006_delete_aggregateevent"),
    ]

    operations = [
        migrations.CreateModel(
            name="InvitationEvent",
            fields=[
                ("pgh_id", models.AutoField(primary_key=True, serialize=False)),
                ("pgh_created_at", models.DateTimeField(auto_now_add=True)),
                ("pgh_label", models.TextField(help_text="The event label.")),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="Unique identifier for this object",
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        help_text="Date and time this object was created",
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, help_text="Date and time this object was last updated"),
                ),
                (
                    "code",
                    models.CharField(
                        editable=False,
                        help_text="Invitation code.",
                        max_length=8,
                        validators=[
                            django.core.validators.MinLengthValidator(8),
                            django.core.validators.MaxLengthValidator(8),
                        ],
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="invitation",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_invitationevent" ("code", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "used_by_id", "user_id") VALUES (NEW."code", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."updated_at", NEW."used_by_id", NEW."user_id"); RETURN NULL;',
                    hash="ca079c668682e86ab624d187579764e85cae5742",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_2d88f",
                    table="core_invitation",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="invitation",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_invitationevent" ("code", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "used_by_id", "user_id") VALUES (NEW."code", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."updated_at", NEW."used_by_id", NEW."user_id"); RETURN NULL;',
                    hash="bbbaeec991e00948137b6c3a87a88a06322dd0a3",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_04d90",
                    table="core_invitation",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="invitation",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_invitationevent" ("code", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "updated_at", "used_by_id", "user_id") VALUES (OLD."code", OLD."created_at", OLD."id", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."updated_at", OLD."used_by_id", OLD."user_id"); RETURN NULL;',
                    hash="122283e5eed9c03e3a17d79e666b97e95b42dab5",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_b8970",
                    table="core_invitation",
                    when="AFTER",
                ),
            ),
        ),
        migrations.AddField(
            model_name="invitationevent",
            name="pgh_context",
            field=models.ForeignKey(
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="pghistory.context",
            ),
        ),
        migrations.AddField(
            model_name="invitationevent",
            name="pgh_obj",
            field=models.ForeignKey(
                db_constraint=False,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="events",
                to="core.invitation",
            ),
        ),
        migrations.AddField(
            model_name="invitationevent",
            name="used_by",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                editable=False,
                help_text="User who used the invitation.",
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                related_query_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="invitationevent",
            name="user",
            field=models.ForeignKey(
                db_constraint=False,
                help_text="Owner of the invitation.",
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                related_query_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
