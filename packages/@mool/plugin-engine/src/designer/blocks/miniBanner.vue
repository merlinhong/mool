<template>
  <div
    class="relative min-h-[6rem] bg-surface-0 dark:bg-surface-900 flex bg-white"
  >
    <div class="flex w-full items-center">
      <div class="relative z-20 flex items-center px-2 py-1 lg:pl-2 flex-1 h-full items-center">
        <div class="flex flex-col lg:items-center w-full gap-2">
          <div class="flex-grow">
            <h3
              class="text-[0.5rem]  font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 leading-tight"
            >
              Create amazing screens today
            </h3>
            <p
              class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-[0.3rem] lg:mt-0.5 max-w-md"
            >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div class="flex gap-2 self-start">
            <Button
              label="Start"
              severity="contrast"
              size="small"
              class="!text-[0.4rem] !p-[0.3rem]"
            />
            <Button
              label="Demo"
              outlined
              size="small"
              class="!text-[0.4rem] !p-[0.3rem]"

            />
          </div>
        </div>
      </div>

      <div class="hidden lg:block flex-1 h-full">
        <img
          src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
          alt="banner"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
    <div
      class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10"
    />
    <div class="absolute lg:hidden right-0 top-0 bottom-0 w-16">
      <img
        src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
        alt="banner"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
</script>
