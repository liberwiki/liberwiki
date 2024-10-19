from common.utils.pyutils import returns
from django.contrib.admin import ModelAdmin


class BaseModelAdmin(ModelAdmin):
    has_add_permission = returns(False)  # Most of the time we don't want anything to be added from the admin panel

    @staticmethod
    def _ensure_list(value):
        return list(value or [])

    @staticmethod
    def fieldset_field(label, fields, collapse=True):
        classes = ["collapse"] if collapse else []
        return label, {"fields": fields, "classes": classes}

    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields if obj else []

    def get_fields(self, request, obj=None):
        fields = self._ensure_list(self.fields)
        readonly_fields = self._ensure_list(self.readonly_fields)
        return fields + readonly_fields if obj else fields
