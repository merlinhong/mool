<template>
  <div class="sidebar-container">
    <nav
      class="sidebar-nav !bg-zinc-700 border-r !border-zinc-900 z-10 rounded-bl-lg"
    >
      <div class="top-buttons">
        <div
          v-for="item in btnGroup"
          :key="item.name"
          style="padding: 5px; width: 100%"
          :class="[{ 'active-button': item.active, cursor: 'pointer' }]"
        >
          <div
            @mouseenter="drawer = true"
            style="
              cursor: pointer;
              margin: 10px;
              white-space: wrap;
              width: 2rem;
              text-align: center;
              border-radius: 5px;
              padding: 5px 0;
              color: white;
            "
            class="border !border-zinc-500"
          >
            <el-icon>
              <CirclePlus />
            </el-icon>
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
    <el-aside
      class="bg-zinc-700 relative"
      style="z-index: 20; transition: width 0.5s ease"
      :style="{
        ...(drawer ? { width: '22.5rem' } : { width: '0' }),
      }"
    >
      <div
        style="
          height: 100%;
          display: flex;
          flex-direction: column;
          position: absolute;
          width: 100%;
          transition: transform 0.5s ease;
        "
        :style="{
          ...(drawer
            ? { transform: 'translateX(0)' }
            : { transform: 'translateX(-22.5rem)' }),
        }"
      >
        <div style="padding: 20px; flex: 1; font-size: 13px; color: #333">
          <div style="padding: 0px 10px; margin-bottom: 10px; color: #fff">
            卡片
          </div>
          <VueDraggable
            v-model="fucList"
            @move="onMove"
            @start="onStart"
            @end="onEnd"
            :animation="150"
            :sort="false"
            :group="{ name: 'blocks', pull: 'clone', put: false }"
            style="
              background-color: rgb(234, 234, 232);
              padding: 20px 0;
              box-sizing: border-box;
            "
          >
            <el-popover
            class="!h-[50px]"
              placement="right"
              :width="'30vw'"
              :visible="showPopover"
            >
              <CardBlock />
              <template #reference>
                <BarBlock
                  @mouseenter="onPopoverEnter"
                  @mouseleave="onPopoverLeave"
                />
              </template>
            </el-popover>
          </VueDraggable>
        </div>
      </div>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import BarBlock from "../blocks/bar.vue";
import CardBlock from "../blocks/card.vue";
// import { useMool } from "@/mool";
// import { baseComponentList, seniorComponentList, initEditor, type MonacoEditor } from "@/mool/utils";
// import PagePanel from "./PagePanel.vue";
// import { componentGroups } from "@/mool/utils/schema";
import { CirclePlus } from "@element-plus/icons-vue";
import { VueDraggable } from "vue-draggable-plus";
import { uuid } from "mooljs";
defineProps({
  pageConfig: {
    type: Object as PropType<any>,
    required: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  drawer: {
    type: Boolean,
    default: false,
  },
});
const fucList = [
  {
    component: "CardBlock",
  },
];
const op = ref();
const showPopover = ref(false);
const curStatus = ref<"normal" | "dragStart" | "dragEnd" | "draging">("normal");

// 侧边栏按钮组
const btnGroup = ref<{ name: string; className: string; active?: boolean }[]>([
  { name: "添加内容", className: "add-button" },
]);

const drawer = inject<Ref<boolean>>("drawer");

const emit = defineEmits(["change", "editPage"]);

const onPopoverEnter = () => {
  if (curStatus.value == "normal") {
    showPopover.value = true;
  }
};
const onPopoverLeave = () => {
  if (curStatus.value == "normal") {
    showPopover.value = false;
  }
};
const onStart = () => {
  // drawer.value = true;
  showPopover.value = false;
  curStatus.value = "dragStart";
};
const onEnd = () => {
  curStatus.value = "normal";
};
const onMove = (e) => {
  drawer!.value = false;
  curStatus.value = "draging";
};
</script>

<style lang="less" scoped>
.sidebar-container {
  display: flex;
  height: calc(100% - 0.2rem);
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
</style>
