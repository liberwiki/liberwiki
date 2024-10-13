#!/bin/sh

set -e
python manage.py migrate
python manage.py setup
python manage.py collectstatic --noinput
exec uwsgi --ini /aciksozluk/uwsgi.ini
