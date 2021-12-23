<template>
  <p>&copy; {{currentYear}}
    <a :href="COM_MAIN_PAGE" style="line-height: 20px;vertical-align: center" target="_blank">IInforever</a></p>
</template>

<script setup>
import {COM_MAIN_PAGE} from "../config/config";
const currentYear =  new Date().getFullYear()
</script>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
p {
  font-size: var(--el-font-size-base);
  font-weight: var(--el-font-weight-primary);
}
a:visited {
  color: unset;
}
</style>