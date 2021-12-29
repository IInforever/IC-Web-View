<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <el-row style="line-height: 60px">
          <el-col :sm="12" :xs="12" style="text-align: left">
            <span style="color: white;font-weight: bold;font-size: var(--el-font-size-extra-large);">IClipboard</span>
          </el-col>
          <el-col :sm="12" :xs="12" style="text-align: right;">
            <div v-if="auth===-1">
              <el-button class="title-button" round size="small" type="primary" @click="$router.push({name:'login'})">
                Login
              </el-button>
              <el-button class="title-button" round size="small" type="primary"
                         @click="$router.push({name:'register'})">
                Register
              </el-button>
            </div>
            <div v-else>
              <el-button class="title-button" round size="small" type="primary"
                         @click="$router.push(auth===0?{name:'home'}:{name:'admin-index'})">
                {{ auth === 0 ? 'Home' : 'Panel' }}
              </el-button>
              <el-button class="title-button" round size="small" type="primary"
                         @click="logout">
                Logout
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div id="placeholder">
          <el-card id="main">
            <h1 id="title">Hello, ICB</h1>
            <el-divider></el-divider>
            233333333333
            <p>123</p>
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
import Footer from "../components/Footer.vue";
import {CheckSession} from "../lib/auth-util";</script>

<script>
import {CheckSession} from "../lib/auth-util";
import {ElMessage} from "element-plus";

export default {
  methods: {
    logout() {
      this.auth = -1
      ElMessage({
        message: 'logged out',
        type: 'success'
      })
    }
  },
  data() {
    return {
      auth: CheckSession()
    }
  }
}
</script>

<style scoped>
#title {
  margin: 20px;
}

#main {
  margin: 0 auto;
  height: 500px;
}

@media (min-width: 600px) {
  #main {
    width: 50%;
    min-width: 550px;
  }
}

.el-button {
  margin: 10px;
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


.title-button {
  font-weight: bold;
  font-size: var(--el-font-size-base);
  margin: 0;
}
</style>