<template>
  <div>
    <el-container>
      <el-header>
        <el-row justify="space-around" style="line-height: 60px">
          <el-col :span="6"></el-col>
          <el-col :span="6">
            <h1 style=";color: aliceblue">Home</h1>
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-dropdown @command="handleCommand">
              <span :style="{color: 'aliceblue',fontSize: 'var(--el-font-size-base)',fontWeight: 'bold'}"
                    class="el-dropdown-link">
              {{ user.name }}
                <el-icon class="el-icon--right" style="vertical-align: middle">
                  <arrow-down></arrow-down>
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
          Hello, {{ user.name }}
        </el-card>
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
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
        }, 2000)
      }
    }
  },
  mounted() {
    let auth = CheckSession()
    if (auth != 0) {
      ElMessage({
        message: 'Authorization required',
        type: 'warning'
      })
      setTimeout(() => {
        this.$router.push({name: 'index'})
      }, 2000)
      return
    }

    axios.get("/api/user", {
      headers: {
        Authorization: sessionStorage.getItem('auth-token')
      }
    })
        .then((response) => {
          this.isLoading = false
          // console.log(response)
          UpdateToken(response)
          this.user = response.data
        })
        .catch((error) => {
          // console.log(error.response)
          UpdateToken(error.response)
        })
  }

}
</script>

<style scoped>

.el-header {
  background-color: var(--el-color-primary);
  border-bottom: 2px solid var(--el-border-color-base);
}


@media (min-width: 550px) {
  #main-card {
    margin: 0 auto;
    width: 50%;
    min-width: 500px;
  }
}

</style>