<script setup lang="tsx">
import { ref, onMounted, watch, nextTick, onUnmounted, Ref } from "vue";
// import BasicCanvas from "./BasicCanvas.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import { SortableEvent, VueDraggable } from "vue-draggable-plus";
import { T, Plus, U, B, H2, H3 } from "../source";

defineOptions({
  inheritAttrs: true,
});
const props = defineProps<{
  // currentConf?: any;
  // hasActive?: boolean;
  // customStyle?: { width?: string; margin?: string };
  // loading: boolean;
  // isPreview?: boolean;
  // ctx?: Function;
  hint: boolean;
  activeIds: {
    currActive: number | null;
    currHover: number | null;
    currRect: number | null;
  };
}>();
const pageSchema = inject<Ref<any[]>>("pageSchema", ref([]));

const iframeRef = ref<HTMLIFrameElement | null>(null);
// const history = ref<any[]>([]);
// const historyIndex = ref(-1);

// 添加一个新的函数来保存历史记录
// const saveToHistory = (config: Page) => {
//   // 如果当前不在历史记录的末尾，删除后面的记录
//   if (historyIndex.value < history.value.length - 1) {
//     history.value = history.value.slice(0, historyIndex.value + 1);
//   }
//   history.value.push(JSON.parse(JSON.stringify(config)));
//   historyIndex.value = history.value.length - 1;
// };

// 添加一个撤销函数
// const undo = () => {
//   if (historyIndex.value > 0) {
//     historyIndex.value--;
//     pageConfig.value = JSON.parse(
//       JSON.stringify(history.value[historyIndex.value])
//     );
//   }
// };

// // 添加一个重做函数
// const redo = () => {
//   if (historyIndex.value < history.value.length - 1) {
//     historyIndex.value++;
//     pageConfig.value = JSON.parse(
//       JSON.stringify(history.value[historyIndex.value])
//     );
//   }
// };
// // 粘贴板
// const pasteIframe = ref<Col | null>(null);

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
const isMobile = inject<Ref<boolean>>("isMobile", ref(false));
const editData = inject<Ref<any[]>>("editData", ref([]));

const place = ref<{ top: number; ind: number }>({ top: 0, ind: 0 });

let scrollDistance: { scrollTop: number; scrollLeft: number } = {
  scrollTop: 0,
  scrollLeft: 0,
};
const sendMessage = (opt: { newIndex?: number }) => {
  nextTick(() => {
    iframeRef.value?.contentWindow?.postMessage(
      {
        schema: JSON.parse(JSON.stringify(pageSchema.value)),
        currIndex: opt.newIndex,
      },
      "*"
    );
  });
};
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
const currMouseEvent = ref<"hover" | "click" | "scroll" | "place">("hover");

onMounted(() => {
  iframeRef.value?.contentWindow?.addEventListener("scroll", (e) => {
    if (editData.value.length) {
      currMouseEvent.value = "scroll";
      const target = e.target as Document;
      scrollDistance = {
        scrollLeft: target.scrollingElement?.scrollLeft ?? 0,
        scrollTop: target.scrollingElement?.scrollTop ?? 0,
      };
      editData.value = editData.value.map((item) => {
        return {
          ...item,
          scrollTop: scrollDistance.scrollTop,
          scrollLeft: scrollDistance.scrollLeft,
        };
      });
    }
  });
  window.addEventListener("message", (event) => {
    if (event.data.type == "IFRAME_LOADED") {
      console.log(1);

      sendMessage({});
      return;
    }
    if (event.data.type == "place") {
      place.value = event.data.place;
      currMouseEvent.value = "place";
      return;
    }
    if (currMouseEvent.value == "place") return;
    if (!event.data.event) return;
    const { scrollTop, scrollLeft } = scrollDistance;
    editData.value = event.data.schema.map((item) => {
      if (item.type) {
        if (item.event == "hover") {
          return item;
        }
        if (item.event == "click") {
          return {
            ...item,
            scrollTop,
            scrollLeft,
          };
        }
      }
      console.log(item);

      return {
        ...item,
        scrollTop,
        scrollLeft,
      };
    });
    currMouseEvent.value = event.data.event;
  });

  watch(
    () => isMobile.value,
    (n) => {
      sendMessage({
        newIndex: 0,
      });
    }
  );
});

