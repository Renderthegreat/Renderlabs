import { $t } from '~/assets/ts/translate';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            t: $t
        }
    };
});
