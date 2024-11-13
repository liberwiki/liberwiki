from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q


class UsernameOREmailModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user_model = get_user_model()
        if username is None:
            username = kwargs.get(user_model.USERNAME_FIELD)
        try:
            lookup = Q(**{user_model.EMAIL_FIELD: username}) | Q(**{user_model.USERNAME_FIELD: username})
            user = user_model._default_manager.get(lookup)  # NOQA: accessing protected attribute
        except user_model.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            user_model().set_password(password)
        else:
            if user.check_password(password):
                return user
