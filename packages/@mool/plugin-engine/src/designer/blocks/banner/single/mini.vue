<template>
  <div
    class="relative min-h-[6rem] bg-surface-0 dark:bg-surface-900 flex bg-white"
  >
    <div
      class="absolute inset-0 brightness-55 bg-[url('https://primefaces.org/cdn/templates/genesis/pages/e-learning/hero-background.jpg')] bg-cover bg-center bg-no-repeat"
    ></div>
    <div class="flex w-full items-center">
      <div
        class="relative z-20 flex items-end px-2 py-1 lg:pl-2 flex-1 h-full items-center"
      >
        <div class="flex flex-col lg:items-center  gap-2">
          <div class="flex-grow">
            <h3
              class="text-[0.7rem] font-bold text-surface-0 dark:text-surface-0 leading-tight"
            >
            Create the screens your
            </h3>
            <p
              class="text-surface-0 dark:text-surface-200 text-[0.3rem] lg:mt-0.5 max-w-md"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div class="flex gap-2 self-start">
            
            <Button label="Leran More" severity="contrast" size="small" class="!text-[0.4rem] !p-[0.1rem] "/>
            <Button label="Live Demo" outlined size="small" class="!text-[0.4rem] !p-[0.1rem] "/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
