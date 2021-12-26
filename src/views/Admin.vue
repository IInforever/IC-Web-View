<template>
  <div>
    <el-container>
      <el-header id="header">
        <el-row :gutter="10" style="line-height: 60px">
          <el-col :md="1" ></el-col>
          <el-col :md="21">
            <h1 style="color: aliceblue">Admin Panel</h1>
          </el-col>
          <el-col :md="2" style="text-align: right">
            <el-dropdown>
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
              style="height: 100%"
              :default-active="this.$route.path"
              :collapse="true"
              router>
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
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view v-slot="{ Component }" name="content">
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
import {ArrowDown, Menu, User, UserFilled} from "@element-plus/icons-vue";
import Footer from "../components/Footer.vue";</script>

<script>
export default {
  name: "Admin",
  methods: {
    onResize() {
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
  /*border-bottom: 2px solid var(--el-border-color-base);*/
  box-shadow: var(--el-box-shadow-base);
  z-index: 100;
}

.el-aside {
  height: calc(100vh - 120px)
}

.el-footer {
  border-top: 1px solid var(--el-border-color-base);
  background-color: #fafafa;
}
</style>