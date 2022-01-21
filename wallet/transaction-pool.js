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
}

module.exports = TransactionPool;