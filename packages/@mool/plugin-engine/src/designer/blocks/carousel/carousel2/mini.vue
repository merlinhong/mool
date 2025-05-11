<template>
  <div class="card">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="1"
      :thumbnailsPosition="position"
      containerStyle="max-width: 640px"
      :circular="true"
      :showItemNavigators="false"
      :showThumbnailNavigators="false"
      :showThumbnails="false"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%; display: block;"
          :style="{height}"
         
        />
      </template>
      <template #thumbnail="slotProps">
        <div class="grid gap-4 justify-center">
          <img
            :src="slotProps.item.thumbnailImageSrc"
            :alt="slotProps.item.alt"
            style="width: 100%; display: block"
          />
        </div>
      </template>
    </Galleria>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
defineProps({
    height:{
        type:String,
        default:'20vh'
    }
})
const images = ref([
  {
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg",
  },
  {
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg",
  },
]);
const position = ref("bottom");
const responsiveOptions = ref([
  {
    breakpoint: "1300px",
    numVisible: 4,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
  },
]);
</script>
