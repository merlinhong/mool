<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const props = defineProps({
  // 布局配置
  title: {
    type: String,
    default: "ProLayout",
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  menuData: {
    type: Array,
    default: () => [],
  },
  menuProps: {
    type: Object,
    default: () => ({
      backgroundColor: "#001529",
      textColor: "#fff",
      activeTextColor: "red",
      uniqueOpened: false,
      router: true,
    }),
  },
  logo: {
    type: String,
    default: "",
  },
});
const defaultProps = computed(() =>
  Object.assign(
    {
      backgroundColor: "#001529",
      textColor: "#fff",
      activeTextColor: "#fff",
      activeBgColor: "#2878f0",
      uniqueOpened: false,
      hoverBgColor: "var(--p-primary-color)",
      router: true,
    },
    props.menuProps
  )
);
const width = ref("100%");
const displayIcon = ref(false);
provide("uniqueOpened", defaultProps.value.uniqueOpened);
const leave = () => {
  setTimeout(() => {
    displayIcon.value = true;
  }, 200);
};
</script>

<template>
  <Transition name="expand-menu" @leave="leave" @enter="displayIcon = false">
    <div
      class="layout-sidebar"
      v-show="!collapsed"
      :style="{ background: defaultProps.backgroundColor }"
    >
      <div class="logo-container">
        <router-link to="/" class="flex">
          <img v-if="logo" :src="logo" class="logo" alt="logo" />
          <h1 v-if="logo && !collapsed" class="title text-white">
            {{ title }}
          </h1>
        </router-link>
      </div>
      <ul class="layout-menu" style="white-space: nowrap; overflow: hidden">
        <template v-for="(item, i) in menuData" :key="item">
          <app-menu-item
            v-if="!item.separator"
            :item="item"
            :index="i"
            :hidden="displayIcon"
            :style="{
              color: defaultProps.textColor,
              '--active-color-text': defaultProps.activeTextColor,
              '--hover-bg-color': defaultProps.hoverBgColor,
              '--active-bg-color': defaultProps.activeBgColor,
            }"
          ></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
        </template>
      </ul>
    </div>
  </Transition>
  <div
    class="layout-sidebar"
    v-show="displayIcon"
    :style="{ background: defaultProps.backgroundColor }"
  >
    <div class="logo-container">
      <router-link to="/">
        <img v-if="logo" :src="logo" class="logo" alt="logo" />
        <h1 v-if="!collapsed || !logo" class="title text-white">
          {{ title }}
        </h1>
      </router-link>
    </div>
    <ul class="layout-menu" style="white-space: nowrap; overflow: hidden">
      <template v-for="(item, i) in menuData" :key="item">
        <app-menu-item
          v-if="!item.separator"
          :item="item"
          :index="i"
          :hidden="displayIcon"
          :style="{
            color: defaultProps.textColor,
            '--active-color-text': defaultProps.activeTextColor,
            '--hover-bg-color': defaultProps.hoverBgColor,
            '--active-bg-color': defaultProps.activeBgColor,
          }"
        ></app-menu-item>
        <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.expand-menu-enter-from,
.expand-menu-leave-to {
  max-width: 100%;
}

.expand-menu-enter-to,
.expand-menu-leave-from {
  max-width: 100%;
}

.expand-menu-leave-active {
  transition: max-width 0.5s cubic-bezier(0, 1, 0, 1);
}

.expand-menu-enter-active {
  transition: max-width 0.5s cubic-bezier(0, 1, 0, 1);
}
.logo-container {
  height: 64px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo {
  height: 25px;
  width: 25px;
  margin-right: 8px;
  vertical-align: text-bottom;
}
</style>