const wrapper = computed(() => {
  const {
    rect: { top = 0, width = 0, height = 0, left = 0 } = {},
    event,
    scrollTop = 0,
    scrollLeft = 0,
    id,
  } = editData.value.find((item) => !item.type) ?? {};
  return {
    top: top - scrollTop,
    left: left - scrollLeft,
    width,
    height,
    event,
    id,
  };
});
const hoverWrapper = computed(() => {
  const {
    rect: { top = 0, width = 0, height = 0, left = 0 } = {},
    scrollTop = 0,
    scrollLeft = 0,
  } = editData.value.find((item) => item.event == "hover") ?? {};
  return {
    top: top - scrollTop,
    left: left - scrollLeft,
    width,
    height,
  };
});
const clickWrapper = computed(() => {
  const {
    rect: { top = 0, width = 0, height = 0, left = 0 } = {},
    scrollTop = 0,
    scrollLeft = 0,
    type,
  } = editData.value.find((item) => item.event == "click") ?? {};
  return {
    top: top - scrollTop,
    left: left - scrollLeft,
    width,
    height,
    type,
  };
});
</script>
<template>
  <div
    class="bg-surface-900 absolute h-[94vh] !left-[4.0rem]"
    style="width: calc(100% - 25rem)"
    v-on="$attrs"
  >
    <div
      class="relative h-full w-full"
      :class="[
        {
          'iframe-mobile': isMobile,
        },
      ]"
    >
      <iframe
        id="iframe"
        src="#/designer/canvas"
        ref="iframeRef"
        frameborder="0"
        :class="['w-full h-full absolute inset-0 z-10']"
        style="border: none; background-color: #f5f6f7; border: none"
      >
      </iframe>
      <div
        class="w-full h-full absolute inset-0"
        :class="{
          'edit-layer': !hint,
        }"
        @click="activeIds.currWrapper = null"
        style="box-sizing: border-box"
      >
        <VueDraggable
          v-model="pageSchema"
          :chosenClass="'sortable-chosen'"
          :animation="150"
          group="blocks"
          class="h-[100%]"
          forceFallBack
          fallBackOnBody
          @add="
          (e) => {
            console.log(pageSchema);
            console.log(e);
            
            $nextTick(() => {
              currMouseEvent = 'hover';
               const data = pageSchema.shift();
                pageSchema.splice(
                 place.ind,
                 0,
                 data as any
                );
              sendMessage({
                newIndex: place.ind??0,
              });
            });
          } 
        "
        >
        </VueDraggable>

        <div class="mouse-catcher my-0.5 absolute inset-0">
          <div
            v-if="!!hoverWrapper.height && pageSchema.length"
            :class="[
              'absolute z-10 outline-1 outline-black outline-dashed',
            ]"
            :style="{
              top: hoverWrapper?.top + 'px',
              left: hoverWrapper?.left + 'px',
              width: hoverWrapper?.width + 'px',
              height: hoverWrapper?.height + 'px',
            }"
          ></div>
          <div
            v-if="!!clickWrapper.height && pageSchema.length"
            :class="['absolute z-10 outline-2 outline-blue-600']"
            :style="{
              top: clickWrapper?.top + 'px',
              left: clickWrapper?.left + 'px',
              width: clickWrapper?.width + 'px',
              height: clickWrapper?.height + 'px',
            }"
          ></div>
        </div>
      </div>
      <div
        v-if="hint"
        :class="['place']"
        class="absolute z-1000 text-black"
        :style="{
          top: place.top + 'px',
        }"
      >
        {{ "放到此处" }}
      </div>
      <div
        v-if="pageSchema.length == 0 && !hint"
        :class="[
          {
            hint: pageSchema.length == 0,
            'z-9999': hint,
          },
        ]"
        class="absolute z-1000 text-black"
      >
        {{ "从左边拖拽组件放到此处" }}
      </div>
      <div
        v-if="!!wrapper?.height && pageSchema.length"
        :class="[
          'wrapper absolute flex justify-between flex-col items-end w-full h-full inset-0',
        ]"
        :style="{
          top: (wrapper?.top ?? 0) + 'px',
          height: (wrapper?.height ?? 0) + 'px',
        }"
      >
        <div
          class="top-0 bg-blue-300 text-white text-[0.8rem] w-full text-center py-0.5 z-20"
        >
          <i class="pi-bars pi align-middle !text-[0.8rem]"></i
          >长按拖拽或者点击底部按钮变换位置
        </div>
        <div
          class="right-0 bottom-0 bg-blue-600 text-[0.8rem] w-fit h-auto rounded-5px cursor-pointer z-20"
        >
          <Button
            icon="pi pi-trash text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            @click="
              (e) => {
                const wrapperIndex = pageSchema.findIndex(
                  (item) => item.id === wrapper.id
                );
                if (wrapperIndex !== -1) {
                  pageSchema.splice(wrapperIndex, 1);
                }
                sendMessage({
                  newIndex: wrapperIndex,
                });
              }
            "
          ></Button>
          <Button
            icon="pi pi-chevron-up text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            :disabled="
              pageSchema.length <= 1 || wrapper.id === pageSchema[0].id
            "
            @click="
              () => {
                const wrapperIndex = pageSchema.findIndex(
                  (item) => item.id === wrapper.id
                );
                pageSchema.splice(
                  wrapperIndex - 1,
                  2,
                  pageSchema[wrapperIndex],
                  pageSchema[wrapperIndex - 1]
                );
                sendMessage({
                  newIndex: wrapperIndex,
                });
              }
            "
          ></Button>
          <Button
            icon="pi pi-chevron-down text-white !text-[0.6rem]"
            variant="text"
            class="hover:bg-blue-300! h-3"
            size="small"
            :disabled="
              pageSchema.length <= 1 ||
              wrapper.id === pageSchema[pageSchema.length - 1].id
            "
            @click="
              () => {
                const wrapperIndex = pageSchema.findIndex(
                  (item) => item.id === wrapper.id
                );

                pageSchema.splice(
                  wrapperIndex,
                  2,
                  pageSchema[wrapperIndex + 1],
                  pageSchema[wrapperIndex]
                );
                sendMessage({
                  newIndex: wrapperIndex,
                });
              }
            "
          ></Button>
        </div>
      </div>
      <div
        v-if="!!clickWrapper.height && clickWrapper.type"
        class="h-[1.5rem] bg-blue-600 w-[4rem] z-2000 !rounded-[3px] flex absolute"
        :style="{
          left: clickWrapper.left + clickWrapper.width - 64 + 'px',
          top: clickWrapper?.top - 24 + 'px',
        }"
      >
        <ButtonGroup>
          <Button
            variant="text"
            class="hover:bg-blue-300! cursor-pointer"
            size="small"
          >
            <Plus class="w-3 h-3 !text-surface-900" />
          </Button>
          <Button
            variant="text"
            class="hover:bg-blue-300! cursor-pointer"
            size="small"
          >
            <T class="w-3 h-3" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>

<style>
/* 添加响应式样式 */
.edit-layer {
  pointer-events: none;
  /* 其他样式 */
}
.iframe-mobile {
  width: 375px;
  margin: 0 auto;
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
</style>
