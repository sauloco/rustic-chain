const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
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

      switch (message.type) {
        case "chain":
          this.blockchain.replaceChain(message.chain);
          break;
        case "transaction":
          this.blockchain.addTransaction(message.transaction);
          break;
        case "clear-transactions":
          this.blockchain.clearTransactions();
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
        type: "chain",
        chain: this.blockchain.chain,
      })
    );
  }
}

module.exports = P2PServer;
