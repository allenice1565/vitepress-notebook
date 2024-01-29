import DefaultTheme from "vitepress/theme";
import BaseLayout from "./layout/base.vue";
import type { Theme } from "vitepress";

export default {
    ...DefaultTheme,
    Layout: BaseLayout,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
    },
} satisfies Theme;
