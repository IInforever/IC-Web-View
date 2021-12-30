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
            <div v-if="auth===-1">
              <el-button class="header-button" size="small" type="primary" @click="$router.push({name:'login'})">
                Login
              </el-button>
              <el-button class="header-button" size="small"
                         @click="$router.push({name:'register'})">
                Sign up
              </el-button>
            </div>
            <div v-else>
              <el-button-group>
                <el-button class="header-button" size="small" type="primary"
                           @click="$router.push(auth===0?{name:'home'}:{name:'admin-index'})">
                  {{ auth === 0 ? 'Home' : 'Panel' }}
                </el-button>
                <el-button class="header-button" size="small" type="primary"
                           @click="logout">
                  Logout
                </el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div id="placeholder">
          <el-card id="main">
            <h1 id="title">Hello, ICB</h1>
            <el-divider></el-divider>
            <el-form ref="input" :model="postForm" :rules="rules" style="text-align: left">
              <el-form-item prop="text">
                <el-input v-model="postForm.text" :autosize="{minRows:10, maxRows:30}" maxlength="5000"
                          placeholder="PUT TEXT HERE" resize="none"
                          show-word-limit type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="Subject" label-width="70px" prop="subject">
                <el-input v-model="postForm.subject" maxlength="20" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="Type" label-width="70px" prop="type">
                <el-select v-model="postForm.type" placeholder="Type">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Expire" label-width="70px" prop="time">
                <el-select v-model="postForm.time">
                  <el-option label="10min" value="600"></el-option>
                  <el-option label="30min" value="1800"></el-option>
                  <el-option label="1h" value="3600"></el-option>
                  <el-option label="2h" value="3600"></el-option>
                  <el-option label="5h" value="18000"></el-option>
                  <el-option label="12h" value="43200"></el-option>
                  <el-option label="1day" value="86400"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Private" label-width="70px">
                <el-tooltip :disabled="auth === 0" content="login require" effect="light" placement="right">
                  <el-switch v-model="private" :disabled="auth !== 0" active-color="#13ce66"
                             active-text="Y" inactive-text="N" inline-prompt></el-switch>
                </el-tooltip>
              </el-form-item>
              <el-form-item label-width="70px" label="Password" prop="passwd">
                <el-input v-model="postForm.passwd" type="password" maxlength="32"></el-input>
              </el-form-item>
              <el-form-item style="text-align: center">
                <el-button type="primary" @click="create">Create</el-button>
              </el-form-item>
            </el-form>
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
import {CheckSession} from "../lib/auth-util";

const rules = {
  text: {
    required: true,
    message: 'Please input text',
    trigger: 'blur',
  },
  type: {
    required: true,
    message: 'Please select type',
  },
  time: {
    required: true,
    message: 'Please select expire time',
  },
  passwd: {
    min: 4,
    max: 32,
    message: 'Length should be 4 to 32',
    trigger: 'blur',
  },
  subject: {
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

<script>
import {CheckSession, RemoveTokens} from "../lib/auth-util";
import {ElMessage} from "element-plus";

export default {
  methods: {
    logout() {
      RemoveTokens()
      this.auth = -1
      this.private = false
      ElMessage({
        message: 'logged out',
        type: 'success',
      })
    },
    create() {
      this.$refs.input.validate((valid) => {
        if (valid) {
          ElMessage("success")
        } else {
          ElMessage({
            message: 'Invalid inputs',
            type: 'warning'
          })
        }
      })
    }
  },
  data() {
    return {
      auth: CheckSession(),
      postForm: {
        text: '',
        type: 'raw',
        passwd: '',
        time: '600',
        subject: '',
      },
      private: false,
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
}

@media (min-width: 600px) {
  #main {
    width: 50%;
    min-width: 550px;
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