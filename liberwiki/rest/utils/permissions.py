from django.utils.translation import gettext as _
from rest_framework.permissions import SAFE_METHODS, BasePermission


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


def is_owner(owner_field):
    def has_object_permission(self, request, view, obj):  # NOQA
        owner = getattr(obj, owner_field, None)
        return bool(owner and owner == request.user)

    name = f"IsOwnerPermission(owner_field={owner_field})"
    bases = (BasePermission,)
    attrs = dict(
        message=_(f"User is not the owner of the object"),
        has_object_permission=has_object_permission,
    )
    return type(name, bases, attrs)


def prevent_actions(*actions):
    # Default action values for model viewset: "create", "list", "retrieve", "update", "partial_update", "destroy"
    def has_permission(self, request, view):  # NOQA
        return view.action not in actions

    name = f"PreventActionsPermission(actions={actions})"
    bases = (BasePermission,)
    attrs = dict(
        message=_(f"Actions should not be: {actions}"),
        has_permission=has_permission,
    )
    return type(name, bases, attrs)


def user_property(property_):
    def has_permission(self, request, view):  # NOQA
        has_perm = property_.fget(request.user)
        if hasattr(has_perm, "reason"):
            self.message = has_perm.reason
        return has_perm

    def has_object_permission(self, request, view, obj):  # NOQA
        has_perm = property_.fget(request.user)
        if hasattr(has_perm, "reason"):
            self.message = has_perm.reason
        return has_perm

    property_name = property_.fget.__name__
    name = f"UserAttributePermission(property={property_name})"
    bases = (BasePermission,)
    attrs = dict(
        message=_(f"User property {property_name} is False"),
        has_permission=has_permission,
        has_object_permission=has_object_permission,
    )
    return type(name, bases, attrs)


def user_role_at_least(role):
    def has_permission(self, request, view):  # NOQA
        return request.user.role_is_at_least(role)

    def has_object_permission(self, request, view, obj):  # NOQA
        return request.user.role_is_at_least(role)

    name = f"UserRoleAtLeastPermission(role={role})"
    bases = (BasePermission,)
    attrs = dict(
        message=_(f"User role should be at least {role}"),
        has_permission=has_permission,
        has_object_permission=has_object_permission,
    )
    return type(name, bases, attrs)


class IsAnonymous(BasePermission):
    """
    Custom permission to only allow access to unauthenticated users (anonymous).
    """

    def has_permission(self, request, view):
        # Return True only if the user is not authenticated
        return not request.user.is_authenticated


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)
