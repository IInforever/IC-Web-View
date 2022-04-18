<!--
  - Copyright (c) IInfo 2022 All rights reserved.
  -->

<template>
  <BasicFramework :auth="auth" :title="paste.title" @logout="logout">
    <el-skeleton v-if="loading" :rows="10" animated></el-skeleton>
    <div v-else>
      <div v-if="passwordRequired">
        <el-form ref="formRef" :model="form" :rules="rules">
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="form.password"
              placeholder="Input Password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            :loading="submitLoading"
            type="primary"
            @click="getWithPassword"
            >submit</el-button
          >
        </el-form>
      </div>
      <div v-else>
        <el-descriptions :column="large ? 2 : 1" border size="small">
          <el-descriptions-item>
            <template #label>
              <div>
                <el-icon>
                  <Link />
                </el-icon>
                ID
              </div>
            </template>
            <el-link
              :data-clipboard-text="id"
              class="copy"
              @click="copyContent"
              >{{ id }}</el-link
            >
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>
                <el-icon>
                  <UserFilled />
                </el-icon>
                User
              </div>
            </template>
            {{ paste.username }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>
                <el-icon>
                  <Calendar />
                </el-icon>
                Creation time
              </div>
            </template>
            {{ paste.createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>
                <el-icon>
                  <Calendar />
                </el-icon>
                Expiration time
              </div>
            </template>
            {{ paste.expireTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>
                <el-icon>
                  <Operation />
                </el-icon>
                Metadata
              </div>
            </template>
            <el-tag class="meta-tags" size="small" type="info">{{
              paste.type
            }}</el-tag>
            <el-tag class="meta-tags" size="small">{{
              paste.isPrivate ? "private" : "public"
            }}</el-tag>
            <el-tag
              v-if="paste.hasPasswd"
              class="meta-tags"
              size="small"
              type="success"
            >
              <el-icon>
                <Lock />
              </el-icon>
              password
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <h3 style="margin-top: 20px">Content</h3>
        <el-button
          class="copy"
          data-clipboard-target="#content"
          size="small"
          style="float: right"
          @click="copyContent"
        >
          Copy
        </el-button>
        <el-input
          id="content"
          ref="content"
          v-model="paste.content"
          :autosize="true"
          readonly
          resize="none"
          style="margin-top: 20px"
          type="textarea"
        ></el-input>
      </div>
    </div>
  </BasicFramework>
</template>

<script setup>
import { ref } from "vue";
import {
  Calendar,
  Link,
  Lock,
  Operation,
  UserFilled,
} from "@element-plus/icons-vue";

const rules = {
  password: {
    required: true,
    trigger: "blur",
  },
};

const formRef = ref(null);
</script>

<script>
import BasicFramework from "../components/BasicFramework.vue";
import { CheckSession, RemoveTokens, UpdateToken } from "../utility/auth";
import { ElMessage } from "element-plus";
import axios from "axios";
import Clipboard from "clipboard";

function errorHandler(error) {
  if (error.response) {
    let status = error.response.status;
    if (status === 400) {
      ElMessage({
        message: "Bad request, please refresh page",
        type: "error",
      });
      return false;
    } else if (status >= 500) {
      ElMessage({
        message: "Server error",
        type: "error",
      });
      return false;
    }
  } else if (error.request) {
    ElMessage({
      message: "Error:" + error.message,
      type: "error",
    });
    return false;
  } else {
    console.log(error);
    return false;
  }
  return true;
}

export default {
  name: "paste",
  components: { BasicFramework },
  data() {
    return {
      auth: CheckSession(),
      large: document.documentElement.clientWidth > 640,
      loading: true,
      passwordRequired: false,
      form: {
        password: "",
      },
      submitLoading: false,
      id: 1,
      paste: { title: "Untitled", username: "Anonymous User" },
    };
  },
  methods: {
    logout() {
      this.auth = -1;
      this.isPrivate = false;
      this.anonymous = true;
      ElMessage({
        message: "logged out",
        type: "success",
      });
    },
    getWithPassword() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          axios
            .get("/api/pastes/" + parseInt(this.id, 36), {
              params: {
                passwd: this.form.password,
              },
            })
            .then((response) => {
              this.passwordRequired = false;
              this.submitLoading = false;
              for (const key in response.data) {
                this.paste[key] = response.data[key];
              }
              if (response.data.uid) this.getUsername(response.data.uid);
            })
            .catch((error) => {
              if (errorHandler(error)) {
                if (error.response.status === 404) {
                  ElMessage({
                    message: "Not found",
                    type: "warning",
                  });
                  setTimeout(() => {
                    this.$router.push({
                      name: "notfound",
                      params: { pathMatch: 404 },
                    });
                  }, 1000);
                } else if (error.response.status === 401) {
                  ElMessage({
                    message: "No access",
                    type: "warning",
                  });
                } else if (error.response.status === 403) {
                  this.submitLoading = false;
                  ElMessage({
                    message: "Password error",
                    type: "warning",
                  });
                } else {
                  ElMessage({
                    message: "Unknown error",
                    type: "warning",
                  });
                }
              }
            });
        }
      });
    },
    getUsername(uid) {
      axios
        .get("/api/users/" + uid)
        .then((response) => {
          this.paste.username = response.data.name;
        })
        .catch((error) => {
          if (errorHandler(error) && error.response.status === 404) {
            this.paste.username = "Delete user";
          }
        });
    },
    copyContent() {
      let clipboard = new Clipboard(".copy");
      clipboard.on("success", function (e) {
        ElMessage({
          message: "Copied!",
          type: "success",
        });
        e.clearSelection();
        clipboard.destroy();
      });
      clipboard.on("error", function (e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
        clipboard.destroy();
      });
    },
    onResize() {
      this.large = document.documentElement.clientWidth > 640;
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    let id = parseInt(this.$route.params.id, 36);
    if (id <= 0 || id > 0xffffffff) {
      this.$router.push({ name: "notfound", params: { pathMatch: "404" } });
      return;
    }
    this.id = id.toString(36);
    let config;
    if (this.auth === 0) {
      config = {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      };
    }
    axios
      .get("/api/pastes/" + id, config)
      .then((response) => {
        UpdateToken(response);
        this.loading = false;
        for (const key in response.data) {
          this.paste[key] = response.data[key];
        }
        if (response.data.uid) this.getUsername(response.data.uid);
      })
      .catch((error) => {
        if (errorHandler(error)) {
          if (error.response.status === 404) {
            ElMessage({
              message: "Not found",
              type: "warning",
            });
            setTimeout(() => {
              this.$router.push({
                name: "notfound",
                params: { pathMatch: 404 },
              });
            }, 1000);
          } else if (error.response.status === 401) {
            ElMessage({
              message: "No access",
              type: "warning",
            });
          } else if (error.response.status === 403) {
            this.passwordRequired = true;
            this.loading = false;
            ElMessage({
              message: "Password required",
              type: "info",
            });
          } else {
            ElMessage({
              message: "Unknown error",
              type: "warning",
            });
          }
        }
      });
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped>
.meta-tags {
  margin: 0 5px;
}
</style>
