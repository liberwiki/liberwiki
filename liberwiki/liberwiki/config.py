from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config

load_dotenv()

CONFIG = config(
    {
        "NAME": str,
        "DEBUG": boolean,
        "DB": {
            "NAME": str,
            "USER": str,
            "PASSWORD": str,
            "HOST": str,
            "PORT": str,
        },
        "SECRET_KEY": str,
        "ALLOWED_HOSTS": comma_separated_list,
        "HOSTS": {
            "DOMAIN": str,
            "API_SUBDOMAIN": str,
            "ADMIN_SUBDOMAIN": str,
        },
        "SETUP": {
            "SUPERUSER": {
                "USERNAME": str,
                "EMAIL": str,
                "PASSWORD": str,
            },
        },
        "LANGUAGE": str,
        "EMAIL": {
            "SMTP": {
                "HOST": str,
                "PORT": {"TSL": int},
                "USER": str,
                "PASSWORD": str,
            },
            "DEFAULT_VERIFICATION_FROM_EMAIL": str,
        },
        "DEVTOOLS": {
            "SENTRY": {
                "DSN": str,
                "TRACES_SAMPLE_RATE": str,
            },
        },
    },
    prefix="LIBERWIKI",
    sep="__",
)
