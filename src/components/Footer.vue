<template>
  <div>
    <span style="line-height: 20px">
      &copy; {{ currentYear }}
      <a :href="COM_MAIN_PAGE" target="_blank">{{ COM_NAME }}</a
      >-<a href="https://github.com/IInforever/iclipboard">IClipboard</a>
    </span>
  </div>
</template>

<script setup>
import { COM_MAIN_PAGE, COM_NAME } from "../config/config";

const currentYear = new Date().getFullYear();
</script>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
div {
  color: var(--el-text-color-regular);
  font-size: var(--el-font-size-base);
  font-weight: var(--el-font-weight-primary);
  vertical-align: middle;
}

a:hover {
  text-decoration: underline;
}
</style>
