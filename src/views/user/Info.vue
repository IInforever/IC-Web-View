<!--
  - Copyright (c) IInfo 2022.
  -->

<template>
  <div>
    <el-skeleton v-if="isLoading"/>
    <el-card v-if="!isLoading" id="main-card">
      <h2>
        Hello, <span style="text-decoration: underline;font-weight: bold">{{ user.name }}</span>
      </h2>
      <el-descriptions
          :column="1"
          border
          title="User info">
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
              <Timer/>
            </el-icon>
            Create time
          </template>
          <p>{{ user.createTime }}</p>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import {Key, Message, Timer, User} from "@element-plus/icons-vue";</script>

<script>
import axios from "axios";
import {CheckSession, UpdateToken} from "../../utility/auth";
import {ElMessage} from "element-plus";

export default {
  name: "Info",
  data() {
    return {
      user: {createTime: null},
      isLoading: true,
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

    axios.get("/api/users", {
      headers: {
        Authorization: localStorage.getItem('auth-token')
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

</style>