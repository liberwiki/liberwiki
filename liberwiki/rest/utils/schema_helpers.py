import re
from functools import wraps

from common.utils.pyutils import purge_iterable, purge_mapping
from memoization import cached
from rest_framework import serializers

type_serializer_map = {
    str: serializers.CharField,
    int: serializers.IntegerField,
    float: serializers.FloatField,
    bool: serializers.BooleanField,
    dict: serializers.DictField,
    "uuid": serializers.UUIDField,
    "json": serializers.JSONField,
    "str-list": lambda **kw: serializers.ListField(child=serializers.CharField(), **kw),
}


@cached
def fake_list_serializer(child_serializer, **kwargs):
    return serializers.ListSerializer(child=child_serializer, **kwargs)


@cached
def fake_serializer(
    name,
    schema=None,
    readonly=None,
    required=None,
    field_kwargs=None,
    base=serializers.Serializer,
    serializer_kwargs=None,
    dont_initialize=False,
    remove_fields=None,
):
    """
    A utility for creating one-off serializers for openapi schema generation purposes.
    # TODO: turn this into a class and document it properly.
    """
    # Construct the serializer fields
    kwargs = {
        **({"read_only": readonly} if readonly is not None else {}),
        **({"required": required} if required is not None else {}),
    }
    field_kwargs = field_kwargs or {}
    tsm = type_serializer_map
    fields = {
        key: tsm[value](**kwargs, **field_kwargs.get(key, {})) if value in tsm else value
        for key, value in (schema or {}).items()
    }
    # Construct the Meta and inherit from base if it exists
    meta = type("Meta", (getattr(base, "Meta", object),), {})
    meta.fields = list(getattr(meta, "fields", [])) + list(fields.keys())
    fields["Meta"] = meta
    # Create our one-off serializer
    serializer = type(name, (base,), {k: None if k in (remove_fields or []) else v for k, v in fields.items()})
    # Remove unwanted fields
    serializer.Meta.fields = purge_iterable(  # NOQA
        getattr(serializer.Meta, "fields", []),  # NOQA
        (remove_fields or []),
    )
    serializer.Meta.read_only_fields = purge_iterable(  # NOQA
        getattr(serializer.Meta, "read_only_fields", []),  # NOQA
        (remove_fields or []),
    )
    serializer.Meta.relational_fields = purge_mapping(  # NOQA
        getattr(serializer.Meta, "relational_fields", {}),  # NOQA
        (remove_fields or []),
    )
    if dont_initialize:

        @wraps(serializer.__init__)
        def init(*a, **kw):
            # I think drf-spectacular checks the id or something because when I pass the same serializer instance
            # fields with the same serializer don't show up on the schema
            # but this way I can defer init and create new instance when we need to use the same instance
            full_kwargs = {**(serializer_kwargs or {}), **kw}
            return serializer(*a, **full_kwargs)

        return init

    return serializer(**(serializer_kwargs or {}))


@cached
def error_serializer(serializer, overrides=None):
    error_schema = {key: "str-list" for key in serializer.Meta.fields}
    non_field_errors = {"non_field_errors": "str-list"}
    return fake_serializer(
        name=f"{re.sub('Serializer$', '', serializer.__name__)}Error",
        schema=error_schema | non_field_errors | (overrides or {}),
        readonly=True,
        required=False,
    )
