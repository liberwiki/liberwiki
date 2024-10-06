from common.utils.error_handling import TransformExceptions
from common.utils.pyutils import Sentinel, with_attrs
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.db.models.deletion import ProtectedError
from django.utils.functional import classproperty
from django_filters.rest_framework.filterset import FilterSet
from rest.utils.permissions import ReadOnly
from rest.utils.schema_helpers import fake_list_serializer, fake_serializer
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
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
    permission_classes = [(IsAuthenticated & DjangoModelPermissions) | ReadOnly]
    all_viewsets = {}
    filterset_fields = {}
    declared_filters = {}
    serializer_class_action_map = {}
    ordering = ["created_at"]  # This is overwritten by the order query parameter
    filterset_base = FilterSet

    perform_create = django_to_drf_validation_error(ModelViewSet.perform_create)
    perform_update = django_to_drf_validation_error(ModelViewSet.perform_update)
    perform_destroy = django_to_drf_validation_error(ModelViewSet.perform_destroy)

    def get_serializer_class(self):
        return self.serializer_class_action_map.get(self.action) or self.serializer_class or None

    @classproperty
    def ordering_fields(cls):  # NOQA
        return list(cls.filterset_fields.keys())

    @classproperty
    def search_fields(cls):  # NOQA
        return [cls.model.pk.name]  # NOQA

    def get_queryset(self):
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
        )
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
        cls._register_viewset()
        cls._required_attribute("model")
        cls._required_attribute("endpoint")
        cls._required_attribute("serializer_class")
        return super().__init_subclass__(**kwargs)

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
