<template>
  <div>
    <el-container>
      <el-header id="auth-header">
        <el-page-header id="auth-page-header" content="Login" title="Back" @back="this.$router.back()"></el-page-header>
      </el-header>
      <el-main>
        <el-form id="auth-form" ref="loginForm" :disabled="isDisabled" :label-position="isLarge?'':'top'"
                 :model="postForm"
                 :rules="rules" label-width="100px">
          <h1><span v-if="authScope==='admin'">Admin </span>Login</h1>
          <div class="line"></div>
          <el-form-item label="Username" prop="name">
            <el-input v-model="postForm.name"></el-input>
          </el-form-item>
          <div v-if="isLarge" class="placeholder"></div>
          <el-form-item label="Password" prop="passwd">
            <el-input v-model="postForm.passwd" type="password"></el-input>
          </el-form-item>
          <div v-if="isLarge" class="placeholder"></div>
          <el-button :loading="isLoading" type="primary" @click="submit">
            Submit
            <el-icon class="el-icon-arrow-right">
              <Right/>
            </el-icon>
          </el-button>
        </el-form>
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import "../assets/auth-form.css"
import {Right} from "@element-plus/icons-vue"
import Footer from "../components/Footer.vue";

const rules = {
  name: [
    {
      required: true,
      message: 'Please input username',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 15,
      message: 'Length of username should between 4 to 15',
      trigger: 'blur'
    }
  ],
  passwd: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'blur'
    },
    {
      min: 4,
      max: 40,
      message: 'Length of password should between 4 to 40',
      trigger: 'blur'
    }
  ]
}

</script>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import {CheckSession} from "../lib/auth-util";

export default {
  data() {
    return {
      postForm: {
        name: '',
        passwd: '',
      },
      isLarge: document.documentElement.clientWidth > 550,
      isLoading: false,
      authScope: this.$route.query.scope,
      isDisabled: false
    }
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate((valid) => {
        // check inputs
        if (valid) {
          let time = setTimeout(() => {
            this.isLoading = true
          }, 300)
          let url
          if (this.authScope === 'admin')
            url = "/api/admin/login"
          else
            url = "/api/login"
          axios.post(url, this.$data.postForm)
              .then((response) => {
                // success
                clearTimeout(time)
                this.isLoading = false
                if (response.headers.authorization) {
                  let token = response.headers.authorization
                  this.isDisabled = true
                  if (this.authScope === "admin") {
                    window.sessionStorage.setItem("admin-token", token)
                  } else {
                    window.sessionStorage.setItem("auth-token", token)
                  }
                  ElMessage({
                    message: 'Login success',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.$router.push({name: 'index'})
                  }, 1000)
                } else {
                  ElMessage({
                    message: 'Error: no specified response',
                    type: 'error'
                  })
                }
              })
              .catch((error) => {
                // error
                clearTimeout(time)
                this.isLoading = false
                if (error.response) {
                  let status = error.response.status
                  if (status === 404 || status === 403) {
                    ElMessage({
                      message: 'Login fail: username or password error',
                      type: 'error'
                    })
                  } else if (status >= 500) {
                    ElMessage({
                      message: 'Login fail: server error',
                      type: 'error'
                    })
                  } else {
                    ElMessage({
                      message: 'Login fail: unknown error',
                      type: 'error'
                    })
                  }
                } else if (error.request) {
                  ElMessage({
                    message: 'Error:' + error.message,
                    type: "error"
                  })
                } else {
                  console.log(error)
                }
              })

        } else {
          ElMessage({
            message: 'Invalid inputs',
            type: "warning"
          })
        }
      })
    }
  },
  mounted() {
    let auth = CheckSession();
    if (auth === 0) {
      this.isDisabled = true
      ElMessage({
        message: "Already logged in",
        type: "warning"
      })
      setTimeout(() => {
        this.$router.push({name: 'home'})
      }, 1000)
    } else if (auth === 1) {
      this.isDisabled = true
      ElMessage({
        message: "Already logged in as Administrator",
        type: "warning"
      })
      setTimeout(() => {
        this.$router.push({name: 'index'})
      }, 1000)
    }
    window.addEventListener("resize", () => {
      this.isLarge = document.documentElement.clientWidth > 550;
    })
  }
}
</script>

<style scoped>

</style>