const Transaction = require('./transaction');
class TransactionPool {
  constructor(){
    this.transactions = [];

  }

  updateOrAddTransaction(transaction){
    const existingTransaction = this.transactions.find(t => t.id === transaction.id);

    if (existingTransaction) {
       this.transactions[this.transactions.indexOf(existingTransaction)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(publicKey){
    return this.transactions.find(t => t.input.address === publicKey);
  }

  validTransactions(){
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => total + output.amount, 0)

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }

      return transaction
    })
  }
}

module.exports = TransactionPool;