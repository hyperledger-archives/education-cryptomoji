# Cryptomoji Client

In many ways building a web app as a client to a Sawtooth blockchain is not
much different than building a web app for any server. You will create some
React components that will display the data you _GET_ from a REST API. Users
will fill out forms and you will take that information and _POST_ it. Of
course, everything you _GET_ will be a base64 encoded binary file, and all of
your _POSTs_ will be cryptographically signed transactions. But that's where
the fun is!

## Contents

- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [The Project](#the-project)
    * [01 Signing](#01-signing)
    * [02 Encoding](#02-encoding)
    * [03 Transactions](#03-transactions)
    * [04 Addressing](#04-addressing)
    * [05 Requests](#05-requests)
        - [GET /api/state/{address}](#get-apistateaddress)
        - [GET /api/state?address={partial address}](#get-apistateaddresspartial-address)
        - [POST /api/batches](#post-apibatches)
    * [06 The User Interface](#06-the-user-interface)
- [Extra Credit](#extra-credit)

## Getting Started

This component uses npm to manage dependencies, so the first thing you should
do is install them:

```bash
cd code/part-two/client/
npm install
```

Once that's done, you will need to build your front-end code with _webpack_.
This will use [source/index.jsx](source/index.jsx) as an entry point, and pull
in all of your other modules from there to create a _bundle_ saved at
`public/bundle.js`. Anything in the [public/](public/) directory will be served
at `localhost:3000`, so when you run `docker-compose up` (see [Using
Docker](../README.md#using-docker)), you should be able to view it from your
browser. In order to run the build, there are a few commands you can use.

You can build the production code:

```bash
npm run build:prod
```

However, most of the time you will probably what to build your code in
dev-mode. It builds faster, includes more debugging information, and will even
automatically rebuild every time you save changes:

```bash
npm run build:dev
```

And you can go a step further and serve the dev code from a live-reload server
at `localhost:3001`. Good news, you won't have to refresh your page! Bad news,
you won't be able to make any API calls or interact with the blockchain at all:

```bash
npm run watch
```

## Running Tests

Like other components, the front-end uses Mocha/Chai for testing. Unlike other
components, there is a pretty sweet browser-based test runner. To pull it up,
simply run:

```bash
npm test
```

## The Project

Before you start in on this part of the project make sure you have reviewed the
[Sawtooth Curriculum](../README.md#the-curriculum), in particular the sections
on build and submitting transactions, as well as
[Signing](../../part-one/README.md#01-signing) from part one.

### 01 Signing

**Module:** [source/services/signing.js](source/services/signing.js)

If you completed part one, this section should be pretty much done. Both
Sawtooth and your DIY blockchain use Secp256k1 for signing, so you will be able
to copy over most of your code.

There is one slight difference to keep in mind. While you signed strings in
part one, you will be signing encoded transactions in part two (i.e. Buffers).
This _probably_ won't make much of a difference, but depending on how you
implemented `sign` the first time, it may require some changes.

### 02 Encoding

**Module:** [source/services/encoding.js](source/services/encoding.js)

Next you will want to build a module to encode/decode transactions and state
data. Remember from [the design](../README.md#encoding-data), that we are using
_sorted_ JSON strings encoded in a Node Buffer. Webpack will allow you to use
Buffers in the browser just fine, but you could also use
[UInt8Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
if you prefer.

### 03 Transactions

**Module:** [source/services/transactions.js](source/services/transactions.js)

**Useful APIs:**
- [Ptotobuf.js](https://github.com/dcodeIO/ProtoBuf.js/#using-the-js-api)

This is the first really Sawtooth specific module. You will need to take your
encoded payloads, and wrap them in a transaction. Then one or more transactions
get wrapped in a batch, and one or more batches get wrapped in a batch list,
which is finally serialized as bytes so it can be sent to the REST API. All of
these data structures are _Google Protobufs_, which are a somewhat complex, but
_very_ efficient way of serializing data. You don't need to become a protobuf
expert to use Sawtooth, but you should probably familarize yourself with the,
Protobuf.js API, which is what the Sawtooth SDK uses under the hood.

In particular, be ready to use:

- `TransactionHeader.encode(headerData).finish()`
- `Transaction.create(transactionData)`
- `BatchHeader.encode(batchHeaderData).finish()`
- `Batch.create(batchData)`
- `BatchList.encode(batchListData).finish()`

### 04 Addressing

**Module:** [source/services/addressing.js](source/services/addressing.js)

The last module you will complete stub functions for is one to generate
addresses for entities in state. You will need these in order to fetch any data
from the REST API.

### 05 Requests

**Module:** _None_
**Useful APIs:**
- [Axios](https://github.com/axios/axios)
- [Sawtooth REST API](https://sawtooth.hyperledger.org/docs/core/releases/1.0/rest_api/endpoint_specs.html)

The design and execution of the rest of the client is entirely up to you. There
are no more tests. One thing you will definitely need to do though is send
GET/POST requests to the blockchain. If you like, you could incorporate this
functionality throughout the rest of your app. However, it will likely make
sense for you to create another services module to encapsulate interactions
with the REST API.

Either way, one perk of the docker setup for serving this client, is that the
Sawtooth REST API has been proxied under the `api/` path, so you can access
every REST API route using a relative path. There are three routes/queries you
are likely to be concerned with.

#### GET /api/state/{address}

This fetches a base64 encoded entity from state. Sawtooth puts your data in a
JSON envelope under the `data` key, which axios automatically decodes for you,
and stores under the . . . `data` key. This means the data you want will be
in `response.data.data`.

#### GET /api/state?address={partial address}

The merkle tree that Sawtooth data is stored in allows you to fetch multiple
entities at once if they are under the same address _prefix_. So for example,
you could fetch `/api/state?address=5f4d76` to get every entity in state, or
`/api/state?address=5f4d7600` to get every collection. These entities will be
in a JSON array with this format:

```json
[
    {
        "address": "<string, full address>",
        "data": "<base64 string, encoded entity>"
    }
]
```

And yes, that means the base64 string you want to decode is at
`response.data.data[i].data`.

¯\\\_(ツ)\_/¯

#### POST /api/batches

This is the endpoint to which you will actually post your serialized batch
lists. Include them directly in the body of your request, and don't forget to
set the `Content-Type` header to `application/octet-stream`.

### 06 The User Interface

**Module:** [source/index.jsx](source/index.jsx)

**Requirements:**
- Allow users to generate new private keys and create collections
- Allow users to "sign in" by copying/pasting in their private key
- Allow users to View all cryptomoji in state
- Allow users to view just their own cryptomoji
- Allow users to select a sire from their collection
- Allow users to view all available sires
- Allow users to breed one of their cryptomoji with a sire

There are no tests for the UI. It is up to you to design and build an interface
you are happy with that satisfies all of these requirements. Have fun!

Note that a [parseDna](source/services/parse_dna.js#L190) method is provided,
which will convert a DNA string into a real _kaomoji_ for display. Make sure
you use it!

## Extra Credit

**Requirements:**
- Allow users to create/cancel offers from their cryptomoji
- Allow users to view all available offers
- Allow users to add/cancel responses to outstanding offers
- Allow users to accept responses, executing a trade
- Allow users to view detailed information on a cryptomoji, like their family
  tree and "tags" (generated by `parseDna`)
- Dynamically alter the way a cryptomoji is styled based on its tags
- Allow users to filter/sort lists of cryptomoji by tags and/or other factors
  (e.g. "number of times sired")

Also don't forget to remove the `.skip` from Line 96 of
[tests/04-Addressing.js](tests/04-Addressing.js#L96)!
