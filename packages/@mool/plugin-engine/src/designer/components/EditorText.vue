<!-- EditableText.vue -->
<template>
  <!-- <template
    <t
  > -->
  <!-- <div class="relative"> -->
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
  >
    <template v-if="isSelectWrapper.currWrapper == id">
      <!-- <div @click.stop="clickWrapper" v-html="modelValue"></div> -->
      {{ modelValue }}
    </template>
    <slot v-else>{{ modelValue }}</slot>
  </component>
  <teleport to="body">
    <div
      v-if="isSelectWrapper.currWrapper == id"
      ref="toolbarRef"
      class="fixed h-[2rem] right-[-0.6rem] bg-blue-600 w-fit z-9999 !rounded-[3px] flex"
      style="transform: scale(0.8)"
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
        <TSvg class="w-4 h-4" />
      </Button>
      <!-- </div> -->
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import TSvg from "../source/t.svg";
import Plus from "../source/plus.svg";
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
const isSelectWrapper = inject("activeIds", {
  value: { currWrapper: null },
}).value;
const emit = defineEmits(["update:modelValue"]);

const isEditing = ref(false);
const editableElement = ref(null);
const toolbarRef = ref(null);
const clickWrapper = (e) => {
  isSelectWrapper.currWrapper = id;
  isSelectWrapper.currHover = null;
  nextTick(() => {
    const { top, right, bottom } = e.target.getBoundingClientRect();
    const { width, height } = getComputedStyle(toolbarRef.value! as Element);
    toolbar.value.x = right - +width?.replace("px", "");
    toolbar.value.y = top < 60 ? bottom : top - +height.replace("px", "");
    isEnter.value = false;
  });
};
const startEditing = () => {
  isEditing.value = true;
  console.log(isEditing);

  nextTick(() => {
    if (editableElement.value) {
      // editableElement.value.focus?.();
      // 选择所有文本
      const range = document.createRange();
      const $el = editableElement.value.$el
        ? editableElement.value.$el
        : editableElement.value;

      range.selectNodeContents($el);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
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
