<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <BasicFramework title="404 Not Found :(">
    <el-empty></el-empty>
    <el-button type="primary" @click="$router.push({name: 'index'})">Back</el-button>
  </BasicFramework>
</template>

<script>
import BasicFramework from "../components/BasicFramework.vue";

export default {
  name: "NotFound",
  components: {BasicFramework}
}
</script>

<style scoped>

</style>