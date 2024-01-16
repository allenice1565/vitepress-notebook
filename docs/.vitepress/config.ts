import { defineConfig } from "vitepress";
import { rewrites } from "./theme/generatePermalink";
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Allenice",
    description: "A VitePress Site",
    base: "/",
    srcDir: "src",
    rewrites,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "首页", link: "/" },
            {
                text: "前端",
                items: [
                    { text: "javaScript", link: "/front-end/js/index.md" },
                    { text: "typeScript", link: "/front-end/ts" },
                    { text: "Vue", link: "/front-end/vue" },
                    { text: "React", link: "/front-end/react" },
                    { text: "构建", link: "/front-end/building" },
                    { text: "插件使用", link: "/front-end/plugins" },
                    { text: "技术应用", link: "/front-end/techniques" },
                    { text: "遇见的问题", link: "/front-end/problems" },
                ],
            },
            {
                text: "项目",
                items: [
                    { text: "my-linter", link: "/project/my-linter" },
                    { text: "auto-login", link: "/project/auto-login" },
                ],
            },
        ],
        sidebar: {
            // 当用户位于 `guide` 目录时，会显示此侧边栏
            "/pages/": [
                {
                    text: "Guide",
                    items: [
                        { text: "Index", link: "/guide/" },
                        { text: "One", link: "/guide/one" },
                        { text: "Two", link: "/guide/two" },
                    ],
                },
            ],

            // 当用户位于 `config` 目录时，会显示此侧边栏
            "/1-项目/": [
                {
                    text: "Config",
                    items: [
                        { text: "Index", link: "/config/" },
                        { text: "Three", link: "/config/three" },
                        { text: "Four", link: "/config/four" },
                    ],
                },
            ],
        },
    },
    cleanUrls: true,
});
