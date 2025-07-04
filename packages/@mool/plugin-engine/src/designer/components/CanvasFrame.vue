<script setup lang="tsx">
import { ref, onMounted, watch, nextTick, onUnmounted, Ref } from "vue";
// import BasicCanvas from "./BasicCanvas.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import BasicPage from "./canvasContainer.vue";
import { VueDraggable } from "vue-draggable-plus";
import { componentLibrary } from "../schema";
import CompWrapper from "./CompWrapper.vue";
defineOptions({
  inheritAttrs: true,
});
const props = defineProps<{
  pageSchema: any[];
  // currentConf?: any;
  // hasActive?: boolean;
  // customStyle?: { width?: string; margin?: string };
  // loading: boolean;
  // isPreview?: boolean;
  // ctx?: Function;
  hint: boolean;
  place: {
    el: HTMLElement;
    orientation: "after" | "before";
  };
  activeIds: {
    currActive: number | null;
    currHover: number | null;
    currRect: number | null;
  };
}>();

const pageSchema = defineModel<any>("pageSchema");
// const currentConf = defineModel<any | null>("current");
const emit = defineEmits<{
  (e: "update:pageConfig", value: any): void;
  (e: "active", value: any): void;
  (e: "resize", width: number, height: number): void; // 新增 resize 事件
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
// const canvasRef = ref<InstanceType<typeof BasicCanvas> | null>(null);

// const injectTailwindCSS = (doc: Document) => {
//   const Script = doc.createElement("script");
//   Script.src = new URL("../js/tailwind.js", import.meta.url).href;
//   doc.head.appendChild(Script);
// };
// 添加这些新的 ref
const history = ref<any[]>([]);
const historyIndex = ref(-1);

// 添加一个新的函数来保存历史记录
const saveToHistory = (config: Page) => {
  // 如果当前不在历史记录的末尾，删除后面的记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }
  history.value.push(JSON.parse(JSON.stringify(config)));
  historyIndex.value = history.value.length - 1;
};

// 添加一个撤销函数
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    pageConfig.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value])
    );
  }
};

// 添加一个重做函数
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    pageConfig.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value])
    );
  }
};
// 粘贴板
const pasteIframe = ref<Col | null>(null);

// const del = () => {
//   if (currentConf.value) {
//     currentConf.value.children = currentConf.value.children?.filter(
//       (item) => item.id !== currentConf.value?.id
//     );
//   }
// };
// const copy = () => {
//   pasteIframe.value = JSON.parse(JSON.stringify(currentConf.value));
// };
// const paste = () => {
//   if (pasteIframe.value) {
//     currentConf.value?.children?.push({
//       ...pasteIframe.value,
//       id: Date.now().toString().substring(8),
//     });
//   }
// };
// watch(
//   () => props.pageConfig,
//   (newValue) => {
//     nextTick(() => {
//       if (canvasRef.value) {
//         canvasRef.value.init(props.pageConfig);
//       }
//       // 只有当新值与当前历史记录的最后一项不同时，才保存到历史记录
//       if (
//         JSON.stringify(newValue) !==
//         JSON.stringify(history.value[historyIndex.value])
//       ) {
//         saveToHistory(newValue);
//       }
//     });
//   },
//   { deep: true }
// );

const list = computed<Record<string, any>>(() =>
  componentLibrary
    .map((_) => _.compList)
    .flat()
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.component }), {})
);
const hintRef = ref();

watch(
  () => props.place,
  (item) => {
    nextTick(() => {
      if (!pageSchema.value.length) return;
      if (item.orientation == "before") {
        item.el?.insertBefore(hintRef.value, item.el.firstChild);
      } else {
        item.el?.appendChild(hintRef.value);
      }
    });
  }
);

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
provide("activeIds", activeIds);
</script>
<template>
  <div
    @click="activeIds.currWrapper = null"
    v-on="$attrs"
    class="bg-light-800 absolute h-[94vh] !left-[4.0rem] overflow-y-scroll canvas_container"
    style="box-sizing: border-box"
    :style="{ width: 'calc(100% - 25rem)' }"
  >
    <VueDraggable
      v-model="pageSchema"
      :chosenClass="'sortable-chosen'"
      :animation="150"
      group="blocks"
      class="h-[100%]"
      forceFallBack
      fallBackOnBody
      @end="
        (e) => {
          activeIds.currActive = null;
          activeIds.currHover = null;
        }
      "
      @add="
        (e) => {
          $nextTick(() => {
            hintRef.remove();
          });
        }
      "
    >
      <div
        :class="[
          {
            hint: pageSchema.length == 0,
            place: pageSchema.length > 0,
            '!h-full': !hint,
            'z-9999': hint,
          },
        ]"
        ref="hintRef"
        class="absolute z-1000 text-black"
      >
        {{ !hint ? "从左边拖拽组件放到此处" : "放到此处" }}
      </div>
      <div
        v-for="(card, ind) in pageSchema"
        :key="card.id"
        :class="[
          {
            'outline-1 outline-black outline-dashed':
              activeIds.currHover == ind && activeIds.currActive != ind,
            'outline-2 outline-blue-600': activeIds.currActive == ind,
          },
        ]"
        class="relative my-0.5"
        @mouseenter="
          (e) => {
            !hint && (activeIds.currHover = ind);
          }
        "
        @mouseleave="
          (e) => {
            // !isDragging && !hint && (activeIds.currHover = null);
          }
        "
        @click="
          (e) => {
            !hint && (activeIds.currActive = ind);
          }
        "
      >
        <!-- <component :is="card.Hint" v-if="hint"/> -->
        <div
          v-if="activeIds.currHover == ind"
          class="absolute top-0 bg-blue-300 text-white text-[0.8rem] w-full text-center py-0.5 z-1200"
        >
          <i class="pi-bars pi align-middle !text-[0.8rem]"></i
          >长按拖拽或者点击底部按钮变换位置
        </div>
        <div
          v-if="activeIds.currHover == ind"
          class="absolute right-0 bottom-0 bg-blue-600 text-[0.8rem] w-auto h-auto z-9999 rounded-5px"
        >
          <Button
            icon="pi pi-trash text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            @click="pageSchema.splice(ind, 1)"
          ></Button>
          <Button
            icon="pi pi-chevron-up text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            :disabled="ind == 0"
            @click="
              pageSchema.splice(
                ind - 1,
                2,
                pageSchema[ind],
                pageSchema[ind - 1]
              )
            "
          ></Button>
          <Button
            icon="pi pi-chevron-down text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            :disabled="ind == pageSchema.length - 1"
            @click="
              pageSchema.splice(ind, 2, pageSchema[ind + 1], pageSchema[ind])
            "
          ></Button>
        </div>
        <CompWrapper
          :props="card.config"
          @click="activeIds.currWrapper = null"
          style="position: relative"
          :is="list[card.template]"
        >
        </CompWrapper>
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped>
/* 添加响应式样式 */
@media (max-width: 1024px) {
  .iframe-container {
    margin: 10px;
  }
}
.hint {
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.place {
  background-color: rgb(19, 89, 241);
  width: 100%;
  text-align: center;
  color: white;

  font-style: italic;
  font-family: "Courier New", Courier, monospace;
}
.iframe-container {
  /* width: 100%; */
  height: 100%;
  overflow: hidden;
}
/* 
.sortable-chosen{
  border: none;
} */
</style>
