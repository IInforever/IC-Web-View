<!--
  - Copyright (c) IInfo 2022.
  -->

<script setup>
import 'element-plus/dist/index.css'
import './assets/transition.css'</script>

<template>
  <router-view v-slot="{ Component }">
    <transition mode="out-in" name="fade">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<style>
html, body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}

a {
  color: var(--el-text-color-regular);
  text-decoration: unset;
}

a:visited {
  color: unset;
}

a:hover {
  color: var(--el-color-primary);
}

.el-input__icon.el-icon {
  height: inherit;
  width: 25px;
}

</style>
