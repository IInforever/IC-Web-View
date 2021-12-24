<template>
  <div>
    <h1>Hello, ICB</h1>
    <p>
      <router-link :to="{ name: 'login' }">Login</router-link>
      <br/>
      <router-link :to="{ name: 'register' }">Register</router-link>
      <br/>
      <router-link :to="{ name: 'login', query: {scope:'admin'}}">Admin Login</router-link>
    </p>
    <el-link>hover</el-link>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>