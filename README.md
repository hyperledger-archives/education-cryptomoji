# Hyperledger Cryptomoji

This educational curriculum includes a quick intro to blockchains generally,
before diving into distributed application development by guiding students
through building their own [Cryptokitties](https://www.cryptokitties.co/about)
clone built with
[Hyperledger Sawtooth](https://www.hyperledger.org/projects/sawtooth) and
Javascript. It follows a bootcamp "sprint" format, providing a stub
application for students to implement themselves and extensive tests to guide
their work.

＼(＾▽＾)／

## Contents

- [Prerequisites](#prerequisites)
- [Sections](#sections)
    * [Part One: DIY Blockchain](#part-one-diy-blockchain)
    * [Part Two: Sawtooth Cryptomoji](#part-two-sawtooth-cryptomoji)
- [Solution Code](#solution-code)
- [Contributing](#contributing)
- [License](#license)


## Prerequisites

This project requires [Node 8](https://nodejs.org/) and
[Docker](https://www.docker.com/community-edition).


## Sections

This curriculum is broken into two parts. Although they build on one another,
if you are already familiar with blockchain basics you can probably skip part
one. For detailed instructions on each section, head to their individual
READMEs.

### Part One: DIY Blockchain

**README:** [code/part-one/README.md](code/part-one/README.md)

**Duration:** 5-10 hours

**Concepts:**
- Basic blockchain structure
- Hashing
- Signing
- Consensus

Part one introduces you to general blockchain concepts by walking you through
building your own. You should finish with basic working knowledge of hashing,
signing, consensus algorithms, and the blockchain data structure itself.

＼(〇_ｏ)／


### Part Two: Sawtooth Cryptomoji

**README:** [code/part-two/README.md](code/part-two/README.md)

**Duration:** 20-40 hours

**Concepts:**
- Hyperledger Sawtooth overview
- Writing clients
    - Building transactions and batches
    - Interacting with the Sawtooth REST API
- Writing transaction processors
    - Reading and writing state
    - Validating payloads

Part two is the actual Cryptomoji app. It should give you a detailed
understanding of how to build both clients and "transaction processors" on
Hyperledger Sawtooth. When you're done you will have a working full-stack
application ready to be deployed on a Sawtooth blockchain.

(づ￣ ³￣)づ


### Solution Code

In addition to the prompts and stub functions in the `master` branch, this repo
includes a `solution` branch with completed versions of both sections. This
branch is a way for students to check their work and become familiar with
current best practices. If your intention is to complete the sprint, we
recommended that you do _not_ use the solution code as a way to get yourself
unstuck. At least attempt every prompt. If necessary, seek guidance from
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/hyperledger-sawtooth)
or Sawtooth's [official chat](https://chat.hyperledger.org/channel/sawtooth),
before resorting to looking in the back of the book for the answers.

( ╯°□°)╯ ┻━━┻


## Contributing

This is an ongoing project, and we always appreciate involvement from outside
contributors. We use GitHub Issues to track bugs. If you have a problem to
report, like a typo, a confusing lesson, or something not working as expected,
please click on the _Issues_ tab above, and then the
[New Issue](https://github.com/hyperledger/education-cryptomoji/issues/new)
button.

If you would like to go a step further and contribute code, consider giving our
[Contributing Guide](CONTRIBUTING.md) a quick read to familiarize yourself with
our PR process.

__φ(．．;)


## License

The source code of this project is licensed for reuse under the
[Apache License Version 2.0](LICENSE).

The slides, videos, and original written material are licensed under
[Creative Commons Attribution 4.0](http://creativecommons.org/licenses/by/4.0/).

~ヾ(・ω・)
