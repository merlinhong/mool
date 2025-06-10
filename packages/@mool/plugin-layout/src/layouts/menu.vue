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
  data: {
    type: Array,
    default: () => [],
  },
  logo: {
    type: String,
    default: "",
  },
  activeTextColor: {
    type: String,
    default: "#fff",
  },
  backgroundColor: {
    type: String,
    default: "#001529",
  },
  activeBgColor: {
    type: String,
    default: "#2878f0",
  },
  textColor: {
    type: String,
    default: "#fff",
  },
  hoverBgColor: {
    type: String,
    default: "var(--p-primary-color)",
  },
  uniqueOpened: {
    type: Boolean,
    default: false,
  },
});

const width = ref("100%");
const displayIcon = ref(false);
const isCollapsed = ref(false);
provide("uniqueOpened", props.uniqueOpened);
const leave = () => {
  setTimeout(() => {
    displayIcon.value = true;
  }, 200);
};
</script>

<template>
  <Transition
    name="expand-menu"
    @leave="leave"
    @enter="displayIcon = false"
    @after-leave="isCollapsed = true"
  >
    <div
      class="layout-sidebar"
      v-show="!collapsed"
      :style="{ background: backgroundColor }"
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
        <template v-for="(item, i) in data" :key="item">
          <app-menu-item
            v-if="!item.separator"
            :item="item"
            :index="i"
            :hidden="displayIcon"
            :style="{
              color: textColor,
              '--active-color-text': activeTextColor,
              '--hover-bg-color': hoverBgColor,
              '--active-bg-color': activeBgColor,
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
    :style="{ background: backgroundColor }"
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
      <template v-for="(item, i) in data" :key="item">
        <app-menu-item
          v-if="!item.separator"
          :item="item"
          :index="i"
          :hidden="displayIcon"
          :collapsed="isCollapsed"
          :style="{
            color: textColor,
            '--active-color-text': activeTextColor,
            '--hover-bg-color': hoverBgColor,
            '--active-bg-color': activeBgColor,
          }"
        >
        </app-menu-item>
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
