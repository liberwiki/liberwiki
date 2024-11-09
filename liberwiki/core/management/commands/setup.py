from core.models import User
from django.core.management import BaseCommand

from liberwiki.config import CONFIG


class Command(BaseCommand):
    help = "Setup necessary data and configuration for the project."

    def handle(self, *args, **options):
        self.check_admin_user()

    def check_admin_user(self):
        self.stdout.write("Checking admin user.")
        admin_exists = User.objects.filter(is_superuser=True).exists()
        if admin_exists:
            self.stdout.write("Admin user already exists. Skipping admin user creation.")
        else:
            self.stdout.write("Admin user does not exist. Trying to create one from environment variables.")
            User.objects.create_superuser(
                username=CONFIG.SETUP.SUPERUSER.USERNAME,
                email=CONFIG.SETUP.SUPERUSER.EMAIL,
                password=CONFIG.SETUP.SUPERUSER.PASSWORD,
                role=User.Roles.__all__[-1],  # Last role is always the highest
            )
