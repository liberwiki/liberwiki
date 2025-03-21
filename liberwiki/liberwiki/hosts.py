from django.conf import settings
from django_hosts import host, patterns

host_patterns = patterns(
    "",
    host(settings.API_SUBDOMAIN, "liberwiki.urls.api", name=settings.API_SUBDOMAIN),
    host(settings.ADMIN_SUBDOMAIN, "liberwiki.urls.admin", name=settings.ADMIN_SUBDOMAIN),
    host(settings.AUTH_SUBDOMAIN, "liberwiki.urls.auth", name=settings.AUTH_SUBDOMAIN),
)
