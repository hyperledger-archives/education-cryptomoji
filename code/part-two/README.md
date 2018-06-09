# Part-Two: Cryptomoji

Your task for part-two is to build a working distributed application on
[Hyperledger Sawtooth](https://www.hyperledger.org/projects/sawtooth), a
general-purpose enterprise blockchain. This app, will allow users to collect,
breed, and trade collectible _kaomoji_: strings of characters that look like
faces, such as (ಠ_ಠ), ( ͡° ͜ʖ ͡°), and ᕕ( ᐛ )ᕗ.

Powering your _cryptomoji_ will be a number of components which run in
individual "containers" using
[Docker](https://www.docker.com/community-edition).
After cloning this repo and installing [Node](https://nodejs.org/), follow the
instructions specific to your OS to setup whatever tools you need to run
`docker` and `docker-compose` from your command line.

## Contents

- [Using Docker](#using-docker)
    * [Components](#components)
    * [Start/Stop Commands](#startstop-commands)
    * [Entering a Container](#entering-a-container)
- [The Curriculum](#the-curriculum)
    * [Cryptomoji Lecture](#cryptomoji-lecture)
    * [Sawtooth Documentation](#sawtooth-documentation)
- [The Project](#the-project)
    * [Client](#client)
    * [Transaction Processor](#transaction-processor)
- [The Design](#the-design)
    * [Encoding Data](#encoding-data)
    * [State Entities](#state-entities)
        - [Cryptomoji](#cryptomoji)
        - [Collection](#collection)
        - [Sire Listing](#sire-listing)
    * [Addressing](#addressing)
        - [Namespace](#namespace)
        - [Resource Prefix](#resource-prefix)
        - [Collection](#collection-1)
        - [Collection Prefix](#collection-prefix)
        - [Cryptomoji](#cryptomoji-1)
        - [Sire Listing](#sire-listing-1)
    * [Payloads](#payloads)
        - [Create Collection](#create-collection)
        - [Select Sire](#select-sire)
        - [Breed Moji](#breed-moji)
- [Extra Credit](#extra-credit)
    * [State Entities](#state-entities)
        - [Offer](#offer)
    * [Addressing](#addressing-1)
        - [Offer](#offer-1)
    * [Payloads](#payloads-1)
        - [Create Offer](#create-offer)
        - [Add Response](#add-response)
        - [Accept Response](#accept-response)
        - [Cancel Offer](#cancel-offer)
        - [Cancel Response](#cancel-response)
- [Nightmare Mode](#nightmare-mode)

## Using Docker

Docker is a virtualization tool that makes it easy to deploy code in a variety
of environments. Dockerfiles create "images" with all the dependencies your
code needs installed. From these images, you can create, run, and destroy
individual "containers" at will. This is in effect like having every component
running on it's own virtual computer which you can reset to factory settings at
any time. It's a profoundly useful tool, which takes a little getting used to,
but is worth getting familiar with.

### Components

Included in this directory is a [docker-compose](docker-compose.yaml) file. It
includes the instructions Docker needs to start up multiple components and
network them together. This includes both custom components built from your
source code and some prepackaged Sawtooth components downloaded from
[DockerHub](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=sawtooth&starCount=0):

| Name          | Endpoint              | Source    | Description
| ------------- | --------------------- | --------- | ------------------------
| validator     | tcp://localhost:4004  | DockerHub | Validates blocks and transactions
| rest-api      | http://localhost:8008 | DockerHub | Provides blockchain via HTTP/JSON
| processor     | --                    | custom    | The core smart contract logic for your app
| client        | http://localhost:3000 | custom    | Your front-end, served from `client/public/`
| shell         | --                    | DockerHub | Environment for running Sawtooth commands
| settings-tp   | --                    | DockerHub | Built-in Sawtooth transaction processor

### Start/Stop Commands

First you will use the `docker-compose up` command to start all components.
Note that this might take as long as 30 minutes the first time you run it
(later runs will be much faster, more like 30 seconds). If you are in the same
directory as the `docker-compose.yaml` file, the `up` command will find it by
default and you won't need to provide any other parameters:

```bash
cd code/part-two/
docker-compose up
```

This builds and starts up _everything_ defined in your compose file. Once
running, you can then stop it all with the keyboard shortcut: `ctrl-C`. If you
want to stop _and_ destroy every container (they will be rebuilt on your next
`up`) use the command:

```bash
docker-compose down -v
```

That is really all you need. These commands are the start/stop buttons for your
app. You can develop just fine by starting things up, making some changes,
tearing everything down, and then starting it all up again. However, if you
want fine-grained control, you can leave everything else running but stop,
start, or restart individual components using their container name listed in
the table above. For example, with our transaction processor we could open a
new terminal window and run one of these commands:

```bash
docker stop processor
docker start processor
docker restart processor
```

### Entering a Container

There is nothing in the curriculum that would require you to do this, but if
you are curious, it is possible to _enter_ a running container if you want to
run commands from within. This is particularly useful with the "shell"
container when you want to run
[Sawtooth CLI](https://sawtooth.hyperledger.org/docs/core/releases/1.0/cli/sawtooth.html)
commands. You would do this with `exec`, which allows you run any command from
within a container, specifying `bash` as the command you want to run:

```bash
docker exec -it shell bash
```

An important note! When you are within a container, you cannot use "localhost"
for networking. Remember how each container is like its own little computer?
Well it comes complete with it's own localhost. For networking to _other_
containers, Docker provides the service names from the compose file as URLs. So
for example, if you were inside the shell container and wanted to fetch the
blocks from the REST API, you would run:

```bash
curl http://rest-api:8008/blocks
```

Finally, if you need to exit a container, simply use:

```bash
exit
```

## The Curriculum

### Cryptomoji Lecture

There will be a video lecture included with this repo, but it has not been
uploaded yet. Watch this space.

### Sawtooth Documentation

Sawtooth has in-depth documentation covering many aspects of the platform. It
can be a little overwhelming at first! For the new distributed app developer
working with Javascript, start with these documents:

- [Sawtooth Introduction](https://sawtooth.hyperledger.org/docs/core/releases/1.0/introduction.html)
- Architecture
    * [Global State](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/global_state.html)
    * [Transactions and Batches](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/transactions_and_batches.html)
    * [The REST API](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/rest_api.html)
- The Javascript SDK
    * [Building and Submitting Transactions](https://sawtooth.hyperledger.org/docs/core/releases/1.0/_autogen/sdk_submit_tutorial_js.html)
    * [Transaction Processor Tutorial](https://sawtooth.hyperledger.org/docs/core/releases/1.0/_autogen/sdk_TP_tutorial_js.html)

## The Project

When building an application on Sawtooth, much of the nitty gritty of running
and validating a blockchain is handled for you. You won't have to verify
signatures or hashes, or validate blocks, or confirm consensus. Instead, you
must consider how you can break up the functionality of your application into
discrete transaction payloads, and how these payloads will alter state data.
The typical Sawtooth workflow looks something like this:

1. The user initializes some action (i.e. _"set 'a' to 1"_)
2. The _client_ takes that action and:
    - encodes it in a payload (maybe simply `{"a": 1}`)
    - wraps that payload in a signed transaction and batch
    - submits it to the validator
3. The validator confirms the transaction and batch are valid
4. The _transaction processor_ receives the payload and:
    - decodes it
    - verifies it is a valid action (i.e. 'a' _can_ be set to 1)
    - modifies state in a way that satisfies the action
      (perhaps address _...000000a_ becomes `1`)
5. Later, the client might read that state, and decode it for display

So all you are responsible for building two components (the client and the
transaction processor), and for keeping those components in agreement on how to
encode payloads and state. This application-wide logic is typically referred to
in Sawtooth with the general term: "transaction family".

For Cryptomoji, the client and processor are each in their own directory, with
their own tests, and their own READMEs. There is no particular order they need
to be built in, but we recommended you develop them in parallel based on
functionality. For example, implement "collection creation" on _both_ the
client and the processor before moving on to "sire selection" on _either_.

For the broad transaction family design, continue reading [below](#the-design).

### Client

**Directory:** [code/part-two/client/](client/)

**README:** [code/part-two/client/README.md](client/README.md)

**Tests:** [code/part-two/client/tests/](client/tests/)

A React/Webpack UI which allows users to create collections of cryptomoji,
breed them, and (in the extra credit) trade with other users.

### Transaction Processor

**Directory:** [code/part-two/processor/](processor/)

**README:** [code/part-two/processor/README.md](processor/README.md)

**Tests:** [code/part-two/processor/tests/](processor/tests/)

A Node.js process which validates payloads sent from the client, writing data
permanently to the blockchain.

## The Design

There are a few basic questions you need to answer when designing your
transaction family:
- What do my transaction payloads look like?
- What does data stored in state look like?
- What addresses in state is that data stored under?

Let's answer these questions for _Cryptomoji_.

### Encoding Data

For simplicity and familiarity we are going to encode both payloads and state
data as JSON. To be clear, JSON would _not_ be a great choice in production. It
is not space efficient, and worse, it is not _deterministic_. Determinism is
very important when writing state to the blockchain. Many many nodes will be
attempting to the write the same state. If that state is even slightly
different (like say, the keys are in a different order), the validators will
think the transactions are invalid.

But JSON is easy and accessible, especially in Javascript. And it is possible
to [create sorted JSON strings](https://stackoverflow.com/a/16168003/4284401),
which should solve the determinism issue (at least well enough for our
purposes). Of course, JSON itself isn't quite enough, because we need _raw
bytes_ not a string. For byte encoding we are going to use Node's
[Buffers](https://nodejs.org/api/buffer.html) again.

So any sort of encode we do should look something like this:

```javascript
Buffer.from(JSON.stringify(dataObj, getSortedKeys(dataObj)))
```

And decoding would look like this:

```javascript
JSON.parse(dataBytes.toString())
```

### State Entities

There are a number entities your transaction processor will be writing to state
in order to make the Cryptomoji app work.

#### Cryptomoji

```json
{
    "dna": "<hex string>",
    "owner": "<string, public key>",
    "breeder": "<string, moji address>",
    "sire": "<string, moji address>",
    "bred": [ "<strings, moji addresses>" ],
    "sired": [ "<strings, moji addresses>" ]
}
```

Unique breedable critters. They have a DNA string of 36 hex characters, which a
parsing tool included with the client will convert into an adorable _kaomoji_
for display. Aside from storing the identity of their owner, they will also
include any breeding information they might have. First the identities of their
parents (breeder/sire), as well as the identities of any children they
produced, either in the role of a breeder or a sire (bred/sired).

#### Collection

```json
{
    "key": "<string, public key>",
    "moji": [ "<strings, moji addresses>" ]
}
```

A collection of cryptomoji owned by a public key. Each new collection will be
created with three new "generation 0" cryptomoji with no breeders or sires.

#### Sire Listing

```json
{
    "owner": "<string, public key>",
    "sire": "<string, moji address>"
}
```

Each collection may select one cryptomoji as their sire. This makes it publicly
available for other collection to use for breeding.

### Addressing

All state addresses in Sawtooth are 35 bytes long, typically expressed as 70
hexadecimal characters. By convention, the first six characters are reserved
for a namespace for the transaction family, allowing many families to coexist
on the same blockchain. The remaining 64 characters are up to each family to
define.

We will follow this convention with a six character namespace, and some
sensible rules about how the remaining 64 characters of our state addresses
should be divvied up.

#### Namespace

For the six character namespace, we'll use the first six characters of a
SHA-512 hash of the application name, _“cryptomoji”_:

```
5f4d76
```

#### Resource Prefix

The next a one byte (two characters) will be a short prefix designating what
type of resource is stored at the address:

- **Collection:** `00`
- **Cryptomoji:** `01`
- **Sire Listing:** `02`

#### Collection

The final 62 characters of a collection’s address will be the first 62
characters of a SHA-512 hash of its public key.

So for a collection with a public key of
`034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa`, we get
a SHA-512 hash, slice off the first 62 characters, combine with our namespace
prefix above, and end up with:

```
5f4d76 00 1b96dbb5322e410816dd41d93571801e751a4f0cc455d8bd58f5f8ad3d67cb
```

_Note that we have added spaces for readability. Actual addresses have no
spaces._

#### Collection Prefix

For both cryptomoji and offers (see [extra credit](#extra-credit)), the next
eight characters are a prefix for the collection they belong to. These are
generated from the first eight characters of a SHA-512 hash of the collection’s
public key.

So, for the same public key above:

```
1b96dbb5
```

#### Cryptomoji

The final 54 characters of a cryptomoji’s address is the first 54 characters of
a SHA-512 hash of their DNA string. So the address of a cryptomoji with the
dna `c44b22d96246b0980954f7818567f453039a` would be:

```
5f4d76 01 1b96dbb5 0c8514ab2a7cf361062601716bcd762097e41f9011a5e6f8ff6c5f
```

#### Sire Listing

Like collections, the last 62 characters of a sire listing’s address are the
first 62 characters of a SHA-512 hash of a public key, the sire's owner in this
case. So our example address would be identical to our example collection, but
with a different resource prefix:

```
5f4d76 02 1b96dbb5322e410816dd41d93571801e751a4f0cc455d8bd58f5f8ad3d67cb
```

### Payloads

Cryptomoji payloads will be objects, each with an `"action"` key that
designates what event should occur in the transaction processor. Each action is
designated by a specific string written in CONSTANT_CASE. Any additional data
required will be included in other keys particular to that payload.

#### Create Collection

```json
{
    "action": "CREATE_COLLECTION"
}
```

_Validation:_
- Signer must not already have a collection

Creates a new collection for the signer of the transaction with three new
pseudo-random (but deterministic!) cryptomoji. Like other actions, the identity
of the signer will come from their public key in the transaction header, and so
is not included in the payload itself.

#### Select Sire

```json
{
    "action": "SELECT_SIRE",
    "sire": "<string, moji address>"
}
```

_Validation:_
- Signer must have a collection
- The cryptomoji must exist
- Signer must own the sire

Lists a cryptomoji as a collection's sire, indicating it is available for other
collections to breed with. Collections may only have one sire at a time.

#### Breed Moji

```json
{
    "action": "BREED_MOJI",
    "sire": "<string, moji address>",
    "breeder": "<string, moji address>"
}
```

_Validation:_
- Signer must have a collection
- The cryptomoji must exist
- Signer must own the breeder
- Sire must be listed as a sire

Creates a new cryptomoji for the owner of the _breeder_, which is a
pseudo-random combination of the DNA from the breeder and the sire.

## Extra Credit

For extra credit, add the capability for collections to trade cryptomoji
between each other. This is harder than it sounds. One user will need to create
an offer, while others add responses until the offer owner accepts them. This
is a process that spans multiple transactions, never mind the possibility that
one party might change their minds and decide to cancel their offer or
response.

### State Entities

#### Offer

```json
{
    "owner": "<string, public key>",
    "moji": [ "<strings, moji addresses>" ],
    "responses": [
        {
            "approver": "<string, public key>",
            "moji": [ "<strings, moji addresses>" ]
        }
    ]
}
```

Offers are a way of effectively creating a multi-signer transaction. One user
creates the offer, and then other users add responses to it. When the offer
owner sees a response they like, they can accept it, exchanging the cryptomoji.

It is also possible for offer owners to request moji by adding responses to
their own offer. These responses would then be approved by the mojis' owner.
Which collection is required to approve a response is listed under the
"approver" key.

### Addressing

#### Offer

An offer's address begins the same way as any other, with the cryptomoji
namespace and a type prefix (`03` in this case). Afterwards, it uses the same
eight character owner prefix that cryptomoji do. The final 54 characters are
also the first 54 characters of a SHA-512 hash. In this case, the hash is
generated from a string created by sorting the addresses of the cryptomoji
being offered, and then concatenating them with no spaces.

```
5f4d76 03 1b96dbb5 f365bcdd7f317faeebc49daf2cc7a3f5bf169a19010197c51f32a0
```

### Payloads

#### Create Offer

```json
{
    "action": "CREATE_OFFER",
    "moji": [ "<strings, moji addresses>" ]
}
```

_Validation:_
- Signer must have a collection
- The cryptomoji must exist
- Signer must own the cryptomoji
- Cryptomoji must not be listed as a sire

Creates an offer to trade away some of a collection's moji, which other
collections can add responses to.

#### Add Response

```json
{
    "action": "ADD_RESPONSE",
    "offer": "<string, offer address>",
    "moji": [ "<strings, moji addresses>" ]
}

```

_Validation:_
- Signer must have a collection
- The cryptomoji must exist
- The offer must exist
- Signer must own the moji _or_ be the owner of the offer
- An identical response must not already exist

Adds a response to an offer. This is the other side of the trade. The owner of
the offer may add responses to their own offer, suggesting moji owned by
someone else. Otherwise, the response must come from the owner of the moji.

#### Accept Response

```json
{
    "action": "ACCEPT_RESPONSE",
    "offer": "<string, offer address>",
    "response": "<number, index of response>"
}
```

_Validation:_
- Signer must have a collection
- Signer must be the "approver" on the response
- The cryptomoji exchanged must all still be owned by the appropriate parties
- The response index must correspond to a valid response on the offer

Accepts the response, exchanging its cryptomoji for the cryptomoji originally
listed in the offer, and deleting the offer from state.

#### Cancel Offer

```json
{
  "action": "CANCEL_OFFER",
  "offer": "<string, offer address>"
}
```

_Validation:_
- Signer must have a collection
- Offer must exist
- Signer must own the offer

Deletes the offer from state with no changes in moji ownership.

#### Cancel Response

```json
{
    "action": "CANCEL_RESPONSE",
    "offer": "<string, offer address>",
    "response": "<number, index of response>"
}
```

_Validation:_
- Signer must have a collection
- Offer must exist
- Signer must be the creator of the response

Deletes the response from the offer's list of responses, leaving `null` in its
place.

## Nightmare Mode

In the original Cryptokitties app on Ethereum, a good deal was done using
timestamps. After breeding, sires would have a short period of down-time,
during which they could not be used to sire again. Meanwhile, breeders had an
exponentially increasing pregnancy time, only after which was a child created.
Adding this gameplay feature to Cryptomoji will require understanding and
utilizing Sawtooth's
[Block Info TP](https://sawtooth.hyperledger.org/docs/core/releases/1.0/transaction_family_specifications/blockinfo_transaction_family.html).

Good luck.
