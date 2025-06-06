<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const props = defineProps({
  // 布局配置
  title: {
    type: String,
    default: "ProLayout",
  },
  logo: {
    type: String,
    default: "",
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
      activeTextColor: "#ffd04b",
      uniqueOpened: true,
      router: true,
    }),
  },

  // 渲染控制
  headerRender: {
    type: [Boolean, Function],
    default: true,
  },
  footerRender: {
    type: [Boolean, Function],
    default: true,
  },
  pageTitleRender: {
    type: [Boolean, Function],
    default: true,
  },
  // menuRender:{
  //   type:Boolean,
  //   default:true
  // },
  // 内容配置
  pageTitle: {
    type: String,
    default: "",
  },
  pageSubTitle: {
    type: String,
    default: "",
  },
  breadcrumb: {
    type: Boolean,
    default: true,
  },
  copyright: {
    type: String,
    default: "Copyright © 2023 ProLayout",
  },
  links: {
    type: Array,
    default: () => [],
  },
});
const expand = ref(false);
const displayIcon = ref(false);
const sideBarRef = ref();
const width = ref("300px");
</script>

<template>
  <Button @click="expand = !expand">切换</Button>
  <Transition
    name="expand-menu"
    @after-leave="displayIcon = true"
    @enter="displayIcon = false"
  >
    <div
      class="layout-sidebar"
      v-if="!expand"
      :style="{ width, background: menuProps.backgroundColor }"
    >
      <ul class="layout-menu" style="white-space: nowrap; overflow: hidden">
        <template v-for="(item, i) in menuData" :key="item">
          <app-menu-item
            v-if="!item.separator"
            :item="item"
            :index="i"
            :style="{ color: menuProps.textColor }"
          ></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
        </template>
      </ul>
    </div>
  </Transition>
  <div class="layout-sidebar !w-[85px]" v-if="displayIcon" :style="{background: menuProps.backgroundColor }">
    <ul class="layout-menu" style="white-space: nowrap; overflow: hidden">
      <template v-for="(item, i) in menuData" :key="item">
        <app-menu-item
          v-if="!item.separator"
          :item="item"
          :index="i"
          :hidden="displayIcon"
          :style="{ color: menuProps.textColor }"
        ></app-menu-item>
        <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.expand-menu-enter-from,
.expand-menu-leave-to {
  max-width: 85px;
}

.expand-menu-enter-to,
.expand-menu-leave-from {
  max-width: v-bind("width");
}

.expand-menu-leave-active {
  transition: max-width 1s cubic-bezier(0, 1, 0, 1);
}

.expand-menu-enter-active {
  transition: max-width 1s cubic-bezier(0, 1, 0, 1);
}
</style>
