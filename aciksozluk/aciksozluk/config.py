from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config

load_dotenv()

CONFIG = config(
    {
        "DEBUG": boolean,
        "DB": {
            "NAME": str,
            "USER": str,
            "PASSWORD": str,
            "HOST": str,
            "PORT": str,
        },
        "SECRET_KEY": str,
        "HOST": str,
        "ALLOWED_HOSTS": comma_separated_list,
        "AUTH": {
            "VERIFY_EMAIL_URL_TEMPLATE": str,
        },
    },
    prefix="ACIKSOZLUK",
    sep="__",
)
