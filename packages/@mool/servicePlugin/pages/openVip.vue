<template>
  <div>在这里你可以开通会员</div>
  <el-button @click="open" v-if="!isvip">开通</el-button>
  <div v-else>你现在已经是会员了</div>
</template>

<script setup lang="ts">
import { useStore } from "mooljs";
const isvip = ref(false);
const { vipStatu, checkVip } = useStore("vip");
const setVip = () => {
  isvip.value = vipStatu.value.isVip;
};
const open = async () => {
  await checkVip(true);
  setVip();
};
onMounted(() => {
  setVip();
});
</script>

<style></style>
