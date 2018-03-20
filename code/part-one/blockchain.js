let SHA512 = require('crypto-js/sha512');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  /*
    Initialize the block constructor

    **Note**
    The block should be initiated with
      - a timestamp
      - transactions
      - the previous block's hash
  */
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this._nonce = 0;
  }

  /*
    Calculate a hash based on transactions supplied to block:

    - Add functionality to return a hash by passing a compiled string
    into the SHA256 hashing function

    - The string that is passed in should contain specific data
    about the block that would be impossible to replicate

    **Hint**
    Unreplicable data can include
      - transactions
      - the previous hash
      - the block timestamp
  */
  calculateHash() {
    return SHA512(`
      ${this.previousHash}
      ${this.timestamp}
      ${JSON.stringify(this.transactions)}
      ${this._nonce}
    `).toString();
  }

  /*
    Mine block by difficulty:

    - In order to mine using proof of work the calculateHash function
    needs to incorporate the nonce

    - The nonce should increase everytime the function loops
    until the number of zeros at the beginning of the hash
    matches the number that is passed in (difficulty)

    - The stored hash should be updated everytime the nonce increases
  */
  mineBlock(difficulty) {
    console.log('Mining block...');
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this._nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`${'Block mined'} ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this._createGenesisBlock()];
    this._difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  /*
    Create the initial block for the blockchain:

    - Add functionality to create an initial block
  */
  _createGenesisBlock() {
    return new Block((new Date()).toString(), 'Genesis Block', '0');
  }

  /*
    Get the last created block:

    - Add functionality to get the latest block in the chain 
  */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /*
    Add a new block to the blockchain based on pending transactions:

    Create function that:
      - Adds previousHash property to new block
      - Create hash (or mine block)
      - Adds block to the chain
      - Creates new pending transaction for mining reward
  */
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this._difficulty);

    console.log('Block has been mined.');
    this.chain.push(block);
    
    this.pendingTransactions = [
      /*
        Mining rewards do not come from any specific address and instead are awarded
        directly from the chain itself.
      */
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  /*
    Check if the chain is valid:

    Add functionality that determines that:
      - Each block's hash in the chain is valid
      - Each block's previous hash property matches the previous block's hash
  */
  isValidChain() {
    return this.chain.every((block, i) => {
      const previousBlock = this.chain[i - 1];

      return (
        !previousBlock ||
        block.hash === block.calculateHash() ||
        block.previousHash === previousBlock.hash
      );
    });
  }
}
