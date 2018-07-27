# Part One: DIY Blockchain

What better way to learn about blockchains than to build your own? In this
section you will construct your own simple blockchain in the vein of Bitcoin
and other cryptocurrencies. Using cryptographic private/public key pairs, users
will be able to create transactions sending funds from their public key to that
of another user. Like any other blockchain, these transactions will become a
permanent immutable part of the ledger, protected by the hashes that link each
block to the one that came before it in the chain.

## Contents

- [Getting Started and Running Tests](#getting-started-and-running-tests)
- [The Curriculum](#the-curriculum)
    * [Blockchain Lecture](#blockchain-lecture)
    * [Zulfikar Ramzan: Bitcoin](#zulfikar-ramzan-bitcoin)
- [The Project](#the-project)
    * [01 Signing](#01-signing)
    * [02 Blockchain](#02-blockchain)
    * [03 Validation](#03-validation)
- [Extra Credit](#extra-credit)
    * [04 Mining](#04-mining)

## Getting Started and Running Tests

This section uses Node and npm to install dependencies and run tests. To begin,
first install [Node 8](https://nodejs.org/) or higher. Then run these commands
from your terminal:

```bash
cd code/part-one/
npm install
npm test
```

You should see a number of tests run, most of which are failing.

(╯︵╰,)

Your job, in short, is to make these tests pass. As you work your way through
the sections below, keep running `npm test` to check your progress and get
clues to what you should do next.


## The Curriculum

### Blockchain Lecture

The first part of the Cryptomoji lecture is a brief overview of the blockchain
data structure and the technologies that power it: hashing, signatures, and
consensus. The lecture itself is 15 minutes long with an additional 10 minutes
of Q&A. They are included in this repo as two MP4 files:

- [Blockchain Overview Lecture (MP4)](../../teaching/videos/01a_blockchain_lecture.mp4)
- [Blockchain Overview Questions (MP4)](../../teaching/videos/01b_blockchain_qa.mp4)

In addition to the video, the slides are available in a variety of formats. The
general blockchain section is the first 8 slides:

- [Sawtooth App Development (Google Doc)](https://docs.google.com/presentation/d/1vRGIli6bgXP0FwdfZG7KrEIGS6apANnSCBk3Sg-5btc/edit?usp=sharing)
- [Sawtooth App Development (PPTX)](../../teaching/slides/sawtooth_app_development.pptx)
- [Sawtooth App Development (ODP)](../../teaching/slides/sawtooth_app_development.odp)
- [Sawtooth App Development (PDF)](../../teaching/slides/sawtooth_app_development.pdf)

### Zulfikar Ramzan: Bitcoin

For a deeper dive, follow up the lecture with Zulfikar Ramzan's excellent Khan
Academy course about the inner workings of the Bitcoin protocol. While your
blockchain will have some differences from Bitcoin (in particular the way
"inputs" and "outputs" are handled), there will be a lot of overlap:
- [Bitcoin: What is it?](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-what-is-it)
- [Bitcoin: Overview](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-overview)
- [Bitcoin: Cryptographic hash functions](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-cryptographic-hash-function)
- [Bitcoin: Digital signatures](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-digital-signatures)
- [Bitcoin: Transaction records](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-records)
- [Bitcoin: Proof of work](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-proof-of-work)
- [Bitcoin: Transaction blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-block-chains)
- [Bitcoin: The money supply](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-the-money-supply)
- [Bitcoin: The security of blockchains](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-security-of-transaction-block-chains)

You don't necessarily need to take the whole course, but makes sure you watch
(and absorb!) the videos on _hashing_, _signatures_, and _transaction
blockchains_. If you are going to tackle the extra credit, you will also want
to watch the videos on _proof of work_ and the _money supply_.


## The Project

The intro blockchain project is broken into four modules, one of which is extra
credit.

### 01 Signing

**Module:** [signing.js](signing.js)

**Useful APIs:**
  - [secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node#usage)
  - [Buffer.from](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)
  - [Buffer.toString](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end)

Signatures form the basis for verifiable identity and correctness on most, if
not all, blockchains. First, a _private key_ is generated; it's basically just
a random set of bytes. This key is kept secret. Next, a cryptographic algorithm
uses these bytes to derive a _public key_ which can be widely shared. Finally,
a _signature_ is generated by combining the private key with some message. This
signature, the message, and the public key are then all distributed together.

```
private key             message    private key
    |                         \     /
    v                          v   v
public key                   signature
```

While others won't ever be able to deduce the original private key, they will be
able to confirm that the public key and signature came from the _same_ private
key and that the message was not altered. Not even a single byte. This
powerful cryptographic tool is fundamental to how blockchains work.

```
public key -
             \
 signature - - - > ???
             /
   message -
```

In this section, you will build a simple signing API using Secp256k1, a common
cryptographic algorithm used by Bitcoin, Ethereum, and Hyperledger Sawtooth.
The underlying math is rather complex, so we will be relying on the library
[secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node) to do the
heavy lifting for us. Make sure you familiarize yourself with its API.

Note that this library uses [Node Buffers](https://nodejs.org/api/buffer.html)
(basically raw bytes) as the format of choice for keys and signatures. One of
your jobs will be to convert these bytes to and from hex strings, which are
slightly more convenient for our purposes. Make sure you are familiar with
Buffer's `from` and `toString` methods.

You will be implementing four stub methods:
- **createPrivateKey**
- **getPublicKey**
- **sign**
- **verify**


### 02 Blockchain

**Module:** [blockchain.js](blockchain.js)

**Useful APIs:**
- [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)
- [your signing module!](signing.js)

Before you can understand the blockchain data structure itself, you need to be
familiar with the concept of _hashing_: creating a deterministic digest of some
arbitrary data. Importantly, while the same data will always produce the same
hash, even a small change in the underlying data will create a completely
different digest:

```
SHA-512: 'Hello, World!' -> '374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387'

SHA-512: 'Hello, World?' -> '04d176b6977a4ee37d66e6c5b4a6cb9df46f73b453441af997b27f5f82c36bb18308b6ff5d29e4189fa41553e7ae7246db0482c9b78e42cbedc727f2ad639d9f'
```

You are free to use any hashing algorithm you like for this project, but your
best bet is to familiarize yourself with Node's crypto module. In
particular, use it to create SHA-512 hashes. This will come up later when you
start working with Hyperledger Sawtooth.

Now that you understand hashing, a blockchain should actually be rather
straightforward. It's just bundles of data linked sequentially by hashes of
that data. Start with a "genesis" block. This is the only block which won't be
linked to a previous hash. Then gather some data into a new block, combine it
with the genesis hash, and create a new hash. When more data comes in,
repeat the process: bundle the data into a new block, combine it with the
previous hash, and generate a new hash.

```javascript
[
  {
    data: '',
    hash: 'cf83e1357eefb8bd...'  // <- SHA-512: ''
  },
  {
    data: 'foo',
    previousHash: 'cf83e1357eefb8bd...',
    hash: '0bfc4817f6e1e5f3...'  // <- SHA-512: data + previousHash
  },
  {
    data: 'bar',
    previousHash: '0bfc4817f6e1e5f3...',
    hash: 'cef9981655e46b59...'  // <- SHA-512: data + previousHash
  }
]
```

Now all of your data is linked all the way back to your original genesis block.
If anyone attempts to tamper with the data in a block, the hashes will also
have to change. Anyone checking the chain of hashes would immediately see that
one does not match. In order to alter old data, you would have to modify not
only the target block, but _every_ block that comes after it.

You will implement your blockchain with three related ES6 classes:
- **Transaction**: A signed transfer of funds from one public key to another
- **Block**: A hashed collection of transactions with a previous hash
- **Blockchain**: An ordered collection of blocks, with a method to calculate
  balances

### 03 Validation

**Module:** [validation.js](validation.js)

Blockchain validation is a huge and varied topic. In Sawtooth, validation is so
important that the central component is named a "validator". For this section,
you get to be your own validator and finally verify all of the cryptographic
boilerplate that you've been including with your blocks and transactions.

You can use your `signing.verify` method to ensure that none of your
transactions have been tampered with. You should get a similar assurance for
your blocks if you recreate the hashes and make sure they match. Also, of
course, the chain of `previousHashes` should be unbroken all the way back to
your genesis block.

You'll be completing four methods, one to validate each data structure you
made, and one more just for fun, to try to tamper with your own blockchain:
- **isTransactionValid**
- **isBlockValid**
- **isChainValid**
- **breakChain**

## Extra Credit

While the next module can help you gain a deeper understanding of consensus
algorithms, and _Proof of Work_ in particular, you can feel free to move on to
[part two](../part-two/README.md) at this point. This section is strictly
optional.

To run the tests for this extra credit, remove the  `.skip` from the wrapping
`describe` block on Line 14 of
[tests/04-ExtraCredit-Mining.js](tests/04-ExtraCredit-Mining.js#L14).

### 04 Mining

**Module:** [mining.js](mining.js)

All this validation stuff is great, but what is to stop someone from coming in
and replacing huge sections of the blockchain with their own _valid_ blocks and
transactions? That is where _consensus_ comes in. A good consensus algorithm
like Proof of Work or
[Proof of Elapsed Time](https://medium.com/kokster/understanding-hyperledger-sawtooth-proof-of-elapsed-time-e0c303577ec1)
(one of the algorithms available to Sawtooth), feature _Byzantine
Fault Tolerance_: they not only ensure correctness, but also prevent bad actors
from taking over the system and rewriting large sections of the blockchain.
Zulfikar Ramzan does an excellent job of
[explaining how this works for Bitcoin](https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-proof-of-work),
but the short version is that if you randomize who gets to create new blocks,
and always select the longest chain available, a bad actor would need to take
over 51% of the network to be effective. In a highly decentralized network,
this is hopefully impractical.

So now it's your turn. You will create some tweaked versions of your original
blockchain structure around a new method: `MineableChain.mine`. This method
will allow your miners to solve the same cryptographic problem that Bitcoin
miners do, building your blockchain as they go, and rewarding themselves for
their efforts. Bonus: This means there is now a source for new funds on your
blockchain, so you can also check that no one has a negative balance.

Three new classes:
- **MineableTransaction**
- **MineableBlock**
- **MineableChain**

One new validation method:
- **isMineableChainValid**
