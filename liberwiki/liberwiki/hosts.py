from django_hosts import host, patterns

host_patterns = patterns(
    "",
    host(r"api", "liberwiki.urls.api", name="api"),
    host(r"admin", "liberwiki.urls.admin", name="beta"),
)
