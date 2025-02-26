<template>
    <div class="home">
      <h1>Welcome to MoolJs</h1>
      <div class="img">
        <img src="@/assets/mooljs.png" alt="" class="mooljs" />
        <img src="@/assets/vue.png" alt="" class="vue" />
      </div>
    </div>
  </template>
  <script setup lang="ts"></script>
  <style scoped>
  .home {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: auto;
    width: 50vw;
    height: 50vh;
  }
  h1 {
    font-size: 3em;
    color: #42b983;
  }
  .img {
    display: flex;
    justify-content: center;
  }
  .mooljs,
  .vue {
    width: 200px;
    height: 200px;
    margin-top: 20px;
  }
  </style>
  