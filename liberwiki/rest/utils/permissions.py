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
        message=f"User is not the owner of the object",
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
        message=f"Actions should not be: {actions}",
        has_permission=has_permission,
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
