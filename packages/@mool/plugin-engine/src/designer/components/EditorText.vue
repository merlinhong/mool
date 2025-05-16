<!-- EditableText.vue -->
<template>
  <!-- <template
    
  > -->
  <template v-if="!isEditing">
    <component
      v-bind="$attrs"
      :is="Node"
      @click.stop="clickWrapper"
      @dblclick="
        () => {
          console.log(2345);

          isSelectWrapper.currWrapper == id && startEditing();
          console.log(isEditing);
        }
      "
      :class="[
        {
          '!outline-1 !outline-black !outline-dashed': isEnter,
          '!outline-2 !outline-blue-600': isSelectWrapper.currWrapper == id,
        },
        'w-auto p-2 relative z-1000',
        className,
      ]"
      @mouseenter="
        isSelectWrapper.currHover = null;
        isSelectWrapper.currWrapper != id && (isEnter = true);
      "
      @mouseleave="isEnter = false"
    >
      <div
        @click.stop="clickWrapper"
        v-if="isSelectWrapper.currWrapper == id"
        v-html="modelValue"
      ></div>
      <slot v-else>{{ modelValue }}</slot>
    </component>
  </template>
  <template v-else>
    <component
      :is="Node"
      contenteditable="true"
      @keydown.enter.prevent="finishEditing"
      ref="editableElement"
      class="!text-surface-0"
      @click.stop
      :class="[
        {
          '!outline-1 !outline-black !outline-dashed': isEnter,
          '!outline-2 !outline-blue-600': isSelectWrapper.currWrapper == id,
        },
        'w-auto p-2 relative z-1000 my-4',
        className,
      ]"
      @mouseenter="isSelectWrapper.currWrapper != id && (isEnter = true)"
      @mouseleave="isEnter = false"
    >
      {{ modelValue }}
    </component>
  </template>
  <div
    v-if="isSelectWrapper.currWrapper == id"
    class="absolute right-[-0.6rem] top-[-2rem] bg-blue-600 h-[auto] w-auto z-1000 !rounded-[3px]"
    style="transform: scale(0.6)"
  >
    <Button
      variant="text"
      class="hover:bg-blue-300!"
      size="small"
      @click.stop="startEditing"
    >
      <TSvg class="w-4 h-4" />
    </Button>
  </div>
  <!-- </template> -->
</template>

<script setup lang="ts">
import { ref, nextTick, watch, DefineComponent } from "vue";
import TSvg from "../source/svg/t.svg";
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
const isSelectWrapper = inject("activeIds", {
  value: { currWrapper: null },
}).value;
const emit = defineEmits(["update:modelValue"]);

const isEditing = ref(false);
const editableElement = ref(null);
const clickWrapper = () => {
  isSelectWrapper.currWrapper = id;
  isEnter.value = false;
  isSelectWrapper.currHover = null;
};
const startEditing = () => {
  isEditing.value = true;
  console.log(isEditing);

  nextTick(() => {
    if (editableElement.value) {
      editableElement.value.focus();
      // 选择所有文本
      const range = document.createRange();
      range.selectNodeContents(editableElement.value);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
};

const finishEditing = () => {
  if (editableElement.value) {
    emit("update:modelValue", editableElement.value.innerHTML);
  }
  isEditing.value = false;
  isSelectWrapper.currWrapper = null;
};

watch(
  () => isSelectWrapper.currWrapper,
  () => {
    isEditing.value && finishEditing();
  }
);
</script>

<style>
.editing {
  position: relative;
}
[contenteditable] {
  outline: none; /* 去掉默认的聚焦边框 */
  border: none; /* 去掉边框 */
  background-color: transparent; /* 设置背景为透明 */
}
[contenteditable]:focus {
  outline: none; /* 去掉聚焦时的边框 */
  border: none; /* 去掉聚焦时的边框 */
}
</style>
