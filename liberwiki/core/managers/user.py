from common.utils.orm_annotations import starts_with
from django.contrib.auth.models import UserManager as BaseUserManager


class UserManager(BaseUserManager):
    def get_queryset(self):
        qs = super().get_queryset()
        username_field = self.model.USERNAME_FIELD
        signup_completed_field = self.model.SIGNUP_COMPLETED_FIELD
        unusable_username_prefix = self.model.UNUSABLE_USERNAME_PREFIX
        annotated_qs = qs.annotate(**{signup_completed_field: starts_with(username_field, unusable_username_prefix)})
        return annotated_qs
