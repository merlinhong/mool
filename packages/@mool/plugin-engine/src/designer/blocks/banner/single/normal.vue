<template>
  <div
    class="relative min-h-[12rem] lg:min-h-0 h-[100vh] flex lg:flex-row flex-col z-10 overflow-hidden"
  >
    <div
      class="absolute inset-0 brightness-55 bg-[url('https://primefaces.org/cdn/templates/genesis/pages/e-learning/hero-background.jpg')] bg-cover bg-center bg-no-repeat"
    ></div>
    <!-- 暗色叠加层 -->
    <!-- <div class="absolute inset-0 "></div> -->
    <div class="relative flex-1  flex items-center justify-start">
      <div class="flex items-end justify-center h-full">
        <div data-edit="wrapper1">
          <div data-edit="title"></div>
          <div data-edit="desc"></div>
          <div
            data-edit="wrapper2"
            
          >
            <div data-edit="button1"></div>
            <div data-edit="button2"></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col items-center gap-2 absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
    >
      <span
        class="animate-bounce h-10 w-10 text-white rounded-full inline-flex items-center justify-center"
      >
        <i class="pi pi-chevron-down scale-150" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
