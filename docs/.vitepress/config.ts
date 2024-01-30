import { defineConfig } from "vitepress";
import { rewrites, sideBars } from "./theme/get-articles";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Allenice",
    description: "A VitePress Site",
    base: "/",
    srcDir: "src",
    rewrites: {
        "custom-pages/index.md": "home.md",
        ...rewrites,
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: "首页",
                link: "/home",
            },
            {
                text: "前端",
                items: [
                    {
                        text: "JavaScript",
                        link: "/pages/6cc245",
                    },
                ],
            },
        ],
        sidebar: {
            ...sideBars,
        },
    },
    cleanUrls: true,
});
