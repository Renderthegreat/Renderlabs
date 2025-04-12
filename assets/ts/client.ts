import { ManagerEvent, ManagerEventType, waitForReady } from "~/assets/ts/manager";

export class RenderlabsClient {
    constructor() {
        this.toast = useToast();
        this.connect();
    };
    private connect(retryDelay = 1000) {
        this.socket = new WebSocket(`ws://${window.location.hostname}:3001`);

        this.socket.onopen = () => {
            console.log("Connected to server ✅");
        };

        this.socket.onclose = () => {
            console.warn(`Lost connection. Retrying in ${retryDelay}ms...`);

            setTimeout(async () => {
                try {
                    this.socket = new WebSocket(`ws://${window.location.hostname}:3001`);
                    await waitForReady(this.socket);
                    this.connect(); // Re-register handlers
                } catch (err) {
                    const nextDelay = Math.min(retryDelay * 2, 30000); // Max 30s
                    console.error("Reconnect failed. Retrying again...");
                    this.connect(nextDelay);
                };
            }, retryDelay);
        };

        this.socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };
    };

    private async sendEvent(event: ManagerEvent) {
        await waitForReady(this.socket);
        this.socket.send(event.getRaw());
    };
    private recieveEvent(callback: (event: ManagerEvent) => {}) {
        this.socket.onmessage = async (data) => {
            const event = ManagerEvent.fromRaw(await blobToUint32Array(data.data));
            if (event.eventType === ManagerEventType.ACCOUNT_NOTIFICATION) {
                this.toast.add({
                    id: event.parameters["id"],
                    title: event.parameters["title"],
                    description: event.parameters["description"],
                    icon: event.parameters["icon"]
                });
            };
            callback(event);
        };
    };
    public async $post(event: ManagerEvent) {
        const response = new Promise<ManagerEvent>(async (resolve) => {
            this.recieveEvent(resolve as any);
        });

        await this.sendEvent(event);
        return await response;
    };
    private socket!: WebSocket;
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