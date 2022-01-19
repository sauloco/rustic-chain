const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      Balance: ${this.balance}
      Public Key: ${this.publicKey.toString()}`;
  }
}

module.exports = Wallet;