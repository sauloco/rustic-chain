const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
  clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2PServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    for (const peer of peers) {
      const socket = new Websocket(peer);

      socket.on("open", () => this.connectSocket(socket));
    }
  }

  connectSocket(socket) {
    this.sockets.push(socket);

    console.log("Socket connected");

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data);
      
      const { [message.type.toLowerCase()]: relevantBlock } = message;

      switch (message.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(relevantBlock);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(relevantBlock);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  syncChains() {
    for (const socket of this.sockets) {
      this.sendChain(socket);
    }
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain,
      })
    );
  }

  broadcastTransaction(transaction) {
    for (const socket of this.sockets) {
      this.sendTransaction(socket, transaction);
    }
  }

  broadcastClearTransactions() {
    for (const socket of this.sockets) {
      socket.send(JSON.stringify({
        type: MESSAGE_TYPES.clear_transactions,
      }));
    }
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction,
      })
    );
  }
}

module.exports = P2PServer;
