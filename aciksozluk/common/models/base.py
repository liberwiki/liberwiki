import uuid
from uuid import UUID

from django.db import models
from django.utils import timezone
from django_lifecycle import LifecycleModelMixin


class BaseModel(LifecycleModelMixin, models.Model):
    REPR_STRING = "{self.__class__.__name__}(id={self.id})"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this object",
    )
    created_at = models.DateTimeField(
        db_index=True,
        default=timezone.now,
        editable=False,
        help_text="Date and time this object was created",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        db_index=True,
        help_text="Date and time this object was last updated",
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

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

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
