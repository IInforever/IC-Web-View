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
    </p>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Footer from "../components/Footer.vue";
</script>

<style scoped>
#title {
  margin: 60px 20px 20px;
}
</style>