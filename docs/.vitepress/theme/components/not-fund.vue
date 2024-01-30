<script lang="ts" setup>
defineOptions({
    name: "NotFound",
});
</script>
<template>
    <div class="not-found">
        <img src="../assets/img/404.svg" alt="找不到网页" />
        <p>啊偶，页面跑丢了...</p>
    </div>
</template>

<style lang="less" scoped>
.not-found {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    img {
        width: 40%;
        -webkit-user-drag: none;
    }
}
</style>
