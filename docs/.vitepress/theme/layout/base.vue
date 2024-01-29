<script setup lang="ts">
import { useData } from "vitepress";
import { data } from "../posts.data";
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData();
console.log({ data, page, frontmatter });
</script>
<template>
    <div>
        <div v-if="page.isNotFound">Custom 404 page!</div>
        <Layout v-else />
    </div>
</template>
