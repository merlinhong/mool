<template>
  <!-- <div>
        欢迎来到mooljs
    </div> -->
  <ProLayout
    :menuData="model"
    :menuProps="{
      uniqueOpened: false,
    }"
    :collapsed="false"
  >
    <template #rightContentRender>
      <RightRender />
    </template>
    <template #footerContent>
      <FooterRender />
    </template>
    <template #headerContent>
      <HeaderRender />
    </template>
    <RouterView />
  </ProLayout>
</template>

<script setup lang="ts">
import ProLayout from "@/components/ProLayout.vue";
import { useMenuFromRoutes } from "./useMenu";
const model = ref();
model.value = useMenuFromRoutes(
  [
    {
      path: "/",
      component: "/src/pages/index.vue",
      meta: {
        title: "首页1",
        icon: "pi pi-user",
        menuRender: false,
      },
    },
    {
      path: "/admin",
      component: "/src/layouts/default.vue",
      meta: {
        title: "后台管理系统",
        hideInMenu: true,
      },
    },
    {
      path: "/form",
      meta: {
        title: "表单页",
        icon: "pi pi-user",
      },
      routes: [
        {
          path: "/form/senior",
          meta: {
            title: "高级表单",
            icon: "pi pi-user",
          },
        },
        {
          path: "/form/basic",
          component: "/src/pages/form/basic.vue",
          meta: {
            title: "分步表单",
            icon: "pi pi-user",
          },
        },
      ],
    },
  ],
  {},
  {}
).menuData.value;
</script>

<style></style>
