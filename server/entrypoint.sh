#!/bin/sh

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" < /server/template.nginx.conf > /server/nginx.conf

exec nginx -c /server/nginx.conf -g 'daemon off;'
