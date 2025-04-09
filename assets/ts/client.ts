import { ManagerEvent, ManagerEventType, waitForReady } from "~/assets/ts/manager";

export class RenderlabsClient {
    constructor() {
        this.socket = new WebSocket(`ws:${window.location.hostname}:3001`);
        this.toast = useToast();
    };
    async sendEvent(event: ManagerEvent) {
        await waitForReady(this.socket);
        this.socket.send(event.getRaw());
    };
    recieveEvent(callback: (event: ManagerEvent) => {}) {
        this.socket.onmessage = async (event) => {
            console.log(event.data);
            callback(ManagerEvent.fromRaw(await blobToUint32Array(event.data)));
        };
    };
    private socket: WebSocket;
    public toast: ReturnType<typeof useToast>;
};

function blobToUint32Array(blob: Blob): Promise<Uint32Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint32Array = new Uint32Array(arrayBuffer);
            resolve(uint32Array);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(blob);
    });
};