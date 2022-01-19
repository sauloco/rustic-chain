const { INITIAL_BALANCE } = require('../config');

const Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = null;
    this.publicKey = null;
  }

  toString() {
    return `Wallet -
      Balance: ${this.balance}
      Public Key: ${this.publicKey.toString()}`;
  }
}

module.exports = Wallet;