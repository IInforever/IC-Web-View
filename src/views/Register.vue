<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <div>
    <el-container>
      <el-header id="auth-header">
        <el-page-header id="auth-page-header" content="Register" title="Back"
                        @back="$router.push({name:'index'})"></el-page-header>
      </el-header>
      <el-main>
        <el-form id="auth-form" ref="registerForm" v-loading="loading" :disabled="isDisabled"
                 :label-position="isLarge?'':'top'" :model="postForm" :rules="rules" label-width="100px">
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
          <vue-recaptcha ref="recaptcha" :recaptchaHost="RECAPTCHA_HOST" :sitekey="SITE_KEY" size="invisible"
                         @error="onError" @expred="onExpired" @render="onRender" @verify="onVerify"></vue-recaptcha>
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
import {VueRecaptcha} from "vue-recaptcha";
import {RECAPTCHA_HOST, SITE_KEY} from "../config/config";

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
import {CheckSession} from "../utility/auth";

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
      isDisabled: false,
      loading: true,
      isRecaptchaExpired: true,
      recaptchaResponse: '',
    }
  },
  methods: {
    submit() {
      // console.log(this.postForm)
      this.$refs.registerForm.validate((valid) => {
            if (valid) {
              // start loading
              if (this.isRecaptchaExpired) {
                this.$refs.recaptcha.execute()
                return
              }
              this.isLoading = true
              axios.post("/api/register", this.$data.postForm, {
                headers: {
                  "Recaptcha-Token": this.recaptchaResponse
                }
              })
                  .then((response) => {
                    setTimeout(() => {
                      this.recaptchaReset()
                      this.isLoading = false
                    }, 1000)
                    this.isDisabled = true
                    ElMessage({
                      message: 'User registered',
                      type: 'success'
                    })
                    setTimeout(() => {
                      this.$router.push({name: 'login'})
                    }, 1000)
                  })
                  .catch((error) => {
                    setTimeout(() => {
                      this.recaptchaReset()
                      this.isLoading = false
                    }, 1000)
                    if (error.response) {
                      let status = error.response.status
                      if (status === 400) {
                        if (error.response.data['code'] === 21)
                          ElMessage({
                            message: 'Register fail: username or email is already taken',
                            type: 'error'
                          })
                        else if (error.response.data['code'] >= 23 && error.response.data['code'] <= 25)
                          ElMessage({
                            message: 'Register fail: Recaptcha validation fail',
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
    onResize() {
      this.isLarge = document.documentElement.clientWidth > 550;
    },
    recaptchaReset() {
      this.isRecaptchaExpired = true
      this.$refs.recaptcha.reset()
    },
    onRender(id) {
      this.loading = false
      console.log("[recaptcha] loaded. (" + id + ")")
    },
    onVerify(response) {
      this.recaptchaResponse = response
      this.isRecaptchaExpired = false
      this.submit()
    },
    onError() {
      ElMessage({
        message: "Recaptcha check fail",
        type: 'warning'
      })
      this.isLoading = false
    },
    onExpired() {
      this.isRecaptchaExpired = true
    }
  },
  mounted() {
    if (CheckSession() !== -1) {
      this.isDisabled = true
      ElMessage({
        message: "Already logged in",
        type: "warning"
      })
      setTimeout(() => {
        this.$router.push({name: 'index'})
      }, 1000)
    }
    window.addEventListener("resize", this.onResize)
    setTimeout(() => {
      if (this.loading)
        ElMessage({
          message: 'Error: Fail to load recaptcha components',
          type: 'error'
        })
    }, 5000)
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize)
  }
}
</script>

<style scoped>

</style>