export enum ManagerEventInputAutofillType {
    USERNAME,
    EMAIL,
    PASSWORD,
    TOKEN,
    AGENT,
    LANGUAGE
};

export enum ManagerEventInputType {
    STRING,
    NUMBER,
};

export enum ManagerEventType {
    // Client packets
    CLIENT_INIT = 0x001,
    ACCOUNT_LOGIN = 0x002,
    ACCOUNT_CREATE = 0x003,
    ACCOUNT_LOGOUT = 0x004,
    ACCOUNT_MANAGE = 0x005,
    GENERATE_CAPTCHA = 0x0a1,
    VALIDATE_CAPTCHA = 0x0a2,
    // Server packets
    OPERATION_SUCCESS = 0xf01,
    OPERATION_FAILURE = 0xf02,

};

export const ManagerEventTypeFormat = {
    [ManagerEventType.CLIENT_INIT]: {
        "language": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [[ManagerEventInputAutofillType.LANGUAGE]]
        },
        "agent": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [[ManagerEventInputAutofillType.AGENT]]
        }
    },
    [ManagerEventType.ACCOUNT_LOGIN]: {
        "username": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [ManagerEventInputAutofillType.USERNAME]
        },
        "email": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [ManagerEventInputAutofillType.EMAIL]
        },
        "password": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [ManagerEventInputAutofillType.PASSWORD]
        },
        "token": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [ManagerEventInputAutofillType.TOKEN]
        }
    },
    [ManagerEventType.ACCOUNT_CREATE]: {
        "username": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [null]
        },
        "email": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [null]
        },
        "password": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [null]
        },
        "captcha-id": {
            "type": [ManagerEventInputType.NUMBER],
            "autofill": [null]
        },
        "captcha-solution": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [null]
        }
    },
    [ManagerEventType.GENERATE_CAPTCHA]: {

    },
    [ManagerEventType.VALIDATE_CAPTCHA]: {
        "id": {
            "type": [ManagerEventInputType.NUMBER],
            "autofill": [null]
        },
        "key": {
            "type": [ManagerEventInputType.STRING],
            "autofill": [null]
        }
    }
};

export class ManagerEvent {
    constructor(
        public eventType: ManagerEventType,
        public parameters: { [key: string]: any; }
    ) {

    };
    public getRaw() {
        let paramString = JSON.stringify(this.parameters);
        let buffer = new Uint32Array(new ArrayBuffer((1 + paramString.length) * 4));
        buffer[0] = this.eventType;
        for (let i = 0; i < paramString.length; i++) {
            buffer[i + 1] = paramString.charCodeAt(i);
        };
        return buffer;
    };
    public static fromRaw(raw: Uint32Array) {
        const eventType = raw[0];
        const charCodes = Array.from(raw.slice(1));
        const paramString = String.fromCharCode(...charCodes);
        console.log(paramString);
        return new ManagerEvent(eventType, JSON.parse(paramString.replace(/\0/g, "")));
    };

};

export function waitForReady(socket: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) return resolve();

        socket.addEventListener("open", () => resolve());
        socket.addEventListener("error", (err) => reject(err));
    });
};