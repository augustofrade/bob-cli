import { WebSocketServer } from "ws";

export default class BobWebSocket {
  private wss: WebSocketServer;

  public constructor(public readonly port: number) {
    this.wss = new WebSocketServer({ port });
  }

  public listen() {
    this.wss.on("connection", function connection(ws) {
      ws.on("error", console.error);

      ws.on("message", function message(data) {
        console.log("received: %s", data);
      });
    });
    return this;
  }

  public sendMessage(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
}
