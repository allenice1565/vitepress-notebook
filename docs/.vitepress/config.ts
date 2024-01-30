import { defineConfig } from "vitepress";
import { rewrites, sideBars } from "./theme/get-articles";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Allenice",
    description: "A VitePress Site",
    base: "/",
    srcDir: "src",
    rewrites: {
        "custom-pages/index.md": "index.md",
        ...rewrites,
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: "首页",
                link: "/",
            },
            {
                text: "前端",
                items: [
                    {
                        text: "JavaScript",
                        link: "/pages/6cc245",
                    },
                    {
                        text: "TypeScript",
                        link: "/pages/55cf2e",
                    },
                    {
                        text: "Vue",
                        link: "/pages/a51a57",
                    },
                    {
                        text: "CSS",
                        link: "/pages/17c8be",
                    },
                    {
                        text: "构建",
                        items: [
                            {
                                text: "Rollup",
                                link: "/pages/f6535a",
                            },
                        ],
                    },
                    {
                        text: "工具",
                        link: "/pages/7046bb",
                    },
                    {
                        text: "NodeJS",
                        link: "/pages/4a2328",
                    },
                    {
                        text: "遇见的问题",
                        link: "/pages/c44a64",
                    },
                ],
            },
            {
                text: "其他技术栈",
                items: [
                    {
                        text: "Docker",
                        link: "/pages/566963",
                    },
                    {
                        text: "Python",
                        link: "/pages/64ecaf",
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
