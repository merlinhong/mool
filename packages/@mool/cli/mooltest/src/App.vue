<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component, route }">
    <keep-alive>
      <component
        :is="Component"
        :key="route.path"
        v-if="route.meta.keepAlive"
      />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" />
  </RouterView>
</template>

<style scoped>

</style>
