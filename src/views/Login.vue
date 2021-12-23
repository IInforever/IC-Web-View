<template>
  <el-container>
    <el-header>
      <el-page-header id="header" title="Back" content="Login" @back="this.$router.back()"></el-page-header>
    </el-header>
    <el-main>
      <el-form id="login-form" ref="loginForm" :rules="rules" :model="postForm" :label-position="isLarge?'':'top'">
        <h1><span v-if="authScope==='admin'">Admin </span>Login</h1>
        <div class="line"></div>
        <el-form-item label="Username" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <div class="placeholder"></div>
        <el-form-item label="Password" prop="passwd">
          <el-input v-model="postForm.passwd" type="password"></el-input>
        </el-form-item>
        <el-button @click="submit" type="primary" :loading="isLoading">
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
</template>

<script setup>
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
    }
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate((valid) => {
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
                clearTimeout(time)
                this.isLoading = false
                // console.log(response)
                if (response.headers.authorization) {
                  let token = response.headers.authorization
                  // console.log(DecodeJWT(token))
                  window.sessionStorage.setItem("auth-token", token)
                  ElMessage({
                    message: 'Login success',
                    type: 'success'
                  })
                } else {
                  ElMessage({
                    message: 'Error: no specified response',
                    type: 'error'
                  })
                }
              })
              .catch((error) => {
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
                      message: 'Login fail: unknown response',
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
    window.addEventListener("resize", () => {
      this.isLarge = document.documentElement.clientWidth > 550;
    })
  }
}
</script>

<style scoped>

#login-form {
  margin: 0 auto;
}

@media (min-width: 550px) {
  #login-form {
    box-shadow: var(--el-box-shadow-base);
    border: 1px solid var(--el-border-color-base);
    border-radius: var(--el-border-radius-base);
    width: 50%;
    min-width: 400px;
    max-width: 500px;
    padding: 20px 40px;
  }

  #header {
    width: 50%;
    min-width: 400px;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 550px) {
  #login-form {
    width: 95%;
  }
}

.line {
  border-top: 1px dashed var(--el-border-color-base);
  margin-bottom: 20px;
}

.placeholder {
  height: 20px;
}
</style>