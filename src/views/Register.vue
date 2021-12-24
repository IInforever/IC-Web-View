<template>
  <div>
    <el-container>
      <el-header id="auth-header">
        <el-page-header id="auth-page-header" content="Register" title="Back"
                        @back="this.$router.back()"></el-page-header>
      </el-header>
      <el-main>
        <el-form id="auth-form" ref="registerForm" :disabled="isDisabled" :label-position="isLarge?'':'top'" :model="postForm"
                 :rules="rules" label-width="100px">
          <h1>Register</h1>
          <div class="line"></div>
          <el-form-item label="Username" prop="name">
            <el-input v-model="postForm.name"></el-input>
          </el-form-item>
          <div v-if="isLarge" class="placeholder"></div>
          <el-form-item label="Email" prop="email">
            <el-input v-model="postForm.email"></el-input>
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
import {Right} from "@element-plus/icons-vue";
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
  ],
  email: [
    {
      required: true,
      message: 'Please input email',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Invalid email',
      trigger: 'blur'
    }
  ]
}
</script>
<script>
import {ElMessage} from "element-plus";
import axios from "axios";
import {CheckSession} from "../lib/auth-util";

export default {
  name: "Register",
  data() {
    return {
      isLarge: document.documentElement.clientWidth > 550,
      isLoading: false,
      postForm: {
        name: '',
        email: '',
        passwd: '',
      },
      isDisabled: false
    }
  },
  methods: {
    submit() {
      // console.log(this.postForm)
      this.$refs.registerForm.validate((valid) => {
            if (valid) {
              // start loading
              let timer = setTimeout(() => {
                this.isLoading = true
              }, 300)
              axios.post("/api/register", this.$data.postForm)
                  .then((response) => {
                    clearTimeout(timer)
                    this.isLoading = false
                    this.isDisabled = true
                    ElMessage({
                      message: 'Success',
                      type: 'success'
                    })
                    setTimeout(() => {
                      this.$router.push({name: 'index'})
                    }, 2000)
                  })
                  .catch((error) => {
                        clearTimeout(timer)
                        this.isLoading = false
                        if (error.response) {
                          let status = error.response.status
                          if (status === 400 && error.response.data['code'] === 21) {
                            ElMessage({
                              message: 'Register fail: username or email is already taken',
                              type: 'error'
                            })
                          } else if (status >= 500) {
                            ElMessage({
                              message: 'Register fail: server error',
                              type: 'error'
                            })
                          } else {
                            ElMessage({
                              message: 'Register fail: unknown error',
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
                      }
                  )
            } else {
              ElMessage({
                message: 'Invalid inputs',
                type: 'warning'
              })
            }
          }
      )
    },
  },
  mounted() {
    if (CheckSession() != -1) {
      this.isDisabled = true
      ElMessage({
        message: "Already logged in",
        type: "warning"
      })
      setTimeout(() => {
        this.$router.push({name: 'index'})
      }, 2000)
    }
    window.addEventListener("resize", () => {
      this.isLarge = document.documentElement.clientWidth > 550;
    })
  }
}
</script>

<style scoped>

</style>