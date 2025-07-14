import { WebSocketServer } from "ws";

/**
 * Provides a WebSocket server with minimum functionality to handle connections and send messages.
 *
 * Because the class is designed to be as simple as possible,
 * it does not include advanced features or different abstractions.
 */
export default class BobWebSocket {
  private wss: WebSocketServer;

  public constructor(public readonly port: number) {
    this.wss = new WebSocketServer({ port });
  }

  /**
   * Sets up the connection and event listeners for the instantied WebSocket server.
   */
  public listen() {
    this.wss.on("connection", function connection(ws) {
      ws.on("error", console.error);

      ws.on("message", function message(data) {
        console.log("received: %s", data);
      });
    });
    return this;
  }

  /**
   * Minimum abstraction to send a message to all connected WebSocket clients.
   *
   * @param message The message to send to all connected clients.
   */
  public sendMessage(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
}
