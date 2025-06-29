<template>
  <component
    v-bind="$attrs"
    :is="Node"
    @click.stop="clickWrapper"
    :class="[
      {
        '!outline-1 !outline-black !outline-dashed':
          isSelectWrapper.currHover == id && isSelectWrapper.currWrapper != id,
        '!outline-2 !outline-blue-600 ': isSelectWrapper.currWrapper == id,
        'cursor-move': isDrag,
      },
      'w-auto p-2 relative z-1000 ',
      className,
    ]"
    @mouseleave="isSelectWrapper.currHover = null"
    ref="wrapper"
  >
    <slot></slot>
  </component>
  <teleport to="body" v-if="isSelectWrapper.currWrapper == id">
    <div
      ref="toolbarRef"
      class="fixed h-[2rem] bg-blue-600 w-fit z-2000 !rounded-[3px] flex"
      :style="{
        left: toolbar.x + 'px',
        top: toolbar.y + 'px',
        // 'top-[-2rem]': !isDown,
      }"
    >
      <Button
        variant="text"
        class="hover:bg-blue-300!"
        size="small"
        @click.stop="startDrag"
      >
        <Drag class="w-4 h-4 !text-surface-900" />
      </Button>
      <!-- </div> -->
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { uuid } from "mooljs";
import { Drag } from "../source";
import { useInteract } from "../utils/useInteract";
const props = defineProps({
  tag: {
    type: String,
    default: "div",
  },
  className: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["change"]);
const id = uuid({});

const Node =
  typeof resolveComponent(props.tag) == "string"
    ? props.tag
    : resolveComponent(props.tag);
const isSelectWrapper = inject<{
  value: { currWrapper: null | string; currHover: null | string };
}>("activeIds", { value: { currWrapper: null, currHover: null } }).value;
const clickWrapper = (e) => {
  isSelectWrapper.currWrapper = id;
  isSelectWrapper.currHover = null;
  nextTick(() => {
    setLocation(e);
  });
};
const wrapper = ref();

const toolbarRef = ref(null);
const isDrag = ref(false);

const toolbar = ref({
  x: 0,
  y: 0,
});

const finalxy = {
  toolbarx: 0,
  toolbary: 0,
  x: 0,
  y: 0,
};
const clearInteract = ref<(() => void) | null>(null);
watchEffect(() => {
  if (isSelectWrapper.currWrapper != id) {
    clearInteract.value?.();
    isDrag.value = false;
  }
});

const startDrag = () => {
  const { clear } = useInteract(wrapper, {
    drag: {
      move(e, { x, y,scale }) {
        toolbarRef.value?.classList.add("hidden");
        emit("change", {
          style: {
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
          },
        });
      },
      end(e, { x, y }) {
        toolbarRef.value?.classList.remove("hidden");
        // finalxy.toolbarx = toolbar.value.x;
        // finalxy.toolbary = toolbar.value.y;
      },
    },
    resize: {
      move(e, { scalex,scaley,origin,x,y }) {
        toolbarRef.value?.classList.add("hidden");
        emit("change", {
          style: {
            transform: `translate(${x}px, ${y}px) scale(${scalex}, ${scaley})`,
            transformOrigin: origin,
          },
        });
      },
      end(e, { scale }) {
        console.log(scale);
        toolbarRef.value?.classList.remove("hidden");
      },
    },
  });
  clearInteract.value = clear;
  isDrag.value = true;
};

const setLocation = (e) => {
  const { top, right, bottom, left } = e.target.getBoundingClientRect();
  const { width, height } = getComputedStyle(toolbarRef.value! as Element);
  toolbar.value.x = right - +width?.replace("px", "");
  toolbar.value.y = top < 66 ? bottom : top - +height.replace("px", "");
  finalxy.toolbarx = toolbar.value.x;
  finalxy.toolbary = toolbar.value.y;
};
onMounted(() => {
  wrapper.value?.addEventListener("mousemove", function (e) {
    if (e.target === wrapper.value) {
      isSelectWrapper.currHover = id;
    }
  });
});
</script>

<style></style>
