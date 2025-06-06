<script setup>
import { useLayout } from "./layout";
import { useRoute } from "vue-router";

const route = useRoute();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + "-" + props.index
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + "-")
      : false;
});

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    console.log(newVal);
    isActiveMenu.value =
      newVal === itemKey.value || newVal?.startsWith(itemKey.value + "-");
  }
);

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  // if (
  //   (item.to || item.url) &&
  //   (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  // ) {
  //   toggleMenu();
  // }

  // if (item.command) {
  //   item.command({ originalEvent: event, item: item });
  // }

  const foundItemKey = item.routes
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;
  setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
  return route.path === item.to;
}
</script>

<template>
  <li :class="{ 'active-menuitem': isActiveMenu }" >
    <router-link
      @click="itemClick($event, item, index)"
      :class="[item.class, { 'active-route': checkActiveRoute(item) },'!text-[inherit]']"
      tabindex="0"
      :to="item.routes ? '' : item.path"
      
    >
      <i :class="item.meta?.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text w-full">{{ item.meta?.title }}</span>
      <i
        class="pi pi-fw pi-angle-down layout-submenu-toggler"
        v-if="item.routes"
      ></i>
    </router-link>
    <Transition
      v-if="item.routes && item.visible !== false"
      name="layout-submenu"
    >
      <ul v-show="isActiveMenu" class="layout-submenu">
        <app-menu-item
          v-for="(child, i) in item.routes"
          :key="child"
          :index="i"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
        ></app-menu-item>
      </ul>
    </Transition>
  </li>
</template>

<style lang="scss" scoped></style>
