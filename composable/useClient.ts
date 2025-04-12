import "assets/ts/manager";

export const useClient = () => {
    return useNuxtApp().$client;
};