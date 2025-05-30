<!-- EditableText.vue -->
<template>
  <component
    v-bind="$attrs"
    :is="Node"
    @click.stop="clickWrapper"
    @dblclick="
      () => {
        isSelectWrapper.currWrapper == id && startEditing();
      }
    "
    :class="[
      {
        '!outline-1 !outline-black !outline-dashed': isEnter,
        '!outline-2 !outline-blue-600 ': isSelectWrapper.currWrapper == id,
      },
      'w-auto p-2 relative z-1000 ',
      className,
    ]"
    style="overflow: inherit"
    :contenteditable="isEditing"
    @keydown.enter.prevent="finishEditing"
    ref="editableElement"
    @mouseenter="
      isSelectWrapper.currHover = null;
      isSelectWrapper.currWrapper != id && (isEnter = true);
    "
    @mouseleave="isEnter = false"
    @blur="blur"
    @input="
      (e) => {
        setLocation(e)
      }
    "
  >
    <template v-if="isSelectWrapper.currWrapper == id">
      <!-- <div @click.stop="clickWrapper" v-html="modelValue"></div> -->
      {{ modelValue }}
    </template>
    <slot v-else>{{ modelValue }}</slot>
  </component>
  <teleport to="body">
    <template v-if="isSelectWrapper.currWrapper == id">
      <div
        v-if="showOpBtns"
        ref="toolbarRef"
        class="fixed h-[2rem] bg-blue-600 w-fit z-2000 !rounded-[3px] flex"
        :style="{
          left: toolbar.x + 'px',
          top: toolbar.y + 'px',
          // 'top-[-2rem]': !isDown,
        }"
      >
        <ButtonGroup>
          <Button
            variant="text"
            class="hover:bg-blue-300!"
            size="small"
            @click.stop="startEditing"
          >
            <Plus class="w-4 h-4 !text-surface-900" />
          </Button>
          <Button
            variant="text"
            class="hover:bg-blue-300!"
            size="small"
            @click.stop="startEditing"
          >
            <T class="w-3 h-3" />
          </Button>
        </ButtonGroup>
        <!-- </div> -->
      </div>
      <div
        v-if="showToolbar"
        ref="toolbarRef"
        class="fixed z-2001"
        :style="{
          left: toolbar.x + 'px',
          top: toolbar.y + 'px',
        }"
      >
        <ButtonGroup @click="showToolbar = true">
          <Button>
            <B />
          </Button>
          <Button>
            <U />
          </Button>
          <Button>
            <span>{{ "/" }}</span>
          </Button>
          <Button>
            <H2 />
          </Button>
          <Button>
            <H3 />
          </Button>
        </ButtonGroup>
      </div>
    </template>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { T, Plus, U, B, H2, H3 } from "../source";
import { uuid } from "mooljs";
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "div",
  },
  className: {
    type: String,
    default: "",
  },
});
const Node =
  typeof resolveComponent(props.tag) == "string"
    ? props.tag
    : resolveComponent(props.tag);

const isEnter = ref(false);
const id = uuid({});
const toolbar = ref({
  x: 0,
  y: 0,
});
const isSelectWrapper = inject<{
  value: { currWrapper: null | string; currHover: null | string };
}>("activeIds", { value: { currWrapper: null, currHover: null } }).value;
const emit = defineEmits(["update:modelValue"]);

const isEditing = ref(false);
const showToolbar = ref(false);
const showOpBtns = ref(true);
const editableElement = ref(null);
const toolbarRef = ref(null);
const currentRect = ref({
  top: 0,
  left: 0,
  bottom: 0,
});
const blur = () => {
  // showOpBtns.value = false;
  // showToolbar.value = false
};
const clickWrapper = (e) => {
  showOpBtns.value = true;
  showToolbar.value = false;
  isSelectWrapper.currWrapper = id;
  isSelectWrapper.currHover = null;
  nextTick(() => {
    setLocation(e);
  });
};
const setLocation = (e) => {
  const { top, right, bottom, left } = e.target.getBoundingClientRect();
  currentRect.value = { top, bottom, left };
  const { width, height } = getComputedStyle(toolbarRef.value! as Element);
  toolbar.value.x = right - +width?.replace("px", "");
  toolbar.value.y = top < 66 ? bottom : top - +height.replace("px", "");
  isEnter.value = false;
};
const canvasEl = document.querySelector(".canvas_container");
onMounted(() => {
  let top = 0;
  canvasEl?.addEventListener("scroll", (e) => {
    toolbar.value.y -= (e.target as HTMLElement)?.scrollTop - top;
    top = (e.target as HTMLElement)?.scrollTop;
  });
});
const startEditing = () => {
  showToolbar.value = true;
  isEditing.value = true;

  nextTick(() => {
    console.log(currentRect.value);

    const { top, bottom, left } = currentRect.value;
    const { height } = getComputedStyle(toolbarRef.value! as Element);
    toolbar.value.x = left;
    toolbar.value.y = top < 66 ? bottom : top - +height.replace("px", "");
    isEnter.value = false;
    if (editableElement.value) {
      // editableElement.value.focus?.();
      // 选择所有文本
      const range = document.createRange();
      const $el = editableElement.value.$el
        ? editableElement.value.$el
        : editableElement.value;

      range.selectNodeContents($el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });
};

const finishEditing = () => {
  if (editableElement.value) {
    const $el = editableElement.value.$el
      ? editableElement.value.$el
      : editableElement.value;
    emit("update:modelValue", $el.textContent);
  }
  isEditing.value = false;
  isSelectWrapper.currWrapper = null;
};

watch(
  () => isSelectWrapper.currWrapper,
  () => {
    isEditing.value = false;
  }
);
</script>

<style>
.editing {
  position: relative;
}

[contenteditable] {
  outline: none;
  /* 去掉默认的聚焦边框 */
  border: none;
  /* 去掉边框 */
  background-color: transparent;
  /* 设置背景为透明 */
}

[contenteditable]:focus {
  outline: none;
  /* 去掉聚焦时的边框 */
  border: none;
  /* 去掉聚焦时的边框 */
}
</style>
