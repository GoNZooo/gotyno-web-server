import * as svt from "simple-validation-tools";

export type Maybe<T> = Nothing | Just<T>;

export enum MaybeTag {
    Nothing = "Nothing",
    Just = "Just",
}

export type Nothing = {
    type: MaybeTag.Nothing;
};

export type Just<T> = {
    type: MaybeTag.Just;
    data: T;
};

export function Nothing(): Nothing {
    return {type: MaybeTag.Nothing};
}

export function Just<T>(data: T): Just<T> {
    return {type: MaybeTag.Just, data};
}

export function isMaybe<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<Maybe<T>> {
    return function isMaybeT(value: unknown): value is Maybe<T> {
        return [isNothing, isJust(isT)].some((typePredicate) => typePredicate(value));
    };
}

export function isNothing(value: unknown): value is Nothing {
    return svt.isInterface<Nothing>(value, {type: MaybeTag.Nothing});
}

export function isJust<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<Just<T>> {
    return function isJustT(value: unknown): value is Just<T> {
        return svt.isInterface<Just<T>>(value, {type: MaybeTag.Just, data: isT});
    };
}

export function validateMaybe<T>(validateT: svt.Validator<T>): svt.Validator<Maybe<T>> {
    return function validateMaybeT(value: unknown): svt.ValidationResult<Maybe<T>> {
        return svt.validateWithTypeTag<Maybe<T>>(value, {[MaybeTag.Nothing]: validateNothing, [MaybeTag.Just]: validateJust(validateT)}, "type");
    };
}

export function validateNothing(value: unknown): svt.ValidationResult<Nothing> {
    return svt.validate<Nothing>(value, {type: MaybeTag.Nothing});
}

export function validateJust<T>(validateT: svt.Validator<T>): svt.Validator<Just<T>> {
    return function validateJustT(value: unknown): svt.ValidationResult<Just<T>> {
        return svt.validate<Just<T>>(value, {type: MaybeTag.Just, data: validateT});
    };
}

export type Either<L, R> = Left<L> | Right<R>;

export enum EitherTag {
    Left = "Left",
    Right = "Right",
}

export type Left<L> = {
    type: EitherTag.Left;
    data: L;
};

export type Right<R> = {
    type: EitherTag.Right;
    data: R;
};

export function Left<L>(data: L): Left<L> {
    return {type: EitherTag.Left, data};
}

export function Right<R>(data: R): Right<R> {
    return {type: EitherTag.Right, data};
}

export function isEither<L, R>(isL: svt.TypePredicate<L>, isR: svt.TypePredicate<R>): svt.TypePredicate<Either<L, R>> {
    return function isEitherLR(value: unknown): value is Either<L, R> {
        return [isLeft(isL), isRight(isR)].some((typePredicate) => typePredicate(value));
    };
}

export function isLeft<L>(isL: svt.TypePredicate<L>): svt.TypePredicate<Left<L>> {
    return function isLeftL(value: unknown): value is Left<L> {
        return svt.isInterface<Left<L>>(value, {type: EitherTag.Left, data: isL});
    };
}

export function isRight<R>(isR: svt.TypePredicate<R>): svt.TypePredicate<Right<R>> {
    return function isRightR(value: unknown): value is Right<R> {
        return svt.isInterface<Right<R>>(value, {type: EitherTag.Right, data: isR});
    };
}

export function validateEither<L, R>(validateL: svt.Validator<L>, validateR: svt.Validator<R>): svt.Validator<Either<L, R>> {
    return function validateEitherLR(value: unknown): svt.ValidationResult<Either<L, R>> {
        return svt.validateWithTypeTag<Either<L, R>>(value, {[EitherTag.Left]: validateLeft(validateL), [EitherTag.Right]: validateRight(validateR)}, "type");
    };
}

export function validateLeft<L>(validateL: svt.Validator<L>): svt.Validator<Left<L>> {
    return function validateLeftL(value: unknown): svt.ValidationResult<Left<L>> {
        return svt.validate<Left<L>>(value, {type: EitherTag.Left, data: validateL});
    };
}

export function validateRight<R>(validateR: svt.Validator<R>): svt.Validator<Right<R>> {
    return function validateRightR(value: unknown): svt.ValidationResult<Right<R>> {
        return svt.validate<Right<R>>(value, {type: EitherTag.Right, data: validateR});
    };
}