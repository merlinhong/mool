<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      margin: auto;
      width: 50vw;
      height: 60vh;
      text-align: center;
    "
  >
    <NoPermision style="width: 100%;"/>
    <span>抱歉，您没有权限访问!</span>
  </div>
</template>

<script setup>
import NoPermision from "@/assets/403.svg";
</script>

<style lang="scss" scoped></style>
