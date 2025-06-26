<template>
  <div
    class="relative min-h-[12rem] bg-surface-0 dark:bg-surface-900 flex bg-white"
  >
    <div
      class="absolute inset-0 brightness-55 bg-[url('https://primefaces.org/cdn/templates/genesis/pages/e-learning/hero-background.jpg')] bg-cover bg-center bg-no-repeat"
    ></div>
    <div class="flex w-full items-center">
      <div
        class="relative z-20 flex items-end px-2 py-1 lg:pl-2 flex-1 h-full items-center"
      >
        <div class="flex flex-col lg:items-center w-full gap-2 m-4">
          <div class="flex-grow">
            <h3
              class="text-[1.2rem] font-bold text-surface-0 lg:text-surface-0 dark:text-surface-0 leading-tight"
            >
              Create amazing screens today
            </h3>
            <p
              class="text-surface-0/90 lg:text-surface-0 dark:text-surface-200 text-[0.8rem] lg:mt-0.5 max-w-md"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div class="flex gap-2 self-start">
            <Button label="Leran More" severity="contrast" size="small" />
            <Button label="Live Demo" outlined size="small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
