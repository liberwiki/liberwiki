from contextlib import suppress
from itertools import chain

from common.utils.pyutils import with_attrs
from django.utils.module_loading import import_string
from rest_framework.serializers import IntegerField, ModelSerializer


class ConditionalSerializerMixin:
    # This mixin is used to conditionally include nested serializers in the response.
    # TODO: Current this doesn't take into account which fields belong to which resource
    # So if you do ?include=labels,people for some endpoint for an office resource
    # /api/v1/offices/5/?include=labels,people
    # labels of both the office and people will be included in the response
    # We need to fix this - this is a copy paste from a previous project and needs a rewrite anyway.
    """
    Serializes the nested field, doesn't turn the serializer into read-only automatically(should it?) but it is
    read only.

    GET /api/v1/people/5/
    {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "labels": [7]
    }

    GET /api/v1/people/5/?include=labels
    {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "labels": [
            {
                "id": 7,
                "name": "label-name"
            }
        ]
    }
    """
    CONDITIONAL_SERIALIZER_EXCLUDE_FIELDS_KEY = "exclude_relational_fields"
    CONDITIONAL_SERIALIZER_RELATIONAL_FIELDS_KEY = "relational_fields"

    def __init__(self, *a, **kw):
        self.exclude_relational_fields = kw.pop("exclude_relational_fields", [])  # to remove bootstraps
        super().__init__(*a, **kw)

    def get_fields(self):
        fields = super().get_fields()  # NOQA
        relational_fields = getattr(self.Meta, self.CONDITIONAL_SERIALIZER_RELATIONAL_FIELDS_KEY, {})  # NOQA
        for excluded in self.exclude_relational_fields:
            relational_fields.pop(excluded, None)
        for name, serializer in relational_fields.items():
            setattr(self.__class__, name, self.property_maker(name, serializer))

        conditional_fields = relational_fields.keys()
        for field in conditional_fields:
            if serializer := getattr(self, field):
                fields[field] = serializer
        return fields

    @classmethod
    def property_maker(cls, name, serializer):
        @with_attrs(__name__=name)
        def generic_property(_self):
            request = _self.context.get("request")
            get = getattr(request, "GET", {})
            include = (get and hasattr(get, "getlist") and get.getlist("include")) or []
            name_in_get = name in list(chain.from_iterable([item.split(",") for item in include]))
            if request and get and name_in_get:
                return serializer()

        return property(generic_property)

    def bind(self, *a, **kw):
        with suppress(AssertionError):
            return super().bind(*a, **kw)  # NOQA


class OnlyCreateNoUpdateMixin:
    ONLY_CREATE_NO_UPDATE_FIELDS_KEY = "create_no_update_fields"

    def get_extra_kwargs(self):
        kwargs = super().get_extra_kwargs()  # NOQA
        create_no_update = getattr(self.Meta, self.ONLY_CREATE_NO_UPDATE_FIELDS_KEY, [])  # NOQA
        if self.instance and create_no_update:  # NOQA
            for field in create_no_update:
                kwargs.setdefault(field, {})
                kwargs[field]["read_only"] = True
                kwargs[field]["required"] = False
        return kwargs


class BaseModelSerializer(OnlyCreateNoUpdateMixin, ConditionalSerializerMixin, ModelSerializer): ...


def s(serializer):
    # Returns a function that when called with serializer arguments
    # returns a function that doesn't accept any arguments for conditional serializer mixin
    def actual_serializer(*serializer_args, **serializer_kwargs):
        def serializer_returning_inner_function():
            prefix = "rest.serializers."
            try:
                serializer_class = import_string(serializer)
            except ImportError:
                serializer_class = import_string(prefix + serializer)
            return serializer_class(*serializer_args, read_only=True, required=False, **serializer_kwargs)

        return serializer_returning_inner_function

    return actual_serializer


class ModelRelatedCountField(IntegerField):
    """
    A read-only field that returns the count of related objects in the given related_name.
    """

    def __init__(self, related_name=None, **kwargs):
        self.related_name = related_name
        kwargs["source"] = "*"
        kwargs["read_only"] = True
        super().__init__(**kwargs)

    def to_representation(self, value):
        return getattr(value, self.related_name).all().count()
