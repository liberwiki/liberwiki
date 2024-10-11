from django.urls import include, path
from drf_spectacular.utils import extend_schema
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest.views import AuthViewSet, EntryViewSet, TitleViewSet, UserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

viewsets = [EntryViewSet, TitleViewSet, UserViewSet, AuthViewSet]

for viewset in viewsets:
    router.register(viewset.endpoint, viewset, basename=viewset.endpoint)

# Documentation

SCHEMA_URL_NAME = "openapi-schema-v0"

v0_urlpatterns = [
    path(
        "openapi-schema/",
        extend_schema(exclude=True)(SpectacularAPIView).as_view(),
        name=SCHEMA_URL_NAME,
    ),
    path(
        "redoc/",
        SpectacularRedocView.as_view(url_name=f"rest:v0:{SCHEMA_URL_NAME}"),
        name="redoc",
    ),
    *router.urls,
]

# urlpatterns v0 configuration, when moving to v2 move all current patterns to rest.v0 app and restructure this file

app_name = "rest"
urlpatterns = [
    # All url patterns here ideally must be versioned includes of the sub apps like v0, v1, v2
    # Not really a good idea to include a non versioned url and point it to say the latest or the initial version
    # v0 means it is subject to change without notice - it is not a stable version and is not open to public yet.
    path("v0/", include((v0_urlpatterns, "rest"), namespace="v0")),
]
