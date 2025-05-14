<!-- EditableText.vue -->
<template>
  <div
    :class="[
      {
        'outline-1 outline-black outline-dashed': isEnter,
        'outline-2 outline-blue-600': isSelectWrapper.currWrapper == id,
      },
      'w-auto p-0.5 relative',
    ]"
    @mouseenter="isSelectWrapper.currWrapper != id && (isEnter = true)"
    @mouseleave="isEnter = false"
  >
    <template v-if="!isEditing">
      <component
        v-bind="$attrs"
        :is="tag"
        :class="[className]"
        @click.stop="clickWrapper"
        @dblclick="
          () => {
            isSelectWrapper.currWrapper == id && startEditing();
          }
        "
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
      <p
        contenteditable="true"
        @keydown.enter.prevent="finishEditing"
        ref="editableElement"
        v-html="modelValue"
        class="!text-surface-0 pb-5 pr-10"
        @click.stop
      /> 
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
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
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
const isEnter = ref(false);
const id = uuid();
const isSelectWrapper = inject("activeIds", { currWrapper: null }).value;
console.log(isSelectWrapper);
const emit = defineEmits(["update:modelValue"]);

const isEditing = ref(false);
const editableElement = ref(null);
const clickWrapper = () => {
  isSelectWrapper.currWrapper = id;
  isEnter.value = false;
};
const startEditing = () => {
  isEditing.value = true;
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
