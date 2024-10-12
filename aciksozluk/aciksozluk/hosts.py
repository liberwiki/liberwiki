from django_hosts import host, patterns

host_patterns = patterns(
    "",
    host(r"api", "aciksozluk.urls.api", name="api"),
    host(r"admin", "aciksozluk.urls.admin", name="beta"),
)
