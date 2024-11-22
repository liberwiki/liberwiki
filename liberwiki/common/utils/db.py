from contextlib import suppress

import pghistory
from django.core.exceptions import ValidationError
from pghistory.core import DeleteEvent, InsertEvent, UpdateEvent


def track_model_history(**kwargs):
    def track_events(cls):
        """
        Instead of using pghistory.track() directly, if we need base configuration we will do it here.
        """
        trackers = [InsertEvent(), UpdateEvent(), DeleteEvent()]
        return pghistory.track(*trackers, **kwargs)(cls)

    return track_events


def get_object_or_none(model, **kwargs):
    with suppress(model.DoesNotExist, ValidationError):
        return model.objects.get(**kwargs)


def get_longest_choice_length(text_choices):
    return len(max([db_value for db_value, *rest in tuple(text_choices.choices)], key=len))
