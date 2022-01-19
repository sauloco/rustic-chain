const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {

    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      // console.log('The genesis block must be the same.');
      return false
    };

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)) {
        // console.log('The hashes must be valid.', block, lastBlock);
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      // console.log('The incoming chain must be longer.');
      return;
    } else if (!this.isValidChain(newChain)) {
      // console.log('The incoming chain must be valid.');
      return;
    }

    // console.log('Replacing blockchain with the incoming chain.');
    this.chain = newChain;
  }
}

module.exports = Blockchain;