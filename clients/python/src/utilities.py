import json
import typing
from dataclasses import dataclass
from gotyno_validation import validation
from gotyno_validation import encoding

T = typing.TypeVar('T')
class Maybe(typing.Generic[T]):
    @staticmethod
    def validate(validate_T: validation.Validator[T]) -> validation.Validator['Maybe[T]']:
        def validate_MaybeT(value: validation.Unknown) -> validation.ValidationResult['Maybe[T]']:
            return validation.validate_with_type_tags(value, 'type', {'Nothing': Nothing.validate, 'Just': Just.validate(validate_T)})
        return validate_MaybeT

    @staticmethod
    def decode(string: typing.Union[str, bytes], validate_T: validation.Validator[T]) -> validation.ValidationResult['Maybe[T]']:
        return validation.validate_from_string(string, Maybe.validate(validate_T))

    def to_json(self, T_to_json: encoding.ToJSON[T]) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError('`to_json` is not implemented for base class `Maybe`')

    def encode(self) -> str:
        raise NotImplementedError('`encode` is not implemented for base class `Maybe`')

@dataclass(frozen=True)
class Nothing(Maybe[T]):
    @staticmethod
    def validate(value: validation.Unknown) -> validation.ValidationResult['Nothing']:
        return validation.validate_with_type_tag(value, 'type', 'Nothing', {}, Nothing)

    @staticmethod
    def decode(string: typing.Union[str, bytes]) -> validation.ValidationResult['Nothing']:
        return validation.validate_from_string(string, Nothing.validate)

    def to_json(self, T_to_json: encoding.ToJSON[T]) -> typing.Dict[str, typing.Any]:
        return {'type': 'Nothing'}

    def encode(self, T_to_json: encoding.ToJSON[T]) -> str:
        return json.dumps(self.to_json(T_to_json))

@dataclass(frozen=True)
class Just(Maybe[T]):
    data: T

    @staticmethod
    def validate(validate_T: validation.Validator[T]) -> validation.Validator['Just[T]']:
        def validate_JustT(value: validation.Unknown) -> validation.ValidationResult['Just[T]']:
            return validation.validate_with_type_tag(value, 'type', 'Just', {'data': validate_T}, Just)
        return validate_JustT

    @staticmethod
    def decode(string: typing.Union[str, bytes], validate_T: validation.Validator[T]) -> validation.ValidationResult['Just[T]']:
        return validation.validate_from_string(string, Just.validate(validate_T))

    def to_json(self, T_to_json: encoding.ToJSON[T]) -> typing.Dict[str, typing.Any]:
        return {'type': 'Just', 'data': T_to_json(self.data)}

    def encode(self, T_to_json: encoding.ToJSON[T]) -> str:
        return json.dumps(self.to_json(T_to_json))

L = typing.TypeVar('L')
R = typing.TypeVar('R')
class Either(typing.Generic[L, R]):
    @staticmethod
    def validate(validate_L: validation.Validator[L], validate_R: validation.Validator[R]) -> validation.Validator['Either[L, R]']:
        def validate_EitherLR(value: validation.Unknown) -> validation.ValidationResult['Either[L, R]']:
            return validation.validate_with_type_tags(value, 'type', {'Left': Left.validate(validate_L), 'Right': Right.validate(validate_R)})
        return validate_EitherLR

    @staticmethod
    def decode(string: typing.Union[str, bytes], validate_L: validation.Validator[L], validate_R: validation.Validator[R]) -> validation.ValidationResult['Either[L, R]']:
        return validation.validate_from_string(string, Either.validate(validate_L, validate_R))

    def to_json(self, L_to_json: encoding.ToJSON[L],R_to_json: encoding.ToJSON[R]) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError('`to_json` is not implemented for base class `Either`')

    def encode(self) -> str:
        raise NotImplementedError('`encode` is not implemented for base class `Either`')

@dataclass(frozen=True)
class Left(Either[L, R]):
    data: L

    @staticmethod
    def validate(validate_L: validation.Validator[L]) -> validation.Validator['Left[L]']:
        def validate_LeftL(value: validation.Unknown) -> validation.ValidationResult['Left[L]']:
            return validation.validate_with_type_tag(value, 'type', 'Left', {'data': validate_L}, Left)
        return validate_LeftL

    @staticmethod
    def decode(string: typing.Union[str, bytes], validate_L: validation.Validator[L]) -> validation.ValidationResult['Left[L]']:
        return validation.validate_from_string(string, Left.validate(validate_L))

    def to_json(self, L_to_json: encoding.ToJSON[L], R_to_json: encoding.ToJSON[R]) -> typing.Dict[str, typing.Any]:
        return {'type': 'Left', 'data': L_to_json(self.data)}

    def encode(self, L_to_json: encoding.ToJSON[L], R_to_json: encoding.ToJSON[R]) -> str:
        return json.dumps(self.to_json(L_to_json, R_to_json))

@dataclass(frozen=True)
class Right(Either[L, R]):
    data: R

    @staticmethod
    def validate(validate_R: validation.Validator[R]) -> validation.Validator['Right[R]']:
        def validate_RightR(value: validation.Unknown) -> validation.ValidationResult['Right[R]']:
            return validation.validate_with_type_tag(value, 'type', 'Right', {'data': validate_R}, Right)
        return validate_RightR

    @staticmethod
    def decode(string: typing.Union[str, bytes], validate_R: validation.Validator[R]) -> validation.ValidationResult['Right[R]']:
        return validation.validate_from_string(string, Right.validate(validate_R))

    def to_json(self, L_to_json: encoding.ToJSON[L], R_to_json: encoding.ToJSON[R]) -> typing.Dict[str, typing.Any]:
        return {'type': 'Right', 'data': R_to_json(self.data)}

    def encode(self, L_to_json: encoding.ToJSON[L], R_to_json: encoding.ToJSON[R]) -> str:
        return json.dumps(self.to_json(L_to_json, R_to_json))