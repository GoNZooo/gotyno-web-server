module Utilities

open Thoth.Json.Net

type Maybe<'t> =
    | Nothing
    | Just of 't

    static member NothingDecoder: Decoder<Maybe<'t>> =
        Decode.succeed Nothing

    static member JustDecoder decodeT: Decoder<Maybe<'t>> =
        Decode.object (fun get -> Just(get.Required.Field "data" decodeT))

    static member Decoder decodeT: Decoder<Maybe<'t>> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "Nothing", Maybe.NothingDecoder
                "Just", Maybe.JustDecoder decodeT
            |]

    static member Encoder encodeT =
        function
        | Nothing ->
            Encode.object [ "type", Encode.string "Nothing" ]

        | Just payload ->
            Encode.object [ "type", Encode.string "Just"
                            "data", encodeT payload ]

type Either<'l, 'r> =
    | Left of 'l
    | Right of 'r

    static member LeftDecoder decodeL: Decoder<Either<'l, 'r>> =
        Decode.object (fun get -> Left(get.Required.Field "data" decodeL))

    static member RightDecoder decodeR: Decoder<Either<'l, 'r>> =
        Decode.object (fun get -> Right(get.Required.Field "data" decodeR))

    static member Decoder decodeL decodeR: Decoder<Either<'l, 'r>> =
        GotynoCoders.decodeWithTypeTag
            "type"
            [|
                "Left", Either.LeftDecoder decodeL
                "Right", Either.RightDecoder decodeR
            |]

    static member Encoder encodeL encodeR =
        function
        | Left payload ->
            Encode.object [ "type", Encode.string "Left"
                            "data", encodeL payload ]

        | Right payload ->
            Encode.object [ "type", Encode.string "Right"
                            "data", encodeR payload ]