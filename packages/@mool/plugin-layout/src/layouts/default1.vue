<template>
  <!-- <div>
        欢迎来到mooljs
    </div> -->
  <Menu :menuData="model" />
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import Menu from "./menu.vue";
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
          component: "/src/pages/form/senior.vue",
          meta: {
            title: "高级表单",
          },
        },
      ],
    },
    {
      path: "/user",
      component: "/src/pages/user/index.vue",
      meta: {
        title: "用户中心",
        icon: "pi pi-user",
      },
    },
  ],
  {},
  {}
).menuData.value;
</script>

<style></style>
