<template>
  <div class="card">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      :thumbnailsPosition="position"
      circular
      :showItemNavigators="true"
      :showThumbnails="false"
      :showItemNavigatorsOnHover="true"
      :showIndicators="true"
      showIndicatorsOnItem
    >
      <template #indicator="slotProps">
        <!--slotProps: { index: number, // Index of the indicator item activeIndex: number, // Current active item index as a number. tabindex: number, // Index of the element in tabbing order. }-->
        <div
          :class="{
            'bg-blue-500': slotProps.activeIndex === slotProps.index,
            'bg-gray-300': slotProps.activeIndex !== slotProps.index,
          }"
          class="w-8 h-2 rounded-10px"
          :style="{ margin: '0 4px' }"
          :tabindex="slotProps.tabindex"
        ></div>
      </template>
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%; display: block; height: 70vh"
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
const images = ref([
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg",
  },
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg",
  },
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg",
  },
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg",
  },
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg",
  },
  {
    thumbnailImageSrc: [
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    ],
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
