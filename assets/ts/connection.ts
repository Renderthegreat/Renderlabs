import { ManagerEvent, ManagerEventType } from "~/assets/ts/manager";
import { WebSocketServer, WebSocket } from "ws";
export class RenderlabsConnection {
    constructor(
        private socket: WebSocket
    ) {

    };
    async sendEvent(event: ManagerEvent) {
        await waitForReady(this.socket);
        this.socket.send(event.getRaw());
    };
    recieveEvent(callback: (event: ManagerEvent) => {}) {
        this.socket.onmessage = (event) => {
            callback(ManagerEvent.fromRaw(event.data as unknown as Uint32Array));
        };
    };
};

export function waitForReady(socket: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) return resolve();

        socket.addEventListener("open", () => resolve());
        socket.addEventListener("error", (err) => reject(err));
    });
};