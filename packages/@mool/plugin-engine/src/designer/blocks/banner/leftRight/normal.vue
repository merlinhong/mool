<template>
  <div
    class="relative min-h-[12rem] lg:min-h-0 bg-surface-900 dark:bg-surface-0 flex lg:flex-row flex-col z-10"
  >
    <div
      class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1"
    >
      <div class="relative flex-1 z-20 flex items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div
            data-edit="wrapper1"
          >
            <div data-edit="title"></div>
            <div data-edit="subTitle"></div>
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

<script setup lang="ts"></script>
