def monkeypatch_drf_spectacular():
    # https://github.com/tfranzel/drf-spectacular/issues/1311
    import urllib.parse

    import drf_spectacular.views

    # Define your patched function
    def set_query_parameters(url, **kwargs) -> str:
        """Deconstruct URL, safely attach query parameters in kwargs, and serialize again"""
        scheme, netloc, path, params, query, fragment = urllib.parse.urlparse(str(url))
        query = urllib.parse.parse_qs(query)
        query.update({k: v for k, v in kwargs.items() if v is not None})
        query = urllib.parse.urlencode(query, doseq=True)
        return urllib.parse.urlunparse((scheme, netloc, path, params, query, fragment))

    drf_spectacular.views.set_query_parameters = set_query_parameters
