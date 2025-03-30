import uuid
from contextlib import contextmanager
from uuid import UUID

from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import gettext as _
from django_lifecycle import (
    AFTER_CREATE,
    AFTER_SAVE,
    AFTER_UPDATE,
    BEFORE_CREATE,
    BEFORE_SAVE,
    BEFORE_UPDATE,
    LifecycleModelMixin,
)


class BaseModel(LifecycleModelMixin, models.Model):
    REPR_STRING = "{self.__class__.__name__}(id={self.id})"
    _skip_full_clean = False

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text=_("Unique identifier for this object"),
    )
    created_at = models.DateTimeField(
        db_index=True,
        default=timezone.now,
        editable=False,
        help_text=_("Date and time this object was created"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        db_index=True,
        help_text=_("Date and time this object was last updated"),
    )

    class Meta:
        abstract = True

    def update(self, **kwargs):
        skip_hooks = kwargs.pop("_skip_hooks", False)
        for key, val in kwargs.items():
            setattr(self, key, val)
        return self.save(skip_hooks=skip_hooks)

    @classmethod
    def create(cls, **kwargs):
        skip_hooks = kwargs.pop("_skip_hooks", False)
        instance = cls(**kwargs)
        return instance.save(skip_hooks=skip_hooks)

    @transaction.atomic
    def save(self, *args, **kwargs):
        skip_hooks = kwargs.pop("skip_hooks", False)
        save = super().save

        if skip_hooks:
            save(*args, **kwargs)
            return

        self._clear_watched_fk_model_cache()
        is_new = self._state.adding

        if is_new:
            self._run_hooked_methods(BEFORE_CREATE, **kwargs)
        else:
            self._run_hooked_methods(BEFORE_UPDATE, **kwargs)

        self._run_hooked_methods(BEFORE_SAVE, **kwargs)
        if not self._skip_full_clean:
            self.full_clean()
        save(*args, **kwargs)
        self._run_hooked_methods(AFTER_SAVE, **kwargs)

        if is_new:
            self._run_hooked_methods(AFTER_CREATE, **kwargs)
        else:
            self._run_hooked_methods(AFTER_UPDATE, **kwargs)

        transaction.on_commit(self._reset_initial_state)

    @staticmethod
    def _uuid_to_hex(value):
        return str(value.hex)

    @staticmethod
    def _hex_to_uuid(slug):
        return UUID(int=int(slug, 16))

    @classmethod
    def get_from_hex(cls, hex):  # NOQA
        return cls.objects.get(id=cls._hex_to_uuid(hex))

    @property
    def hex(self):
        return self._uuid_to_hex(self.id)

    @staticmethod
    def file_exists(field):
        try:
            field.file  # NOQA
            return True
        except ValueError:
            return False

    def as_queryset(self):
        return self.__class__.objects.filter(id=self.id)

    def __str__(self):
        return self.REPR_STRING.format(self=self)

    def __repr__(self):
        return self.REPR_STRING.format(self=self)

    @contextmanager
    def skip_full_clean(self):
        original_value = self._skip_full_clean
        self._skip_full_clean = True
        try:
            yield
        finally:
            self._skip_full_clean = original_value

    @contextmanager
    def skip_field_validators(self, *field_names):
        original_validators = {}
        for field_name in field_names:
            field = self._meta.get_field(field_name)
            original_validators[field_name] = field.validators
            field.validators = []
        try:
            yield
        finally:
            for field_name, validators in original_validators.items():
                field = self._meta.get_field(field_name)
                field.validators = validators
