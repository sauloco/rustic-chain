const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
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

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
    
    if (amount > this.balance) {
      console.log(`Amount ${amount} exceeds current balance (${this.balance})`);
    }

    let transaction = transactionPool.existingTransaction(this.publicKey); // todo

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];

    for (const block of blockchain.chain) {
      for (const transaction of block.data) {
        transactions.push(transaction);
      }
    }

    const walletInputTs = transactions.filter( transaction => transaction.input.address === this.publicKey);
  
    let startTime = 0;
    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current)

      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInputT.input.timestamp;
    }

    for (const transaction of transactions) {
      if (tramsaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        })
      }
    }

    return balance;

  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;