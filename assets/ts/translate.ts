import lang from "~/assets/locales/global.json";

function getNestedValue(obj: any, keys: any) {
    return keys.reduce((acc: any, key: any) => acc?.[key], obj);
}

export function $t(key: string): string {
    const locale = globalThis?.window?.navigator?.language.slice(0, 2) || useRequestHeaders()["accept-language"].slice(0, 2);
    return getNestedValue((lang as any)?.[locale], key.split('.')) || `lang.${locale}.${key}`;
};
