<script setup lang="ts">
import { SortableEvent, VueDraggable } from "vue-draggable-plus";
import { componentLibrary } from "../schema";
import { cloneDeep, uuid, useRefs } from "mooljs";
import { PropType } from "vue";
const { refs, setRefs } = useRefs();
defineProps({
  width: {
    type: String,
    default: "100%",
  },
  drawer: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: Boolean,
    default: false,
  },
  activeIds: {
    type: Object as PropType<{
      currActive: number | null;
      currHover: number | null;
      currRect: number | null;
      currWrapper: number | null;
    }>,
    default: () => ({
      currActive: null,
      currHover: null,
      currRect: null,
      currWrapper: null,
    }),
  },
});
const curStatus = ref<"normal" | "dragStart" | "dragEnd" | "draging">("normal");

// 侧边栏按钮组
const btnGroup = ref<{ name: string; className: string; active?: boolean }[]>([
  { name: "添加内容", className: "add-button" },
]);

const drawer = inject<Ref<boolean>>("drawer");
const editData = inject<Ref<any[]>>("editData", ref([]));

const aside = ref();
const emit = defineEmits(["change", "editPage", "place"]);

/**
 * 监听popover组件进入事件
 * @param e MouseEvent
 * @param id String
 */
const y = ref(0);
const onPopoverEnter = (e: MouseEvent, id: string) => {
  if (curStatus.value == "normal") {
    refs[id].classList.remove("out-in-fade");
    refs[id].classList.add("fade-in-out");
    refs[id].classList.remove("hidden");
    const { height } = (e.target as HTMLElement)?.getBoundingClientRect();
    const popoverHeight = +getComputedStyle(refs[id])?.height.replace("px", "");
    y.value = (height - popoverHeight) / 2;
  }
};

/**
 * 监听popover组件离开事件
 * @param e MouseEvent
 * @param id String
 */
const onPopoverLeave = (e: MouseEvent, id: string) => {
  if (curStatus.value == "normal") {
    refs[id].classList.add("out-in-fade");
    refs[id].classList.remove("fade-in-out");
    refs[id].addEventListener("animationend", (e) => {
      if (e.target.classList.contains("out-in-fade")) {
        refs[id].classList.add("hidden");
      }
    });
  }
};

/**
 *
 * @param e 监听拖拽开始
 */
const onStart = (e: SortableEvent) => {
  hint.value = true;
  editData.value = [];
  Object.keys(refs).forEach((_) => {
    refs[_].classList.add("out-in-fade");
    refs[_].classList.remove("fade-in-out");
    refs[_].addEventListener("animationend", (e) => {
      if (e.target.classList.contains("out-in-fade")) {
        refs[_].classList.add("hidden");
      }
    });
  });
  curStatus.value = "dragStart";
  activeIds.value.currHover = null;
  activeIds.value.currActive = null;
};

/**
 * 监听拖拽结束
 * @param e SortableEvent
 */
const onEnd = (e: SortableEvent) => {
  // Object.keys(refs).forEach((_) => {
  //   refs[_].hide(e);
  // });
  if (e.data.id.includes("bar")) {
    e.item.classList.add("py-10");
  }
  e.item.style.display = "block";

  curStatus.value = "normal";
  hint.value = false;
};
const hint = defineModel("hint", { required: true });
const activeIds = defineModel("activeIds", {
  type: Object as PropType<{
    currActive: number | null;
    currHover: number | null;
    currRect: number | null;
    currWrapper: number | null;
  }>,
  default: () => ({
    currActive: null,
    currHover: null,
    currRect: null,
    currWrapper: null,
  }),
});
/**
 * 监听拖移动
 * @param e SortableEvent
 */
const onMove = (e) => {
  e.dragged.classList.remove("py-10");
  drawer!.value = false;
  curStatus.value = "draging";
  e.dragged.style.display = "none";
  hint.value = true;
};
/**
 * 添加内容
 */
const addContent = () => {
  aside.value.classList.add("pointer-events-none");
  drawer!.value = true;
  setTimeout(() => {
    aside.value.classList.remove("pointer-events-none");
  }, 300);
};
const clone = (item: any) => {
  return JSON.parse(
    JSON.stringify({
      ...item,
      id: `${item.template}_${uuid({})}`,
    })
  );
};
</script>

