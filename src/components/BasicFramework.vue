<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <el-row style="line-height: 60px">
          <el-col :sm="12" :xs="12" style="text-align: left">
            <a href="/"
               style="color: white;font-weight: bold;font-size: var(--el-font-size-extra-large);">IClipboard</a>
          </el-col>
          <el-col :sm="12" :xs="12" style="text-align: right;">
            <div v-if="auth!=null">
              <div v-if="auth===-1">
                <el-button class="header-button" size="small" type="primary" @click="$emit('login')">
                  Login
                </el-button>
                <el-button class="header-button" size="small"
                           @click="$emit('register')">
                  Sign up
                </el-button>
              </div>
              <div v-else>
                <el-button-group>
                  <el-button class="header-button" size="small" type="primary"
                             @click="$emit('home')">
                    {{ auth === 0 ? 'Home' : 'Panel' }}
                  </el-button>
                  <el-button class="header-button" size="small" type="primary"
                             @click="$emit('logout')">
                    Logout
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div id="placeholder">
          <el-card id="main" v-loading="loading">
            <h1 id="title">{{ title }}</h1>
            <el-divider></el-divider>
            <slot></slot>
          </el-card>
        </div>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
const props = defineProps({
  "loading": Boolean,
  auth: Number,
  title: String,
})

const emits = defineEmits(['logout', 'login', 'register', 'home'])
</script>

<script>
export default {
  name: "BasicFramework",
}
</script>

<style scoped>
#title {
  margin: 20px;
}

#main {
  margin: 0 auto;
}

@media (min-width: 640px) {
  #main {
    width: 50%;
    min-width: 600px;
  }
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-base);
  z-index: 100;
  white-space: nowrap;
}

.el-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#placeholder {
  flex: 1 0 auto;
}

.el-footer {
  height: 60px;
  width: 100%;
  line-height: 60px;
  margin: 0 auto;
  flex: 0 0 auto;
}

.header-button {
  font-weight: bold;
  font-size: var(--el-font-size-base);
  border: 1px solid white;
}
</style>