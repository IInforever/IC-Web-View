<template>
  <div>
    <transition name="fade" mode="out-in">
      <el-skeleton v-if="isLoading" animated></el-skeleton>
      <div v-else>
        <el-empty v-if="empty"></el-empty>
        <el-table v-else :data="userData" :stripe="true" :border="true" :height="tableHeight" fit>
          <el-table-column prop="id" label="ID" width="100"/>
          <el-table-column prop="name" label="Username" width="150"/>
          <el-table-column prop="email" label="Email"/>
          <el-table-column prop="passwd" label="Password"/>
          <el-table-column prop="lastLoginTime" label="Last Login Time"/>
          <el-table-column fixed="right" label="Operations" width="160">
            <template #default="scope">
              <el-button size="small">
                edit
              </el-button>
              <el-button size="small">
                delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import {CheckSession, UpdateToken} from "../../lib/auth-util";
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  name: "Users",
  data() {
    return {
      tableHeight: window.innerHeight - 160,
      isLoading: true,
      userData: [],
      empty: false,
    }
  },
  methods: {
    onResize() {
      this.tableHeight = window.innerHeight - 160;
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize)
    let auth = CheckSession()
    if (auth !== 1) {
      ElMessage({
        message: 'Admin Authorization required',
        type: 'warning'
      })
      return
    }
    axios.get("/api/users", {
      headers: {
        Authorization: sessionStorage.getItem("admin-token")
      }
    })
        .then((response) => {
          UpdateToken(response)
          this.userData = response.data
          this.isLoading = false
        })
        .catch((error) => {
          if (error.response) {
            UpdateToken(error.response)
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
                this.$router.push({name: 'login', query: {scope: 'admin'}})
              }, 1000)
            }else if (status === 404 ){
              this.empty = true
            } else {
              ElMessage({
                message: 'Fail: unknown error',
                type: 'error'
              })
            }
          }
          this.isLoading = false
        })

  },
  unmounted() {
    window.removeEventListener("resize", this.onResize)
  }
}
</script>

<style scoped>

</style>