<template>
  <div class="home">
    <h1>Welcome to MoolJs</h1>
    <div class="img">
      <img src="@/assets/mooljs.png" alt="" class="mooljs" />
      <img src="@/assets/vue.png" alt="" class="vue" />
    </div>

    <VIPGuard>
      <div class="flex">
        <el-card class="w-[20%] h-[200px]"
          ><span class="text-red-400" v-if="!isVip">vip</span>书籍1</el-card
        >
        <el-card class="w-[20%] h-[200px]"
          ><span class="text-red-400" v-if="!isVip">vip</span>书籍2</el-card
        >
        <el-card class="w-[20%] h-[200px]"
          ><span class="text-red-400" v-if="!isVip">vip</span>书籍1</el-card
        >
        <el-card class="w-[20%] h-[200px]"
          ><span class="text-red-400" v-if="!isVip">vip</span>书籍1</el-card
        >
      </div>
    </VIPGuard>
  </div>
</template>
<script setup lang="tsx">
import { createVIPGuard } from "@/components/member.tsx";
import { useStore } from "mooljs";
const { vipStatu } = useStore("vip");
const router = useRouter();
const isVip = ref(false);

const VIPGuard = createVIPGuard({
  refreshInterval: 60_000,
  loading: () => <div>正在获取会员状态...</div>,
  update: (vipStatus) => {
    isVip.value = vipStatus.isVip;
  },
  go(arg: any) {
    return router.push("./openVip");
  },
});
onMounted(()=>{
  isVip.value = vipStatu.value.isVip
})
</script>
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
