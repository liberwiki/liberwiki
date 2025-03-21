from allauth.headless.constants import Client
from allauth.headless.urls import build_urlpatterns
from django.urls import include, path
from django.urls.resolvers import RoutePattern


def build_allauth_url_patterns(env):
    path_object = build_urlpatterns(env)[0]
    path_object.pattern = RoutePattern("")
    return [path_object]


urlpatterns = [
    path("~/", include(build_allauth_url_patterns(Client.APP))),
    path("", include(build_allauth_url_patterns(Client.BROWSER))),
    path("", include("allauth.urls")),
]
