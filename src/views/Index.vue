<!--
  - Copyright (c) IInfo 2022 All rights reserved.
  -->

<template>
  <BasicFramework :auth="auth"
                  :loading="loading"
                  title="Hello, IClipboard"
                  @logout="logout">
    <el-form ref="input" :model="postForm" :rules="rules" :status-icon="false" style="text-align: left">
      <el-form-item prop="content">
        <el-input v-model="postForm.content" :autosize="{minRows:10, maxRows:30}" maxlength="5000"
                  placeholder="PUT TEXT HERE" resize="none"
                  show-word-limit type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Subject" label-width="80px" prop="title">
        <el-input v-model="postForm.title" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Type" label-width="80px" prop="type">
        <el-select v-model="postForm.type" placeholder="Type">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Expire" label-width="80px" prop="expireDuration">
        <el-select v-model="postForm.expireDuration">
          <el-option label="10min" value="600"></el-option>
          <el-option label="30min" value="1800"></el-option>
          <el-option label="1h" value="3600"></el-option>
          <el-option label="2h" value="3600"></el-option>
          <el-option label="5h" value="18000"></el-option>
          <el-option label="12h" value="43200"></el-option>
          <el-option label="1day" value="86400"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Password" label-width="80px" prop="passwd">
        <el-input v-model="postForm.passwd" :show-password="true" maxlength="32" type="password"></el-input>
      </el-form-item>

      <el-form-item label="Private" label-width="80px">
        <el-tooltip :disabled="auth === 0" content="login require" effect="light" placement="right">
          <el-switch v-model="isPrivate" :disabled="auth !== 0 || anonymous" active-color="#13ce66"
                     active-text="Y" inactive-text="N" inline-prompt></el-switch>
        </el-tooltip>
      </el-form-item>

      <el-form-item v-if="auth === 0" label="Anonymous" label-width="80px">
        <el-switch v-model="anonymous" :disabled="auth !== 0" active-color="#13ce66"
                   active-text="Y" inactive-text="N" inline-prompt @click="isPrivate = false"></el-switch>
      </el-form-item>

      <vue-recaptcha ref="recaptcha" :recaptchaHost="RECAPTCHA_HOST" :sitekey="SITE_KEY" size="invisible"
                     @error="onError" @expred="onExpired" @render="onRender" @verify="onVerify"></vue-recaptcha>

      <el-form-item style="text-align: center">
        <el-button :loading="isLoading" type="primary" @click="create">Create</el-button>
      </el-form-item>
    </el-form>
  </BasicFramework>
</template>

<script>
import {CheckSession, UpdateToken} from "../lib/auth-util";
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  data() {
    return {
      auth: CheckSession(),
      postForm: {
        content: '',
        type: 'raw',
        passwd: '',
        expireDuration: '600',
        title: '',
      },
      isPrivate: false,
      anonymous: CheckSession() !== 0,
      loading: true,
      isLoading: false,
      isRecaptchaExpired: true,
      recaptchaResponse: '',
    }
  },
  methods: {
    logout() {
      this.auth = -1
      this.isPrivate = false
      this.anonymous = true
      ElMessage({
        message: 'logged out',
        type: 'success',
      })
    },
    create() {
      this.$refs.input.validate((valid) => {
        if (valid) {

          if (this.isRecaptchaExpired) {
            this.$refs.recaptcha.execute()
            return
          }
          this.isLoading = true

          let url, headers
          if (this.anonymous) {
            url = "/api/pastes/anonymous"
            headers = {
              "Recaptcha-Token": this.recaptchaResponse,
            }
          } else {
            url = "/api/pastes"
            headers = {
              "Recaptcha-Token": this.recaptchaResponse,
              "Authorization": localStorage.getItem("auth-token")
            }
          }

          // remove blank
          let data = {}
          for (const key in this.postForm) {
            if (this.postForm[key] !== "")
              data[key] = this.postForm[key]
          }
          if (!this.anonymous && this.auth === 0)
            data.isPrivate = this.isPrivate


          axios.post(url, data, {
            headers: headers
          })
              .then((response) => {
                UpdateToken(response)
                let id = response.data.id.toString(36)
                ElMessage({
                  message: 'Create success, ID: ' + id,
                  type: "success"
                })
                setTimeout(() => {
                  this.$router.push({name: 'pastes', params: {'id': id}})
                })
              })
              .catch((error) => {
                setTimeout(() => {
                  this.recaptchaReset()
                  this.isLoading = false
                }, 1000)
                if (error.response) {
                  let status = error.response.status
                  if (status === 400) {
                    if (error.response.data['code'] >= 23 && error.response.data['code'] <= 25)
                      ElMessage({
                        message: 'Recaptcha validation fail',
                        type: 'error'
                      })
                    else
                      ElMessage({
                        message: 'Bad request, please refresh page',
                        type: 'error'
                      })
                  } else if (status >= 500) {
                    ElMessage({
                      message: 'Server error',
                      type: 'error'
                    })
                  } else {
                    ElMessage({
                      message: 'Unknown error',
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
            type: 'warning'
          })
        }
      })
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
      this.create()
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
      this.isLoading = false
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.loading)
        ElMessage({
          message: 'Error: Fail to load recaptcha components',
          type: 'error'
        })
    }, 5000)
  },
}
</script>

<script setup>
import {SITE_KEY, RECAPTCHA_HOST} from "../config/config";
import {VueRecaptcha} from "vue-recaptcha";
import {CheckSession} from "../lib/auth-util";
import BasicFramework from "../components/BasicFramework.vue";

const rules = {
  content: {
    required: true,
    message: 'Please input text',
    trigger: 'blur',
  },
  type: {
    required: true,
    message: 'Please select type',
  },
  expireDuration: {
    required: true,
    message: 'Please select expire time',
  },
  passwd: {
    min: 4,
    max: 32,
    message: 'Length should be 4 to 32',
    trigger: 'blur',
  },
  title: {
    max: 20,
    message: 'Subject length should be less than 20',
    trigger: 'blur',
  }
}

const typeOptions = [
  {
    value: 'raw',
    label: 'Plain Text'
  },
  {
    value: 'md',
    label: 'Markdown'
  },
  {
    value: 'yaml',
    label: 'YAML',
  },
  {
    value: 'c',
    label: 'C'
  },
  {
    value: 'cxx',
    label: 'C++'
  },
  {
    value: 'java',
    label: 'Java'
  },
  {
    value: 'js',
    label: 'JavaScript',
  },
  {
    value: 'json',
    label: 'JSON',
  },
  {
    value: 'html',
    label: 'HTML',
  },
  {
    value: 'css',
    label: 'CSS',
  },
  {
    value: 'bash',
    label: 'Bash',
  },
]
</script>

<style scoped>

</style>