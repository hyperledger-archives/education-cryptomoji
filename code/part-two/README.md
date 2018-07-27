# Part Two: Cryptomoji

Your task for part two is to build a working distributed application on
[Hyperledger Sawtooth](https://www.hyperledger.org/projects/sawtooth), a
general-purpose enterprise blockchain. This app will allow users to collect,
breed, and trade collectible _kaomoji_: strings of characters that look like
faces, such as (ಠ_ಠ), ( ͡° ͜ʖ ͡°), and ᕕ( ᐛ )ᕗ.

Powering your _cryptomoji_ will be a number of components which run in
individual "containers" using
[Docker](https://www.docker.com/community-edition).
After cloning this repo and installing [Node](https://nodejs.org/), follow the
instructions for your OS to set up the tools that you need to run
`docker` and `docker-compose` from your command line.

## Contents

- [Using Docker](#using-docker)
    * [Components](#components)
    * [Start/Stop Commands](#startstop-commands)
    * [Entering a Container](#entering-a-container)
- [The Curriculum](#the-curriculum)
    * [Sawtooth Documentation](#sawtooth-documentation)
    * [App Development Lecture](#app-development-lecture)
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
individual "containers" at will. This is, in effect, like having every component
running on its own virtual computer which you can reset to factory settings at
any time. It's a profoundly useful tool that takes a little getting used to,
but is worth getting familiar with.

### Components

This `part-two` directory includes a [docker-compose](docker-compose.yaml) file
that contains the instructions for Docker to start up multiple components
and network them together. This includes both custom components built from your
source code and some prepackaged Sawtooth components downloaded from
[DockerHub](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=sawtooth&starCount=0):

| Name          | Endpoint              | Source    | Description
| ------------- | --------------------- | --------- | ------------------------
| validator     | tcp://localhost:4004  | DockerHub | Validates blocks and transactions
| rest-api      | http://localhost:8008 | DockerHub | Provides blockchain via HTTP/JSON
| processor     | --                    | custom    | The core smart contract logic for your app
| client        | http://localhost:3000 | custom    | Your front end, served from `client/public/`
| shell         | --                    | DockerHub | Environment for running Sawtooth commands
| settings-tp   | --                    | DockerHub | Built-in Sawtooth transaction processor

### Start/Stop Commands

First, you will use the `docker-compose up` command to start all components.
Note that this might take as long as 30 minutes the first time you run it
(later runs will be much faster; more like 30 seconds). If you are in the same
directory as the `docker-compose.yaml` file, the `up` command will find the file
by default, so you won't need to provide any other parameters:

```bash
cd code/part-two/
docker-compose up
```

This builds and starts _everything_ defined in your compose file. Once
all the components are running, you can then stop it all with the keyboard
shortcut `ctrl-C`. If you want to stop _and_ destroy every container (they will
be rebuilt on your next `up`), use this command:

```bash
docker-compose down -v
```

That is really all you need. These commands are the start/stop buttons for your
app. You can develop just fine by starting things up, making some changes,
tearing everything down, and then starting it all up again. However, if you
want fine-grained control, you can leave everything else running but stop,
start, or restart individual components using their container name listed in
the table above. For example, with your transaction processor, you could open a
new terminal window and run one of these commands:

```bash
docker stop processor
docker start processor
docker restart processor
```

### Entering a Container

There is nothing in the curriculum that would require you to do this, but if
you are curious, it is possible to _enter_ a running container if you want to
run commands from that container. This is particularly useful with the "shell"
container when you want to run
[Sawtooth CLI](https://sawtooth.hyperledger.org/docs/core/releases/1.0/cli/sawtooth.html)
commands. You would do this with `exec`, which allows you run any command from
within a container, specifying `bash` as the command you want to run:

```bash
docker exec -it shell bash
```

An important note! When you are within a container, you cannot use "localhost"
for networking. Remember how each container is like its own little computer?
Well, it comes complete with its own localhost. For networking to _other_
containers, Docker provides the service names from the compose file as URLs.
For example, if you were inside the shell container and wanted to fetch the
blocks from the REST API, you would run:

```bash
curl http://rest-api:8008/blocks
```

Finally, if you need to exit a container, simply use:

```bash
exit
```

## The Curriculum

### Sawtooth Documentation

Sawtooth has in-depth documentation covering many aspects of the platform. It
can be a little overwhelming at first! For the new distributed app developer
working with Javascript, start with these documents:

- [Sawtooth Introduction](https://sawtooth.hyperledger.org/docs/core/releases/1.0/introduction.html)
- Architecture
    * [Global State](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/global_state.html)
    * [Transactions and Batches](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/transactions_and_batches.html)
    * [REST API](https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/rest_api.html)
- The Javascript SDK
    * [Building and Submitting Transactions](https://sawtooth.hyperledger.org/docs/core/releases/1.0/_autogen/sdk_submit_tutorial_js.html)
    * [Transaction Processor Tutorial](https://sawtooth.hyperledger.org/docs/core/releases/1.0/_autogen/sdk_TP_tutorial_js.html)

### App Development Lecture

In addition to reviewing the official Sawtooth documentation, watch the
Cryptomoji video lecture, which covers all the basics of Sawtooth application
development in detail. It is broken into five parts, the first of which is a
overview of blockchains generally, which you may have already watched in part
one. Each part is available as an MP4 file:

- [01a Blockchain Overview Lecture (MP4)](../../teaching/videos/01a_blockchain_lecture.mp4)
- [01b Blockchain Overview Questions (MP4)](../../teaching/videos/01b_blockchain_qa.mp4)
- [02 Sawtooth Overview (MP4)](../../teaching/videos/02_sawtooth_overview.mp4)
- [03 Writing Transaction Processors (MP4)](../../teaching/videos/03_transaction_processors.mp4)
- [04 Writing Clients (MP4)](../../teaching/videos/04_writing_clients.mp4)
- [05 Sprint Design (MP4)](../../teaching/videos/05_sprint_design.mp4)

The slides are also available in a variety of formats:

- [Sawtooth App Development (Google Doc)](https://docs.google.com/presentation/d/1vRGIli6bgXP0FwdfZG7KrEIGS6apANnSCBk3Sg-5btc/edit?usp=sharing)
- [Sawtooth App Development (PPTX)](../../teaching/slides/sawtooth_app_development.pptx)
- [Sawtooth App Development (ODP)](../../teaching/slides/sawtooth_app_development.odp)
- [Sawtooth App Development (PDF)](../../teaching/slides/sawtooth_app_development.pdf)

## The Project

When building an application on Sawtooth, much of the nitty-gritty of running
and validating a blockchain is handled for you. You won't have to verify
signatures and hashes, validate blocks, or confirm consensus. Instead, you
must consider how you can break up the functionality of your application into
discrete transaction payloads, and how these payloads will alter state data.
The typical Sawtooth workflow looks something like this:

1. The user initializes some value (i.e., _"set 'a' to 1"_)
2. The _client_ takes that action and:
    - encodes it in a payload (maybe simply `{"a": 1}`)
    - wraps that payload in a signed transaction and batch
    - submits it to the validator
3. The validator confirms the transaction and batch are valid
4. The _transaction processor_ receives the payload and:
    - decodes it
    - verifies it is a valid action (i.e., 'a' _can_ be set to 1)
    - modifies state in a way that satisfies the action
      (perhaps address _...000000a_ becomes `1`)
5. Later, the client might read that state, and decode it for display

So, you are responsible only for building two components (the client and the
transaction processor) and for keeping those components in agreement on how to
encode payloads and state. This application-wide logic is typically referred to
in Sawtooth with the term "transaction family".

For Cryptomoji, the client and processor are each in their own directory, with
their own tests and their own READMEs. You should develop the components in
parallel on a feature-by-feature basis. For example, implement collection
creation on _both_ the client and the processor before moving on to sire
selection on _either_.

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

For simplicity and familiarity, we are going to encode both payloads and state
data as JSON. To be clear, JSON would _not_ be a great choice in production. It
is not space efficient; worse, it is not _deterministic_. Determinism
is very important when writing state to the blockchain. Many many nodes will
attempt to the write the same state. If that state is even slightly
different (like, say, the keys are in a different order), the validators will
think the transactions are invalid.

But JSON is easy and accessible, especially in Javascript. And it is possible
to [create sorted JSON strings](https://stackoverflow.com/a/16168003/4284401),
which should solve the determinism issue (at least, well enough for your
purposes). Of course, JSON itself isn't quite enough, because we need _raw
bytes_, not a string. For byte encoding, we are going to use Node's
[Buffers](https://nodejs.org/api/buffer.html) again.

So your encoding should look something like this:

```javascript
Buffer.from(JSON.stringify(dataObj, getSortedKeys(dataObj)))
```

And decoding would look like this:

```javascript
JSON.parse(dataBytes.toString())
```

### State Entities

In order to make the Cryptomoji app work, your transaction processor must write
several entities to state.

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

Cryptomoji are unique, breedable critters. Each has a DNA string of 36 hex
characters, which is converted into an adorable _kaomoji_ for display (using a
parsing tool that is included with the client). Aside from storing the identity
of the owner, the string will also include breeding information: the identities
of the parents (breeder and sire), as well as the identities of any children
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

Each collection can select one cryptomoji as a sire. This makes the sire
publicly available for other collections to use for breeding.

### Addressing

A state address in Sawtooth is 35 bytes long, typically expressed as 70
hexadecimal characters. By convention, the first six characters are reserved
for a namespace for the transaction family, allowing many families to coexist
on the same blockchain. The remaining 64 characters are up to each family to
define.

We will follow this convention with a six-character namespace `5f4d76`, which is
generated from the first six characters of a SHA-512 hash of the family name
_“cryptomoji”_. Each state entity will have their own scheme for how they use
the remaining 64 characters of their address.

#### Collection

| Namespace (6) | Type prefix (2) | Identifier hash (62)
| ------------- | --------------- | --------------------
| `5f4d76`      | `00`            | `1b96dbb5322e410816dd41d93571801e751a4f0cc455d8bd58f5f8ad3d67cb`

A collection will be stored first under a one-byte type prefix: `00`. The
remaining 62 characters are the first 62 characters of a SHA-512 hash of its
public key.

For example, the hash used to create the address above might be generated like
this:

```javascript
createHash('sha512').update('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa').digest('hex');
// 1b96dbb5322e410816dd41d93571801e751a4f0cc455d8bd58f5f8ad3d67cbee2e9e5c5df5bb65c282f1aaf516cf7cc5a2f7ff592a80cf920e1abaab8d29279f
```

#### Cryptomoji

| Namespace (6) | Type prefix (2) | Collection prefix (8) | Identifier hash (54)
| ------------- | --------------- | --------------------- | --------------------
| `5f4d76`      | `01`            | `1b96dbb5`            | `0c8514ab2a7cf361062601716bcd762097e41f9011a5e6f8ff6c5f`

Cryptomoji need to be divided up by who owns them. That way, you can query a
partial address to get all of the cryptomoji owned by a public key. So, after a
type prefix of `01`, the next eight characters of a cryptomoji's address are
the collection prefix (the first eight characters from a SHA-512 hash of the
owner's public key). The final 54 characters of a cryptomoji’s address are the
first 54 characters from a SHA-512 hash of its DNA string.

#### Sire Listing

| Namespace (6) | Type prefix (2) | Identifier hash (62)
| ------------- | --------------- | --------------------
| `5f4d76`      | `02`            | `1b96dbb5322e410816dd41d93571801e751a4f0cc455d8bd58f5f8ad3d67cb`

Because a collection is only allowed one sire, the sire listings can be stored
under an address that is almost identical to the collection address. The
identifier hash is the same first 62 characters of a SHA-512 hash of the owner's
public key. The only difference between the address of a collection and its sire
listing will be the type prefix
`02`.

### Payloads

Cryptomoji payloads will be objects, each with an `"action"` key that
designates what event should occur in the transaction processor. Each action is
designated by a specific string written in CONSTANT_CASE. Any additional data
will be included in other keys specific to that payload.

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
of the signer will come from the public key in the transaction header, so it
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
- Cryptomoji must exist
- Signer must own the sire

Lists a cryptomoji as a collection's sire, indicating that it is available for
other collections to breed with. A collection can have only one sire at a time.

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
- Cryptomoji must exist
- Signer must own the breeder
- Sire must be listed as a sire

Creates a new cryptomoji for the owner of the _breeder_. The new cryptomoji is a
pseudo-random combination of the DNA from the breeder and the sire.

## Extra Credit

For extra credit, add the capability for collections to trade cryptomoji
between each other. This is harder than it sounds. One user will need to create
an offer, while others add responses until the offer owner accepts them. This
is a process that spans multiple transactions, never mind the possibility that
one party might change their mind and decide to cancel an offer or response.

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
creates the offer, then other users add responses to it. When the offer
owner sees a response they like, they can accept it and exchange the cryptomoji.

It is also possible for offer owners to request moji by adding responses to
their own offer. These responses would then be approved by the mojis' owner.
The "approver" key identifies the collection whose owner is required to approve
a response.

### Addressing

#### Offer

| Namespace (6) | Type prefix (2) | Collection prefix (8) | Identifier hash (54)
| ------------- | --------------- | --------------------- | --------------------
| `5f4d76`      | `03`            | `1b96dbb5`            | `f0b9646d76c0e89bb8024d7ff2f7b4cde935f91c703f1a1a888e4a`

Like cryptomoji, offers are owned by a collection. In addition to their type
prefix (`03`), an offer has an eight-character prefix, which is the first eight
characters of a SHA-512 hash of the owner's public key. The final 54 characters
are the first 54 characters of a SHA-512 hash. In this case, the hash is
generated from a string created by sorting the addresses of the cryptomoji being
offered, then concatenating those addresses with no spaces.

For example, we might generate the hash for the address above like this:

```javascript
const moji1 = '5f4d76011b96dbb50c8514ab2a7cf361062601716bcd762097e41f9011a5e6f8ff6c5f';
const moji2 = '5f4d7601bddce3731459230a5a425d9e71ad0110f0e5a76ed88b8cfc1c087b10682492';

createHash('sha512').update(moji1 + moji2).digest('hex');
// f0b9646d76c0e89bb8024d7ff2f7b4cde935f91c703f1a1a888e4a8f6c62ad9a97664eb27bb981021c30d02e3417e03948d7fae7a13ba080e9bf2b421818a80b
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
- Cryptomoji must exist
- Signer must own the cryptomoji
- Cryptomoji must not be listed as a sire

Creates an offer to trade some of a collection's moji. Owners of other
collections can add responses to the offer.

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
- Cryptomoji must exist
- Offer must exist
- Signer must own the moji _or_ be the owner of the offer
- No identical response already exists

Adds a response to an offer. This is the other side of the trade. The owner of
the offer can add responses to their own offer, suggesting a trade for moji
owned by someone else. Otherwise, the response must come from the owner of the
moji.

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
- Exchanged cryptomoji must be owned by the appropriate parties
- Response index must correspond to a valid response on the offer

Accepts the response, exchanges the responder's cryptomoji for the cryptomoji
originally listed in the offer, then deletes the offer from state.

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

In the original Cryptokitties app on Ethereum, much was done using
timestamps. After breeding, sires had a short period of downtime,
during which they could not be used to sire again. Meanwhile, breeders had an
exponentially increasing pregnancy time to create a child.
Adding this gameplay feature to Cryptomoji will require that you understand and
use Sawtooth's
[Block Info TP](https://sawtooth.hyperledger.org/docs/core/releases/1.0/transaction_family_specifications/blockinfo_transaction_family.html).

Good luck.
