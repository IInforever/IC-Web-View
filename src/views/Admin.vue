<!--
  - Copyright (c) IInfo 2022 All rights reserved.
  -->

<template>
  <div>
    <el-container>
      <el-header id="header">
        <el-row style="line-height: 60px">
          <el-col :sm="6" :xs="6" style="text-align: left">
            <el-button :icon="HomeFilled" circle type="primary" @click="$router.push({name:'index'})">
            </el-button>
          </el-col>
          <el-col :sm="12" :xs="12">
            <h1 style="color: aliceblue;white-space: nowrap">Admin Panel</h1>
          </el-col>
          <el-col :sm="6" :xs="6" style="text-align: right">
            <el-dropdown trigger="click" @command="handleCommand">
              <span :style="{color: 'aliceblue',fontSize: 'var(--el-font-size-base)',fontWeight: 'bold'}"
                    class="el-dropdown-link">
                <el-icon style="vertical-align: middle">
                  <UserFilled/>
                </el-icon>
                Admin
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
      <el-container>
        <el-aside style="width: fit-content">
          <el-menu
              :collapse="collapse"
              :default-active="$route.path"
              router
              style="height: 100%">
            <el-menu-item index="/admin/stat">
              <el-icon>
                <Menu/>
              </el-icon>
              <span>Stat</span>
            </el-menu-item>
            <el-menu-item index="/admin/users">
              <el-icon>
                <User/>
              </el-icon>
              <span>Users</span>
            </el-menu-item>
            <el-menu-item index="" @click="menuCollapse">
              <el-icon>
                <Expand v-if="collapse"/>
                <Fold v-else/>
              </el-icon>
              <span>Fold Menu</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="fade">
                <component :is="Component"/>
              </transition>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import {ArrowDown, Expand, Fold, HomeFilled, Menu, User, UserFilled} from "@element-plus/icons-vue";
import Footer from "../components/Footer.vue";</script>

<script>
import {CheckSession} from "../utility/auth";
import {ElMessage} from "element-plus";

export default {
  name: "Admin",
  data() {
    return {
      collapse: window.innerWidth < 768,
    }
  },
  methods: {
    onResize() {
      if (window.innerWidth < 768) {
        this.collapse = true;
      }
    },
    menuCollapse() {
      this.collapse = !this.collapse
    },
    handleCommand(command) {
      if (command === "logout") {
        localStorage.removeItem("admin-token")
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
  beforeMount() {
    let auth = CheckSession()
    if (auth !== 1) {
      this.$router.push({name: 'index'})
      ElMessage({
        message: 'Admin Authorization required',
        type: 'warning'
      })
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize)
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize)
  }
}
</script>

<style scoped>
#header {
  background-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-base);
  z-index: 100;
}

.el-aside {
  height: calc(100vh - 120px)
}

.el-footer {
  box-sizing: border-box;
  border: 1px solid var(--el-border-color-base);
  background-color: #fafafa;
  line-height: 59px;
}

.el-dropdown:hover {
  cursor: pointer;
}

</style>