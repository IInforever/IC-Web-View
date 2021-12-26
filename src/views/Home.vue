<template>
  <div>
    <el-container>
      <el-header id="header">
        <el-row justify="space-around" style="line-height: 60px">
          <el-col :span="6"></el-col>
          <el-col :span="6">
            <h1 style="color: aliceblue">Home</h1>
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-dropdown @command="handleCommand">
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
        <el-skeleton v-if="isLoading"/>
        <el-card v-if="!isLoading" id="main-card">
          <h2>
            Hello, <span style="text-decoration: underline;font-weight: bold">{{ user.name }}</span>
          </h2>
          <el-descriptions
              title="User info"
              column="1"
              border>
            <el-descriptions-item>
              <template #label>
                <el-icon>
                  <Key/>
                </el-icon>
                UID
              </template>
              {{ user.id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <el-icon>
                  <User/>
                </el-icon>
                Username
              </template>
              {{ user.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <el-icon>
                  <Message/>
                </el-icon>
                Email
              </template>
              {{ user.email }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <el-icon>
                  <Message/>
                </el-icon>
                Last login time
              </template>
              <p>{{ user.lastLoginTime }}</p>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import {ArrowDown, Key, Message, User} from "@element-plus/icons-vue";
import Footer from "../components/Footer.vue";</script>

<script>
import axios from "axios";
import {CheckSession, UpdateToken} from "../lib/auth-util";
import {ElMessage} from "element-plus";

export default {
  name: "Home",
  data() {
    return {
      user: {},
      isLoading: true,
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        sessionStorage.removeItem("auth-token")
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
  mounted() {
    let auth = CheckSession()
    if (auth === -1) {
      ElMessage({
        message: 'Authorization required',
        type: 'warning'
      })
      setTimeout(() => {
        this.$router.push({name: 'login'})
      }, 1000)
      return
    } else if (auth === 1) {
      ElMessage({
        message: 'Not allowed',
        type: 'warning'
      })
      setTimeout(() => {
        this.$router.push({name: 'index'})
      }, 1000)
      return
    }

    axios.get("/api/user", {
      headers: {
        Authorization: sessionStorage.getItem('auth-token')
      }
    })
        .then((response) => {
          UpdateToken(response)
          this.isLoading = false
          this.user = response.data
        })
        .catch((error) => {
          if (error.response) {
            let status = error.response.status
            if (status >= 500) {
              ElMessage({
                message: 'Server error',
                type: 'error'
              })
            } else if (status === 400 && error.response.data.code === 20) {
              ElMessage({
                message: 'Login credentials expired',
                type: 'warning'
              })
              setTimeout(() => {
                this.$router.push({name: 'login'})
              }, 1000)
            } else {
              ElMessage({
                message: 'Fail: unknown error',
                type: 'error'
              })
            }
          }
        })
  }

}
</script>

<style scoped>

#header {
  background-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-base);
  z-index: 100;
}


@media (min-width: 550px) {
  #main-card {
    margin: 0 auto;
    width: 50%;
    min-width: 500px;
  }
}

</style>