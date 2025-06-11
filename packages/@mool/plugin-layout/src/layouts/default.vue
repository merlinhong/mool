<template>
  <ProLayout
    :menuData="menuData"
    :menuProps="{
      uniqueOpened: false,
      copyright: '© 2025 Copyright by PrimeVue',
      ...layout,
    }"
    :collapsed="false"
  >
    <template #rightContentRender>
      <RightRender />
    </template>
    <template #headerContent>
      <HeaderRender />
    </template>
    <RouterView />
  </ProLayout>
</template>

<script setup lang="tsx">
import ProLayout from '../components/ProLayout/index.vue'
import * as Mool from "mooljs";
import { useMenuFromRoutes } from '../utils/useMenu';
import {ref} from 'vue';
const { useAccess, useLayout, useMenuRoutes } = Mool;
const layout = useLayout();
const routes = useMenuRoutes();
const access = useAccess?.() ?? null;
const { menuData } = useMenuFromRoutes(routes, {}, access);

const op = ref();
const timer = ref<null | number>(null);
const opts = ref([
  { name: "个人中心", code: "personCenter" },
  { name: "退出登录", code: "logout" },
]);
const show = (e?: Event) => {
  if (timer.value) {
    window.clearTimeout(timer.value);
    timer.value = null;
  }
  e && op.value.show(e);
};
const hide = () => {
  timer.value = window.setTimeout(() => {
    op.value.hide();
  }, 200);
};
const RightRender =
  layout.rightRender ??
  (() => {
    return (
      <div className="right-content">
        <div
          class="user-dropdown hover:bg-blue-50 p-2"
          onMouseenter={show}
          onMouseleave={hide}
        >
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            style="width: 32px; height: 32px;"
          />
          <span class="username">管理员</span>
        </div>
        <Popover ref={op} onMouseenter={() => show()} onMouseleave={hide}>
          {opts.value.map((item) => {
            return (
              <div class="flex items-center px-2.5 hover:bg-blue-50 cursor-pointer">
                <div class="text-[0.8rem] my-2 ">{item.name}</div>
              </div>
            );
          })}
        </Popover>
      </div>
    );
  });
const HeaderRender = layout.headerRender ?? (() => {});
</script>

<style>
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
}
.p-popover-content {
  padding: 10px !important;
}
</style>
