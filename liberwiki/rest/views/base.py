from functools import wraps

from common.utils.error_handling import TransformExceptions
from common.utils.pyutils import Sentinel, all_combinations, cloned, raises, with_attrs
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.db.models.deletion import ProtectedError
from django.utils.functional import classproperty
from django.utils.translation import gettext as _
from django_filters.rest_framework.filterset import FilterSet
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest.utils.schema_helpers import error_serializer, fake_list_serializer, fake_serializer
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE = Sentinel("REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE")

django_to_drf_validation_error = TransformExceptions(
    ValidationError,
    transform=lambda e: DRFValidationError(detail=e.message_dict),
)


class BaseModelViewSet(ModelViewSet):
    endpoint = REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE
    model = REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE
    serializer_class = REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE
    allow_reverse_ordering = True
    all_viewsets = {}
    filterset_fields = {}
    declared_filters = {}
    serializer_class_action_map = {}
    ordering = ["created_at"]  # This is overwritten by the order query parameter
    filterset_base = FilterSet
    crud_extend_default_schema = {}
    disallowed_methods = []
    ordering_fields = []
    action_permissions = {}
    request = None  # This is a hack around drf-spectacular not passing the request to the viewset methods
    action = None  # This is a hack around drf-spectacular not passing the action to the viewset methods

    perform_create = django_to_drf_validation_error(ModelViewSet.perform_create)
    perform_update = django_to_drf_validation_error(ModelViewSet.perform_update)
    perform_destroy = django_to_drf_validation_error(ModelViewSet.perform_destroy)

    SWAGGER_UTILITY_EXCEPTION = type("SwaggerUtilityException", (Exception,), {})

    def get_serializer_class(self):
        return self.serializer_class_action_map.get(self.action) or self.serializer_class or None

    @classproperty
    def search_fields(cls):  # NOQA
        return [cls.model.pk.name]  # NOQA

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            raise self.SWAGGER_UTILITY_EXCEPTION
        return self.model.objects.all()  # NOQA

    @classproperty
    def filterset_class(cls):  # NOQA
        meta_base = getattr(cls.filterset_base, "Meta", object)  # NOQA
        model, filters = cls.model, cls.filterset_fields
        meta = type("Meta", (meta_base,), {"model": model, "fields": filters})
        filterset = type("AutoFilterSet", (cls.filterset_base,), {**cls.declared_filters, "Meta": meta})  # NOQA
        return filterset

    @with_attrs(
        default_400_schema=lambda name: fake_serializer(
            name=name,
            schema={
                "protected_elements": fake_list_serializer(
                    fake_serializer(name="ProtectedElement", schema={"id": "uuid", "type": str}, readonly=True),
                )
            },
            readonly=True,
        ),
    )
    def destroy(self, request, *args, **kwargs):
        # If possible, delete the object cascading related objects that depends on this.
        # If there are any protected objects, return a 400 response with the protected objects.
        # If protected objets are less than {protected_object_count} return a 400 response with the protected objects
        # and respective endpoints, else return a 400 response with the protected object types.
        # TODO: fix documentation, we don't want to overwrite the docstring, we want to combine
        # This is used in the openapi schema so it is important
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError as protected_error:
            protected_objects = protected_error.protected_objects
            data = [{"id": po.pk, "type": type(po).__name__} for po in protected_objects]
            response_data = {"protected_elements": data}
            return Response(data=response_data, status=status.HTTP_400_BAD_REQUEST)

    def __init_subclass__(cls, **kwargs):
        cls._allow_reverse_ordering()
        cls._required_attribute("model")
        cls._required_attribute("endpoint")
        cls._required_attribute("serializer_class")
        cls._override_crud_methods()
        cls._disallowed_methods()
        cls._register_viewset()
        cls._if_swagger_return_objects_none()
        return super().__init_subclass__(**kwargs)

    @classmethod
    def _if_swagger_return_objects_none(cls):
        def wrapper(get_queryset):
            @wraps(get_queryset)
            def get_queryset_(self):
                try:
                    return get_queryset(self)
                except cls.SWAGGER_UTILITY_EXCEPTION:
                    return self.model.objects.none()

            return get_queryset_

        cls.get_queryset = wrapper(cls.get_queryset)

    @classmethod
    def _allow_reverse_ordering(cls):
        ordering_fields = getattr(cls, "ordering_fields", [])
        if cls.allow_reverse_ordering:
            cls.ordering_fields = ordering_fields + [f"-{field}" for field in ordering_fields]

    @classmethod
    def _register_viewset(cls):
        if cls.model in cls.all_viewsets:
            error_message = f"Viewset for {cls.model} already exists - why are you trying to create another one?"
            raise ImproperlyConfigured(error_message)
        cls.all_viewsets[cls.model] = cls

    @classmethod
    def _required_attribute(cls, name):
        if getattr(cls, name, REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE) is REQUIRED_BASE_MODEL_VIEWSET_ATTRIBUTE:
            raise ImproperlyConfigured(f"{cls.__name__} must define a {name} attribute")

    @classmethod
    def get_viewset_for_model(cls, model):
        return cls.all_viewsets.get(model)

    @classmethod
    def _override_crud_methods(cls):
        override = lambda method, replacement: method if method.__name__ in cls.__dict__ else replacement
        extra_schema = lambda key: cls.crud_extend_default_schema.get(key, {})
        cls.list = override(cls.list, cls._make_list(**extra_schema("list")))
        cls.retrieve = override(cls.retrieve, cls._make_retrieve(**extra_schema("retrieve")))
        cls.create = override(cls.create, cls._make_create(**extra_schema("create")))
        cls.update = override(cls.update, cls._make_update(**extra_schema("update")))
        cls.partial_update = override(cls.partial_update, cls._make_partial_update(**extra_schema("partial_update")))
        cls.destroy = override(cls.destroy, cls._make_destroy(**extra_schema("destroy")))

    @classmethod
    def _disallowed_methods(cls):
        def override(method):
            method_name = method.__name__
            message = _(f"{method_name} is not allowed for this endpoint")
            disallowed = extend_schema(exclude=True)(raises(MethodNotAllowed(message)))
            return method if method_name not in cls.disallowed_methods else disallowed

        cls.list = override(cls.list)
        cls.retrieve = override(cls.retrieve)
        cls.create = override(cls.create)
        cls.update = override(cls.update)
        cls.partial_update = override(cls.partial_update)
        cls.destroy = override(cls.destroy)

    @classmethod
    def _make_list(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        include_fields = list(cls.serializer_class.Meta.relational_fields.keys())  # NOQA
        ordering_fields = cls.ordering_fields  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"List {meta.verbose_name_plural}",
                description=f"List {meta.verbose_name_plural.lower()} with optional filters",
                parameters=[
                    OpenApiParameter(
                        "include",
                        type=OpenApiTypes.STR,
                        style="form",
                        explode=False,
                        enum=[",".join(c) for c in all_combinations(include_fields)],
                    ),
                    OpenApiParameter(
                        "ordering",
                        type=OpenApiTypes.STR,
                        style="form",
                        explode=False,
                        enum=cls.ordering_fields,
                    ),
                ],
                responses={
                    200: cls.serializer_class(many=True),  # NOQA, __init_subclass__ ensures cls.serializer_class is set
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        list_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.list))
        return list_method

    @classmethod
    def _make_retrieve(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        include_fields = list(cls.serializer_class.Meta.relational_fields.keys())  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"Retrieve {meta.verbose_name}",
                description=f"Retrieve {meta.verbose_name.lower()} by id",
                parameters=[
                    OpenApiParameter(
                        "include",
                        type=OpenApiTypes.STR,
                        style="form",
                        explode=False,
                        enum=[",".join(c) for c in all_combinations(include_fields)],
                    ),
                ],
                responses={
                    200: cls.serializer_class,
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        retrieve_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.retrieve))
        return retrieve_method

    @classmethod
    def _make_create(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"Create {meta.verbose_name}",
                description=f"Create a new {meta.verbose_name.lower()}",
                responses={
                    201: cls.serializer_class,
                    400: error_serializer(cls.serializer_class),
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        create_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.create))
        return create_method

    @classmethod
    def _make_update(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"Put {meta.verbose_name}",
                description=f"Update an existing {meta.verbose_name.lower()} by id",
                request=fake_serializer(
                    name=f"{cls.model.__name__}UpdateSerializer",
                    base=cls.serializer_class,
                ),
                responses={
                    200: cls.serializer_class,
                    400: error_serializer(cls.serializer_class),
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        update_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.update))
        return update_method

    @classmethod
    def _make_partial_update(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"Patch {meta.verbose_name}",
                description=f"Partially update an existing {meta.verbose_name.lower()} by id",
                request=fake_serializer(
                    name=f"{cls.model.__name__}UpdateSerializer",
                    base=cls.serializer_class,
                ),
                responses={
                    200: cls.serializer_class,
                    400: error_serializer(cls.serializer_class),
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        partial_update_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.partial_update))
        return partial_update_method

    @classmethod
    def _make_destroy(cls, **extend_schema_kwargs):
        meta = cls.model._meta  # NOQA
        extend_schema_kwargs = (
            dict(
                summary=f"Delete {meta.verbose_name}",
                description=f"Delete an existing {meta.verbose_name} by id",
                responses={
                    204: None,
                    400: BaseModelViewSet.destroy.default_400_schema(f"{cls.model.__name__}DestroyError"),
                    401: None,
                    403: fake_serializer("Forbidden", schema={"detail": str}),
                },
            )
            | extend_schema_kwargs
        )
        destroy_method = extend_schema(**extend_schema_kwargs)(cloned(BaseModelViewSet.destroy))
        return destroy_method
