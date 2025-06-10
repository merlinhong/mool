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
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const isActiveMenu = ref(false);
const itemKey = ref(null);
const uniqueOpened = inject("uniqueOpened", false);
onBeforeMount(() => {
  if (props.hidden) return;

  itemKey.value = props.parentItemKey
    ? props.parentItemKey + "-" + props.index
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + "-")
      : false;
});

// watch(
//   () => layoutState.activeMenuItem,
//   (newVal) => {
//     console.log(newVal,props.item,route.path);
//     isActiveMenu.value =
//       newVal === itemKey.value || newVal?.startsWith(itemKey.value + "-");

//   }
// );

function itemClick(event, item) {
  if (checkActiveRoute(event, item) && !item.routes) return;
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  const foundItemKey = item.routes
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;
  // setActiveMenuItem(foundItemKey);
  isActiveMenu.value =
    unref(foundItemKey) === itemKey.value ||
    unref(foundItemKey)?.startsWith(itemKey.value + "-");
  console.log(isActiveMenu.value);
}
// 递归深层嵌套routes的path是否与当前路由匹配
function isRouteMatch(route, item) {
  if (route.path === item.path) {
    return true;
  }
  if (item.routes) {
    return item.routes.some((child) => isRouteMatch(route, child));
  }
  return false;
}

function checkActiveRoute(event, item) {
  return (
    route.path === (item.path ?? item.route) ||
    ((item.routes ?? item.items) && isRouteMatch(route, item))
  );
}
watch(
  () => route.path,
  () => {
    if ((isActiveMenu.value && !uniqueOpened) || props.hidden) return;
    isActiveMenu.value = checkActiveRoute(null, props.item);
  }
);
watch(
  () => props.hidden,
  (n) => {
    if (n) {
      isActiveMenu.value = false;
    } else {
      isActiveMenu.value = checkActiveRoute(null, props.item);
    }
  }
);
onMounted(() => {
  if (props.hidden) return;
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

const timer = ref(null);
const menu = ref();
const locxy = ref({
  x: 0,
  y: 0,
});
const show = (event) => {
  if (!props.item.routes) return;
  if (!locxy.value.x) {
    const { top, right } = event.target.getBoundingClientRect();
    locxy.value.x = right;
    locxy.value.y = top;
  }
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  menu.value.show(event);
};
const formatRoutes = (items) => {
  if (!items) return null;
  return items?.map((item) => ({
    label: item.meta?.title,
    icon: item.meta?.icon,
    route: item.path,
    items: formatRoutes(item.routes ?? ""),
  }));
};
const hide = (event) => {
  timer.value = setTimeout(() => {
    menu.value.hide();
  }, 150);
};
</script>

<template>
  <li
    :class="['relative li_container', { 'active-menuitem': isActiveMenu }]"
    @mouseenter="show"
    @mouseleave="hide"
    v-tooltip="hidden && !item.routes ? item.meta?.title : ''"
  >
    <template v-if="!hidden">
      <router-link
        @click="itemClick($event, item)"
        :class="[
          item.class,
          'flex items-center',
          {
            'active-route': checkActiveRoute($event, item) && !item.routes,
          },
        ]"
        tabindex="0"
        :to="item.routes ? '' : item.path"
      >
        <div class="!h-6">
          <i
            :class="[
              'layout-menuitem-icon  !text-[1rem]',
              { 'text-white': item.routes },
              item.meta?.icon,
            ]"
          ></i>
        </div>
        <span
          :class="[
            'layout-menuitem-text',
            'w-full',
            '!text-[1rem]',
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
    </template>
    <template v-else>
      <router-link
        :class="[
          item.class,
          {
            'active-route': checkActiveRoute($event, item),
          },
        ]"
        :to="item.routes ? '' : item.path"
        tabindex="0"
      >
        <div class="!h-6">
          <i
            :class="[
              'layout-menuitem-icon  !text-[1rem]',
              { 'text-white': item.routes },
              item.meta?.icon,
            ]"
          ></i>
        </div>
      </router-link>
    </template>
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
          :uniqueOpened="uniqueOpened"
        ></app-menu-item>
      </ul>
    </Transition>
    <TieredMenu
      @mouseenter="show"
      @mouseleave="hide"
      v-if="collapsed"
      :model="formatRoutes(item.routes)"
      ref="menu"
      id="overlay_tmenu"
      popup
      class="absolute w-fit h-fit"
      :style="{
        top: locxy.y + 'px',
        left: locxy.x + 'px',
        ...$attrs.style,
      }"
    >
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
          :class="[
            {
              'active-route': checkActiveRoute($event, item),
            },
          ]"
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </TieredMenu>
  </li>
</template>

<style lang="scss" scoped>
li {
  a {
    &:hover {
      background-color: var(--hover-bg-color);
    }
    &.active-route {
      color: var(--active-color-text);
      background-color: var(--active-bg-color);
    }
  }
}

.layout-submenu {
  background-color: #000;
}
</style>
