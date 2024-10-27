#!/bin/sh

set -e
python manage.py compilemessages
python manage.py migrate
python manage.py setup
python manage.py collectstatic --noinput
exec uwsgi --ini /liberwiki/uwsgi.ini
