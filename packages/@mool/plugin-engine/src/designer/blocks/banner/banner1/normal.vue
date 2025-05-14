<template>
  <div
    class="relative min-h-[12rem] lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col bg-white"
  >
    <div
      class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1"
    >
      <div class="relative flex-1 z-20 flex items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div
            class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left"
          >
            <EditorText
              tag="div"
              class="text-xl xl:text-5xl font-bold text-primary-900 mb-4"
              v-model="props.title"
            >
            </EditorText>
            <EditorText
              tag="p"
              class="text-surface-900/90 lg:text-surface-0 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none"
              v-model="props.desc"
            ></EditorText>
            <div
              class="flex items-center gap-4 justify-center lg:justify-start"
            >
              <EditorText
                tag="Button"
                v-model="props.button[0]"
                type="button"
              ></EditorText>
              <EditorText
                tag="Button"
                v-model="props.button[1]"
                type="button"
              ></EditorText>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
        <div
          class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10"
        />
        <img
          src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
          alt="hero-1"
          class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// const emit = defineEmits(['update']);
// const updateContent = (e)=>{
//     emit('update',e)
// }
// const isEditing = ref(false);
import EditorText from "../../../components/EditorText.vue";
const prop = defineProps({
  props: {
    type: Object as Record<string, any>,
    default: {},
  },
 
});
</script>
