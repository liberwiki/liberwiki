"""
WSGI config for liberwiki project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from liberwiki.monkeypatches import (
    monkeypatch_allauth_oauth2_client,
    monkeypatch_allauth_username_email_login,
    monkeypatch_drf_spectacular,
)

monkeypatch_drf_spectacular()


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "liberwiki.settings")

application = get_wsgi_application()

monkeypatch_allauth_username_email_login()  # Requires apps to be loaded
monkeypatch_allauth_oauth2_client()  # Requires apps to be loaded
