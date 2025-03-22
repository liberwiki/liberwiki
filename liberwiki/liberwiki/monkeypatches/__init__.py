from .allauth import monkeypatch_allauth_oauth2_client
from .drf_spectacular import monkeypatch_drf_spectacular

__all__ = [
    "monkeypatch_drf_spectacular",
    "monkeypatch_allauth_oauth2_client",
]
