#!/bin/sh

set -e
echo name = $NEXT_PUBLIC_LIBERWIKI__NAME
echo api_uri = $NEXT_PUBLIC_LIBERWIKI__API__BASE_URL
echo language = $NEXT_PUBLIC_LIBERWIKI__LANGUAGE
exec npm run start
