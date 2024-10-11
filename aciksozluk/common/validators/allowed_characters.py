from common.utils.pyutils import first_of, not_none
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _


@deconstructible
class AllowedCharactersValidator:
    allowed_characters = ""
    allowed_first = ""
    allowed_last = ""
    message = _("Enter a valid value containing only the allowed characters. {allowed_characters}")
    code = "invalid"

    def __init__(self, allowed_characters, allowed_first=None, allowed_last=None, message=None, code=None):
        self.allowed_characters = allowed_characters
        self.allowed_first = first_of([allowed_first, allowed_characters], pred=not_none)
        self.allowed_last = first_of([allowed_last, allowed_characters], pred=not_none)
        message = first_of([message, self.message], pred=not_none)
        self.message = message.format(allowed_characters=self.input_adjustments(self.allowed_characters))
        self.code = first_of([code, self.code], pred=not_none)

    @staticmethod
    def _force_unique(value):
        return "".join(sorted(set(value), key=value.index))

    @staticmethod
    def _force_python_escape(value):
        # If you have a % in the string, django's naive error_message % {value: value} failes
        # due to % being a special character in % formatting that escapes itself.
        if "%" in value:
            return value.replace("%", "%%")
        return value

    @classmethod
    def input_adjustments(cls, value):
        return cls._force_python_escape(cls._force_unique(value))

    def _raise_if_invalid(self, should_raise, value):
        if should_raise:
            raise ValidationError(self.message, code=self.code, params={"value": value})

    def __call__(self, value):
        """
        Validate that the input contains only the allowed characters and starts/ends with allowed characters.
        """
        value = str(value)
        self._raise_if_invalid(value[0] not in self.allowed_first, value)
        self._raise_if_invalid(value[-1] not in self.allowed_last, value)
        self._raise_if_invalid(any(char not in self.allowed_characters for char in value), value)

    def __eq__(self, other):
        return (
            isinstance(other, AllowedCharactersValidator)
            and self.allowed_characters == other.allowed_characters
            and self.allowed_first == other.allowed_first
            and self.allowed_last == other.allowed_last
            and (self.message == other.message)
            and (self.code == other.code)
        )
