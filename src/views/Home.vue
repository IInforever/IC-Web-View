<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside :class="{'menu-collapse':collapse}" class="menu" width="200px">
        <div style="height: 60px;width: 200px">
          <a style="cursor: pointer" @click="$router.push({name:'index'})">
            <h1 style="line-height: 60px">IClipboard</h1>
          </a>
        </div>
        <el-menu :default-active="this.$route.path"
                 router
                 style="height: calc(100% - 60px)"
        >
          <el-menu-item index="/home/info">
            <el-icon>
              <User/>
            </el-icon>
            Info
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header id="header">
          <el-row justify="space-around" style="line-height: 60px">
            <el-col :span="6" style="text-align: left;">
              <el-button :icon="collapse?Fold:Expand" circle type="primary" @click="collapse = !collapse">
              </el-button>
            </el-col>
            <el-col :span="12">
              <h1 style="color: aliceblue">Home</h1>
            </el-col>
            <el-col :span="6" style="text-align: right">
              <el-dropdown trigger="click" @command="handleCommand">
              <span :style="{color: 'aliceblue',fontSize: 'var(--el-font-size-base)',fontWeight: 'bold'}"
                    class="el-dropdown-link">
              {{ user.name }}
                <el-icon class="el-icon--right" style="vertical-align: middle">
                  <ArrowDown></ArrowDown>
              </el-icon>
              </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="logout">Sign out</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {ArrowDown, Expand, Fold, User} from "@element-plus/icons-vue";
import Footer from "../components/Footer.vue";</script>

<script>
import {ElMessage} from "element-plus";
import {RemoveTokens} from "../lib/auth-util";

export default {
  name: "Home",
  data() {
    return {
      user: {name: localStorage.getItem("username")},
      collapse: false,
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        RemoveTokens()
        ElMessage({
          message: 'logged out',
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push({name: 'index'})
        }, 1000)
      }
    }
  },
}
</script>

<style scoped>

#header {
  background-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-base);
  z-index: 100;
}


@media (min-width: 600px) {
  #main-card {
    margin: 0 auto;
    width: 50%;
    min-width: 550px;
  }
}

.el-dropdown:hover {
  cursor: pointer;
}

.el-footer {
  box-sizing: border-box;
  border: 1px solid var(--el-border-color-base);
  border-left: unset;
  background-color: #fafafa;
  line-height: 59px;
}

.menu-collapse {
  width: 0;
}

.menu {
  transition-duration: 0.25s;
  height: 100%;
}

</style>