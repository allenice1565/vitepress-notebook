<script setup lang="ts">
import { useData } from "vitepress";
import { data } from "../posts.data";
const { page } = useData();
console.log({ data, page });
</script>
<template>
    <div>
        <div v-if="page.isNotFound">Custom 404 page!</div>
        <Content v-else />
    </div>
</template>
