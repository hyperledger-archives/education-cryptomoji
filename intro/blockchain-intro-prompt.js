var SHA256 = require('crypto-js/sha256');

// Block class
function Block() {
    this._nonce = 0;
    /*
        Initialize the block constructor

        **Note**
        The block should be initiated with
            - an index
            - a timestamp
            - the stored data
            - the previous block's hash
    */

   // Calculate a hash based on data supplied to block
   calculateHash = function () {
       /*
           Add functionality to return a hash by passing a compiled string into the SHA256 hashing function
           The string that is passed in should contain specific data about the block that would be impossible to replicate

           **Hint**
           Unreplicable data can include
               - the block index
               - the previous hash
               - the block timestamp
       */
       return SHA256('hash');
   };

   // Mine block by difficulty
   mineBlock = function (difficulty) {
       var mined = false;
       while (false) {
           /*
               In order to mine using proof of work the calculateHash function needs to incorporate the nonce
               The nonce should increase everytime the function loops until the number of zeros at the beginning of the hash
               matches the number that is passed in (difficulty)
               The stored hash should be updated everytime the nonce increases
           */
           mined = true;
       }
       mined ? console.log('Block mined' + ' ' + this.hash) : console.log('Error');
   };

   // Inititalize using methods
   (function init() {
        this.hash = this.calculateHash();
    }.bind(this))();
}

// Blockchain class
function Blockchain() {
    this.chain = [];
    this._difficulty = 2;

    // Create the initial block for the blockchain
    _createGenesisBlock = function () {
        /* Add functionality to create an initial block */
    };

    // Get the last created block
    getLatestBlock = function () {
        /* Add functionality to get the latest block in the chain */
    };

    // Add a new block to the blockchain
    addBlock = function (newBlock) {
        /*
            Create function that:
                - Adds previousHash property to new block
                - Create hash (or mine block)
                - Adds block to the chain
        */
    };

    // Check if the chain is valid
    validChain = function () {
        /*
            Add functionality that determines that:
                - Each block's hash in the chain is valid
                - Each block's previous hash property matches the previous block's hash
        */
    };

    // Inititalize using methods
    (function init() {
        this.chain = [this._createGenesisBlock()];
    }.bind(this))();
}

/*

    Create a blockchain with at least 3 blocks not including the genesis block
        Blockchain:
        - The blockchain should return True when running validChain()
        - getLatestBlock() should return the last block in the chain

        Block:
        - Each block should have specific stored data
        - Mining a block should print the hash number (successful)
        
*/ 