<template>
  <div class="sidebar-container">
    <nav
      class="sidebar-nav border-r border-zinc-800 z-2001 rounded-bl-[5px]"
      style="background-color: var(--surface-ground)"
    >
      <div class="top-buttons">
        <div
          v-for="item in btnGroup"
          :key="item.name"
          style="padding: 5px; width: 100%; z-index: 9999"
          :class="[{ 'active-button': item.active, cursor: 'pointer' }]"
        >
          <div
            @mouseenter="addContent"
            style="
              cursor: pointer;
              margin: 10px;
              white-space: wrap;
              width: 2rem;
              text-align: center;
              border-radius: 5px;
              padding: 5px 0;
            "
            class="border !border-zinc-500"
          >
            <i class="pi pi-plus-circle pi-plus text-white-500"></i>
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="bottom-buttons">
        <button class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <g
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="13" height="13" x=".5" y=".5" rx="1" />
              <path
                d="M.5 4h13m-9 3L3 8.5L4.5 10M10 7l1.5 1.5L10 10m-3.5.5L8 6"
              />
            </g>
          </svg>
        </button>
      </div>
    </nav>
    <Splitter
      class="relative !w-[26rem] bottom-[1px]"
      style="z-index: 2000; transition: transform 0.3s ease"
      :style="{
        ...(drawer
          ? { transform: 'translateX(0rem)' }
          : { transform: 'translateX(-26rem)' }),
      }"
    >
      <SplitterPanel class="rounded-br-[5px]">
        <div
          ref="aside"
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            position: absolute;
            width: 100%;
            transition: transform 1s ease;
            z-index: 9999;
            border-right: 1px solid #999;
          "
        >
          <div
            style="padding: 20px; font-size: 13px; color: #333"
            v-for="_ in componentLibrary"
          >
            <div
              style="
                padding: 0px 10px;
                margin-bottom: 10px;
                color: var(--code-color);
              "
            >
              {{ _.name }}
            </div>

            <div class="flex justify-between items-center flex-wrap">
              <div
                v-for="item in _.compList"
                class="!w-[47%] box relative !mb-12"
              >
                <VueDraggable
                  v-model="item.schema"
                  @move="onMove"
                  @start="onStart"
                  @end="onEnd"
                  :clone="clone"
                  :animation="150"
                  :sort="false"
                  :group="{ name: 'blocks', pull: 'clone', put: false }"
                  :class="[{ 'bg-gray-500 ': item.id.includes('bar') }]"
                  @mouseenter="(e: MouseEvent) => onPopoverEnter(e, item.id)"
                  @mouseleave="(e: MouseEvent) => onPopoverLeave(e, item.id)"
                >
                  <div :class="[{ 'py-10': item.id.includes('bar') }, item.id]">
                    <component :is="item.miniComponent"> </component>
                  </div>
                </VueDraggable>
                <div class="absolute bottom-[-25px] text-[var(--code-color)]">
                  {{ item.desc }}
                </div>
                <div
                  class="popover_container absolute opacity-0 bg-black p-2 w-100 hidden"
                  :ref="setRefs(item.id)"
                  :style="{ bottom: y + 'px' }"
                >
                  <div class="triangle absolute"></div>
                  <component :is="item.popoverComponent" class="w-full" />
                </div>
              </div>
            </div>
            <!-- 迷你工具栏 -->
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
<style lang="less" scoped>
.sidebar-container {
  display: flex;
}

.sidebar-nav {
  background-color: #fff;
  padding: 10px 0px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-buttons,
.bottom-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-button,
.var-button,
.nav-button,
.icon-button {
  width: 20px;
  height: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
}

.add-button,
.var-button {
  font-size: 16px;
  border: 1px solid #333;
}

.var-button {
  font-size: 10px;
}

.nav-button {
  background: none;
  border: none;
  padding: 5px;
}

.page-button {
  background: none;
  border: none;
}

.bottom-buttons {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.icon-button {
  width: 22px;
  height: 22px;
  margin-top: 15px;
  background: none;
  border: none;
  cursor: pointer;
}

.component-drawer {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e2e2e2;
}

.component-list {
  padding: 10px;
}

:deep(.el-collapse-item__header) {
  font-size: 15px !important;
  color: #303133;
  background-color: transparent;
  border-radius: 4px;
  padding: 0 5px;
  margin-bottom: 5px;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

.base-component {
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style-type: none;
  margin: 5px 0;
  background-color: transparent !important;
}

.component-item {
  border: 1px solid #303133;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: move;

  &:hover {
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
}

.component-item-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.component-item i {
  margin-right: 8px;
  font-size: 18px;
  color: #409eff;
}

.component-item span {
  font-size: 14px;
  color: #606266;
}

:deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.robot-main {
  z-index: 999;
  position: absolute;
  bottom: 50px;
  right: 320px;
}

.component-list {
  /* 保留原有样式 */
}

.base-component {
  /* 保留原有样式 */
}

.component-item {
  /* 保留原有样式 */
}

/* 可能需要添加一些额外的样式来优化 ElCollapse 的外观 */
:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

/* 添加以下样式 */
.centered-tabs :deep(.el-tabs__header) {
  display: flex;
  justify-content: center;
}

.centered-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 0;
  /* 移除底部的线 */
}

.centered-tabs :deep(.el-tabs__nav) {
  float: none;
  justify-content: center;
}

.active-button {
  border-right: 2px solid #409eff;
}

/* 定义淡入淡出动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0; /* 完全透明 */
  }
  100% {
    opacity: 1; /* 完全显示 */
  }
}
/* 定义淡入淡出动画 */
@keyframes outInFade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 应用动画到元素 */
.popover_container {
  width: 25rem;
  height: auto;
  z-index: 10000;
  right: -26rem !important;
}
.fade-in-out {
  display: block !important;
  opacity: 1;
  animation: fadeInOut 0.8s; /* 动画持续3秒并无限循环 */
}
.out-in-fade {
  opacity: 0;
  animation: outInFade 0.2s; /* 动画持续3秒并无限循环 */
}
/* 创建一个三角形 */
.triangle {
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 10px solid black; /* 右边设置颜色，形成向左的三角形 */
  left: -5px;
  top: calc((100% - 25px) / 2);
}
</style>
