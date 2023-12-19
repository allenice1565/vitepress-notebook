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
            "/front-end/js/": [
                {
                    text: "node包管理工具",
                    link: "/front-end/js/000.node包管理工具",
                },
            ],
        },
        x: {},
    },
    cleanUrls: true,
});
