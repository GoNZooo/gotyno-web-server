# Clients

The test clients are supposed to test encoding and decoding from the client side
view for messages. This stresses mostly the same areas as server-side, but it's
a useful distinction to make for the most part. Ideally every language would
have both a server and a client, but it's unlikely that Python will see a server
made unless someone else makes it, because it's such a tedious language to use
in general.

## Running the server

In the root directory, run the server with:

```
$ yarn ts-node src/server.ts 
Listening on localhost:8080
```

If you need types to be rebuilt, make sure you have
[`gotyno-hs`](https://github.com/GoNZooo/gotyno-hs) and do the following in the
root directory:

```
$ yarn build:types:watch
Watching directory: '<ABSOLUTE_PATH_TO_THE_GOTYNO_DIRECTORY>'
```

This will watch your Gotyno files for changes and automatically recompile when
they change.

## Running the F# client

The F# client can be run from `clients/fsharp/GotynoClient` with the command:

```
dotnet run
```

The command should remain the same for both Windows and Linux, though I've only
tried it via WSL.

## Running the Python client

The Python client can be run from the `clients/python` directory as follows:

```bash
python3 -m src.client
```

This should automatically run the `test()` function and any failing asserts mean
that either some behavior is wrong somewhere or there is some kind of
encoding/decoding error.