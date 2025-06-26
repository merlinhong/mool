<template>
  <div class="w-full   overflow-hidden flex items-center ">
    <!-- 迷你工具栏 -->
    <div class="w-full h-4 bg-white p-1 flex items-center justify-between border-b">
      <!-- 左侧内容 -->
      <div class="flex items-center space-x-1">
        <!-- 简化的SVG图标 -->
        <svg viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-2 h-2 mr-1">
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="var(--p-primary-900)"
          />
        </svg>
        
        <!-- 简化的按钮 -->
        <div class="text-[4px] text-gray-600 px-1">Tab1</div>
        <div class="text-[4px] text-gray-600 px-1">Tab2</div>
        <div class="text-[4px] text-gray-600 px-1">Tab3</div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="flex items-center space-x-1">
        <div class="bg-zinc-900 rounded-[2px] text-[4px] px-1 py-1 text-white">Share</div>
        <img class="w-2 h-2 rounded-[50px] bg-gray-300" src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"/>
      </div>
    </div>
   
  </div>
</template>

<script setup>
// 这是一个纯展示组件，不需要任何逻辑
</script>