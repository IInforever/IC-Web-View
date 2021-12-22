<template>
  <el-container>
    <el-header>
      <el-page-header id="header" title="Back" content="Login"></el-page-header>
    </el-header>
    <el-main>
      <el-form id="login-form" ref="loginForm" :rules="rules" :model="postForm" :label-position="isLarge?'':'top'">
        <h1>Login</h1>
        <div class="line"></div>
        <el-form-item label="Username" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <div class="placeholder"></div>
        <el-form-item label="Password" prop="passwd">
          <el-input v-model="postForm.passwd" type="password"></el-input>
        </el-form-item>
        <el-button @click="submit" type="primary">submit</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>

const rules = {
  name: [
    {
      required: true,
      message: 'Please input username',
      trigger: 'blur',
    },
    {
      min: 4,
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
      isLarge: document.documentElement.clientWidth > 650,
    }
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios.post("/api/login", this.$data.postForm)
              .then((response) => {
                console.log(response)
              })
              .catch((error) => {
                if (error.response) {
                  let status = error.response.status
                  if (status === 404) {
                    ElMessage({
                      message: 'Login fail: username or password error',
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
      this.isLarge = document.documentElement.clientWidth > 650;
    })
  }
}
</script>

<style scoped>

#login-form {
  margin: 0 auto;
}

@media (min-width: 650px) {
  #login-form {
    box-shadow: var(--el-box-shadow-base);
    border: 1px solid var(--el-border-color-base);
    border-radius: var(--el-border-radius-base);
    width: 50%;
    min-width: 500px;
    max-width: 700px;
    padding: 20px 40px;
  }
  #header {
    width: 50%;
    min-width: 580px;
    max-width: 720px;
    margin: 0 auto;
  }
}

@media (max-width: 650px) {
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