from django.db.models import BooleanField, Case, Value, When


def starts_with(field, prefix):
    return Case(
        When(**{f"{field}__startswith": prefix}, then=Value(False)),
        default=Value(True),
        output_field=BooleanField(),
    )
