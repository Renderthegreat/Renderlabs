import lang from "~/assets/locales/global.json";

export function $t(key: string): string {
    const locale = globalThis?.window?.navigator?.language.slice(0, 2);
    return (lang as any)?.[locale || "en"]?.[key] || `lang.${locale}.${key}`;
};
