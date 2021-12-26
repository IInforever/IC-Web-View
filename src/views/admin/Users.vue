<template>
  <div>
    <transition name="fade" mode="out-in">
      <el-skeleton v-if="isLoading"></el-skeleton>
      <el-table v-else :data="userData" :stripe="true" :border="true" :height="tableHeight">
        <el-table-column prop="id" label="ID" width="100"/>
        <el-table-column prop="name" label="Username" width="150"/>
        <el-table-column prop="email" label="Email"/>
        <el-table-column prop="passwd" label="Password"/>
        <el-table-column prop="lastLoginTime" label="Last Login Time"/>
      </el-table>
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
      userData: []
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
          console.log(error.response)
        })

  },
  unmounted() {
    window.removeEventListener("resize", this.onResize)
  }
}
</script>

<style scoped>

</style>