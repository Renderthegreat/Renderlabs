let theme = null;

if (process.client) {
    theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
        localStorage.setItem("theme", theme);
    };
};
const setTheme = (theme) => {
    switch (theme) {
        case "light": {
            document.documentElement.style.setProperty("--foreground-color", "#161616");
            document.documentElement.style.setProperty("--background-color", "#e8e8e8");
            break;
        };
        case "dark": {
            document.documentElement.style.setProperty("--foreground-color", "#e8e8e8");
            document.documentElement.style.setProperty("--background-color", "#161616");
            break;
        };
    };
};

setTheme(theme);

export default {
    
};