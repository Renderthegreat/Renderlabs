export enum ManagerEventInputAutofillType {
    USERNAME,
    EMAIL,
    PASSWORD,
    TOKEN,
    AGENT,
    LANGUAGE
};

export enum ManagerEventInputType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean"
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
    ACCOUNT_NOTIFICATION = 0xf03
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

export function validateEventFormat(event: { eventType: ManagerEventType, parameters: Record<string, any> }) {
    const format = (ManagerEventTypeFormat as any)[event.eventType];
    if (!format) {
        return {
            success: false,
            error: `Unknown event type: ${event.eventType}`
        };
    };

    for (const key in format) {
        const expected = format[key];
        const value = event.parameters[key];

        if (value === undefined || value === null) {
            return {
                success: false,
                error: `Missing required field: ${key}`
            };
        };

        const types = expected.type;
        const valueType = typeof value;

        const isValid = types.some((t: any) => {
            switch (t) {
                case ManagerEventInputType.STRING:
                    return valueType === 'string';
                case ManagerEventInputType.NUMBER:
                    return valueType === 'number' && !isNaN(value);
                case ManagerEventInputType.BOOLEAN:
                    return valueType === 'boolean';
                default:
                    return false;
            }
        });

        if (!isValid) {
            return {
                success: false,
                error: `Invalid type for field "${key}". Expected ${types.join(', ')}, got ${valueType}`
            };
        };
    };

    return { success: true };
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