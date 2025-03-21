from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config, integer, string

load_dotenv(verbose=True, override=False)

CONFIG = config(
    {
        "NAME": string(),
        "DEBUG": boolean(),
        "DB": {
            "NAME": string(),
            "USER": string(),
            "PASSWORD": string(),
            "HOST": string(),
            "PORT": string(),
        },
        "SECRET_KEY": string(),
        "ALLOWED_HOSTS": comma_separated_list(),
        "HOSTS": {
            "DOMAIN": string(),
            "API_SUBDOMAIN": string(),
            "ADMIN_SUBDOMAIN": string(),
            "AUTH_SUBDOMAIN": string(),
        },
        "OAUTH": {
            "GOOGLE": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
            "MICROSOFT": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
        },
        "SETUP": {
            "SUPERUSER": {
                "USERNAME": string(),
                "EMAIL": string(),
                "PASSWORD": string(),
            },
        },
        "LANGUAGE": string(),
        "EMAIL": {
            "SMTP": {
                "HOST": string(),
                "PORT": {"TSL": integer()},
                "USER": string(),
                "PASSWORD": string(),
            },
            "DEFAULT_AUTH_FROM_EMAIL": string(),
        },
        "DEVTOOLS": {
            "SENTRY": {
                "DSN": string(),
                "TRACES_SAMPLE_RATE": string(),
            },
        },
        "APP": {
            "TITLE_NAME_ALLOWED_EXTRA_CHARS": string(),
            "TITLE_SLUG_CHARACTERS_LANGUAGE_MAP": string(),
        },
    },
    prefix="LIBERWIKI",
    sep="__",
)
