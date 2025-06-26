<template>
  <div
    class="relative min-h-[12rem] bg-surface-0 dark:bg-surface-900 flex bg-white"
  >
    <div class="flex w-full items-center">
      <div
        class="relative z-20 flex items-center px-2 py-1 lg:pl-2 flex-1 h-full items-center"
      >
        <div class="flex flex-col lg:items-center w-full gap-2">
          <div class="flex-grow">
            <h3
              class="text-[1.2rem] font-bold text-surface-900 dark:text-surface-0 leading-tight"
            >
              Create amazing screens today
            </h3>
            <p
              class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-[0.8rem] lg:mt-0.5 max-w-md"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div class="flex gap-2 self-start">
            <Button label="Start" severity="contrast" size="small" />
            <Button label="More" outlined size="small" />
          </div>
        </div>
      </div>

      <div class="hidden lg:block flex-1 h-full">
        <img
          src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
          alt="banner"
          class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]"
        />
      </div>
    </div>
  </div>
</template>

<script setup></script>
