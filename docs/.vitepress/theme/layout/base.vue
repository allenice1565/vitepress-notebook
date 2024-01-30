<script setup lang="ts">
import { useData } from "vitepress";
import { data } from "../posts.data";
import DefaultTheme from "vitepress/theme";
import NotFound from "../components/not-fund.vue";

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData();
console.log({ data, page, frontmatter });
</script>
<template>
    <Layout>
        <template #page-top>123</template>
        <template #not-found>
            <NotFound />
        </template>
    </Layout>
</template>
<style>
.content .outline-title,
.VPDocOutlineDropdown,
.VPLocalNavOutlineDropdown {
    display: none !important;
}
</style>
