import { useClient } from "~/composable/useClient";
import { $t } from "~/assets/ts/translate";

let theme: string = "";

if (process.client) {
    theme = localStorage.getItem("theme")?.toString() || "";
    if (!theme) {
        theme = "light";
        localStorage.setItem("theme", theme);
    };
};
const setTheme = (theme: string) => {
    switch (theme) {
        case "light": {
            document.documentElement.style.setProperty("--foreground-color", "rgb(17 24 39)");
            document.documentElement.style.setProperty("--background-color", "#e8e8e8");
            break;
        };
        case "dark": {
            document.documentElement.style.setProperty("--foreground-color", "#e8e8e8");
            document.documentElement.style.setProperty("--background-color", "rgb(17 24 39)");
            break;
        };
    };
};

setTheme(theme);

export default {

};