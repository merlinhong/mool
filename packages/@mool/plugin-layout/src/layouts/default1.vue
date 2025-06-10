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

<script setup lang="tsx">
import ProLayout from "@/components/ProLayout.vue";
import { useMenuFromRoutes } from "./useMenu";
import Popover from "primevue/popover";
import Avatar from "primevue/avatar";
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
          path: "/form/ProLayout",
          component: "/src/pages/form/ProLayout.vue",
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
const FooterRender = () => {
  return (
    <div class="default-footer">
      <div>{copyright.value || "Copyright © 2023 ProLayout"}</div>
      {links.value && links.value.length && (
        <div>
          {links.value.map((link, index) => (
            <a key={index} href={link.href} target="_blank">
              {link.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
const HeaderRender = () => {};
const op = ref();
const timer = ref<null | number>(null);
const cities = ref([
  { name: "个人中心", code: "personCenter" },
  { name: "退出登录", code: "logout" },
]);
const RightRender = () => {
  return (
    <div className="right-content">
      {/* <ElTooltip content="搜索" placement="bottom">
        <ElButton type="text">
          <ElIcon>
            <Search />
          </ElIcon>
        </ElButton>
      </ElTooltip>
      <ElTooltip content="帮助" placement="bottom">
        <ElButton type="text">
          <ElIcon>
            <QuestionFilled />
          </ElIcon>
        </ElButton>
      </ElTooltip> */}
      {/* <ElDropdown
        v-slots={{
          dropdown: () => {
            return (
              <ElDropdownMenu>
                <ElDropdownItem>个人中心</ElDropdownItem>
                <ElDropdownItem>设置</ElDropdownItem>
                <ElDropdownItem divided>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            );
          },
        }}
      >
        <div class="user-dropdown">
          <ElAvatar size={32} src="https://joeschmoe.io/api/v1/random" />
          <span class="username">管理员</span>
        </div>
      </ElDropdown> */}
      <div
        class="user-dropdown hover:bg-blue-50 p-2"
        onMouseenter={(e) => {
          if (timer.value) {
            window.clearTimeout(timer.value);
            timer.value = null;
          }
          op.value.show(e);
        }}
        onMouseleave={() => {
          timer.value = window.setTimeout(() => {
            op.value.hide();
          }, 150);
        }}
      >
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px;"
        />
        <span class="username">管理员</span>
      </div>
      <Popover
        ref={op}
        onMouseenter={(e) => {
          if (timer.value) {
            window.clearTimeout(timer.value);
            timer.value = null;
          }
        }}
        onMouseleave={() => {
          timer.value = window.setTimeout(() => {
            op.value.hide();
          }, 150);
        }}
      >
        {cities.value.map((item) => {
          return (
            <div class="flex items-center px-2.5 hover:bg-blue-50 cursor-pointer">
              <div class="text-[0.8rem] my-2 ">{item.name}</div>
            </div>
          );
        })}
      </Popover>
    </div>
  );
};
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
