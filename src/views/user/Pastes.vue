<!--
  - Copyright (c) IInfo 2022 All rights reserved.
  -->

<template>
  <div>
    <el-skeleton v-if="isLoading"></el-skeleton>
    <el-table v-else :data="pastes">
      <el-table-column label="ID" prop="id">
        <template #default="scope">
          <a :href="'/p/' + Number(scope.row.id).toString(36)">
            {{ Number(scope.row.id).toString(36) }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="title" prop="title"/>
      <el-table-column label="type" prop="type"/>
      <el-table-column label="create time" prop="createTime"/>
      <el-table-column label="expire time" prop="expireTime"/>
      <el-table-column label="metadata">
        <template #default="scope">
          <el-tag class="meta-tags" size="small">{{ scope.row.isPrivate ? "private" : "public" }}</el-tag>
          <el-tag v-if="scope.row.hasPasswd" class="meta-tags" size="small" type="success">
            <el-icon>
              <Lock/>
            </el-icon>
          </el-tag>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script setup>
import {Lock} from "@element-plus/icons-vue";</script>

<script>
import axios from "axios";
import {CheckSession} from "../../lib/auth-util";
import {ElMessage} from "element-plus";

export default {
  name: "Manage",
  data() {
    return {
      isLoading: true,
      pastes: []
    }
  },
  mounted() {
    let auth = CheckSession();
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

    axios.get("/api/pastes", {
      headers: {
        Authorization: localStorage.getItem("auth-token")
      }
    })
        .then((response) => {
          this.isLoading = false
          this.pastes = response.data
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