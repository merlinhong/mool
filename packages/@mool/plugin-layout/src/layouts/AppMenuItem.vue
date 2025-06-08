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
    console.log("Active menu item changed:", newVal, itemKey.value);
    
    isActiveMenu.value =

      newVal === itemKey.value || newVal?.startsWith(itemKey.value + "-");
      console.log("Is active menu:", isActiveMenu.value);
      
  }
);

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }


  const foundItemKey = item.routes
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;
  setActiveMenuItem(foundItemKey);
}
// 递归深层嵌套routes的path是否与当前路由匹
function isRouteMatch(route, item) {
  if (route.path === item.path) {
    return true;
  }
  if (item.routes) {
    return (
      item.routes.some((child) => isRouteMatch(route, child))
    );
  }
  return false;
}

function checkActiveRoute(event, item) {
  return route.path === item.path || (item.routes && isRouteMatch(route, item));
}
watch(
  () => route.path,
  () => {
    isActiveMenu.value = checkActiveRoute(null, props.item);
  }
);
onMounted(() => {
  isActiveMenu.value = checkActiveRoute(null, props.item);
  if (props.item.routes) {
    const activeChild = props.item.routes.find(
      (child) => route.path === child.path
    );
    if (activeChild) {
      setActiveMenuItem(
        itemKey.value + "-" + props.item.routes.indexOf(activeChild)
      );
    }
  }
});
</script>

<template>
  <li :class="{ 'active-menuitem': isActiveMenu }">
    <router-link
      @click="itemClick($event, item)"
      :class="[item.class, { 'active-route': checkActiveRoute($event, item) }]"
      tabindex="0"
      :to="item.routes ? '' : item.path"
    >
      <i
        :class="[
          'layout-menuitem-icon',
          { 'text-white': item.routes },
          item.meta?.icon,
        ]"
      ></i>
      <span
        :class="[
          'layout-menuitem-text',
          'w-full',
          { 'text-white': item.routes },
        ]"
        >{{ item.meta?.title }}</span
      >
      <i
        :class="[
          'pi',
          'pi-fw',
          'pi-angle-down',
          'layout-submenu-toggler',
          { 'text-white': item.routes },
        ]"
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

<style lang="scss" scoped>
li {
  > a {
    &.active-route {
      font-weight: 700;
      color: var(--active-color-text);
    }
  }
}
</style>
