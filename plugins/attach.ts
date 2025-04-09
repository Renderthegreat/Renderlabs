import { defineNuxtPlugin } from '#app';
import { RenderlabsClient } from '~/assets/ts/client';
import { ManagerEvent, ManagerEventType } from '~/assets/ts/manager';

export default defineNuxtPlugin(() => {
    let client: RenderlabsClient | null = null;

    if (process.client) {
        client = new RenderlabsClient();
        client.sendEvent(
            new ManagerEvent(ManagerEventType.CLIENT_INIT, {
                language: navigator.language,
                device: navigator.userAgent,
            })
        );
        // Expose for debugging
        (window as any).client = client;
        (window as any).ManagerEvent = ManagerEvent;
        (window as any).ManagerEventType = ManagerEventType;
    };

    return {
        provide: {
            client,
        },
    };
});