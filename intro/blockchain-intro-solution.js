const SHA256 = require('crypto-js/sha256');

// Block class
function Block(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this._nonce = 0;
    this.hash = '';
    
    // Calculate a hash based on data supplied to block
    this.calculateHash = function () {
        return SHA256("" + this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this._nonce).toString();
    };
    
    // Mine block by difficulty
    this.mineBlock = function (difficulty) {
        console.log('Mining block...')
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this._nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined' + ' ' + this.hash);
    };

    // Inititalize using methods
    (function init() {
        this.hash = this.calculateHash();
    }.bind(this))();
}

// Blockchain class
function Blockchain() {
    this._difficulty = 5;
    this.chain = [];
    
    // Create the initial block for the blockchain
    this._createGenesisBlock = function () {
        return new Block(0, (new Date()).toString(), 'Genesis Block', '0');
    };
    
    // Get the last created block
    this.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };

    // Add a new block to the blockchain
    this.addBlock = function (newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this._difficulty);
        this.chain.push(newBlock);
    };

    // Check if the chain is valid
    this.validChain = function () {
        var _this = this;
        var validity = true;

        this.chain.forEach(function (block, i) {
            var previousBlock = _this.chain[i - 1];
            if (block.hash !== block.calculateHash() ||
                block.previousHash !== previousBlock.hash) {
                validity = false;
            }
        });
        return validity;
    };

    // Inititalize using methods
    (function init() {
        this.chain = [this._createGenesisBlock()];
    }.bind(this))();
}
