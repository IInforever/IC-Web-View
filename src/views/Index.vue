<template>
  <div>
    <h1 id="title">Hello, ICB</h1>
    <p>
      <router-link :to="{ name: 'home' }">Home</router-link>
      <br/>
      <router-link :to="{ name: 'login' }">Login</router-link>
      <br/>
      <router-link :to="{ name: 'register' }">Register</router-link>
      <br/>
      <router-link :to="{ name: 'login', query: {scope:'admin'}}">Admin Login</router-link>
      <br/>
      <el-link @click="logout">logout</el-link>
    </p>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Footer from "../components/Footer.vue";</script>

<script>
import {ElMessage} from "element-plus";

export default {
  methods: {
    logout() {
      sessionStorage.removeItem("auth-token")
      sessionStorage.removeItem("admin-token")
      ElMessage("Logged out")
    }
  }
}
</script>

<style scoped>
#title {
  margin: 60px 20px 20px;
}
</style>