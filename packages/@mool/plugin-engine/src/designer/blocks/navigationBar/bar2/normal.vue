<template>
  <div class="card relative z-998">
    <Toolbar class="!bg-white !py-0">
      <template #start>
        <svg
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 1.2rem; margin-right: 1rem"
        >
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="var(--p-surface-0)"
          />
          <path
            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
            fill="transparent"
          />
        </svg>
      </template>
      <template #center>
        <div class="w-auto">
          <Tabs
            :value="tabInd"
            unstyled
            class="text-surface-0"
            @update:value="(e) => (tabInd = e)"
          >
            <TabList>
              <Tab
                data-edit="menu"
                @mouseenter="
                  () => {
                    tabInd = ind;
                    menuDrawer.classList.remove('my-fadeout');
                    menuDrawer.classList.add('my-fadein');
                    menuDrawer.classList.remove('hidden');
                    menuDrawer.classList.remove('pointer-events-none');

                    inactive = false;
                  }
                "
                @mouseleave="
                  tabInd = null;
                  inactive = true;
                "
                :class="[{ active: ind == tabInd }, 'p-5 box-border bottom']"
              >
              </Tab>
            </TabList>
          </Tabs>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Button
            label="Share"
            severity="contrast"
            size="small"
            class="!text-[10px] !text-white"
          />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            style="width: 26px; height: 26px"
          />
        </div>
      </template>
    </Toolbar>
    <div
      ref="menuDrawer"
      @mouseenter="
        () => {
          // // tabInd = ind;
          menuDrawer.classList.remove('my-fadeout');
          menuDrawer.classList.add('my-fadein');
          menuDrawer.classList.remove('hidden');
          menuDrawer.classList.remove('pointer-events-none');
          inactive = false;
        }
      "
      @mouseleave="
        tabInd = null;
        inactive = true;
      "
      @animationend="
        (e) => {
          if (e.animationName == 'outInFade') {
            e.target.classList.add('hidden');
            e.target.classList.remove('pointer-events-none');
          }
          if (e.animationName == 'fadeInOut') {
            e.target.classList.remove('hidden');
          }
        }
      "
      class="w-full h-[0] bg-surface-900 outline-1 outline-surface-0/10 text-surface-0 font-bold p-4 opacity-0 absolute top-[66px] !z-1001 hidden"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat
    </div>
  </div>
</template>

<script setup>
const tabs = ref([
  { title: "Tab 1", content: "Tab 1 Content", value: "0" },
  { title: "Tab 2", content: "Tab 2 Content", value: "1" },
  { title: "Tab 3", content: "Tab 3 Content", value: "2" },
]);
const menuDrawer = ref();
const tabInd = ref(null);
const inactive = ref(false);
const el = document.querySelector(".canvas_container");
window.addEventListener("mousemove", () => {
  if (inactive.value) {
    menuDrawer.value.classList.add("pointer-events-none");
    menuDrawer.value.classList.add("my-fadeout");
    menuDrawer.value.classList.remove("my-fadein");
  }
});
</script>
<style>
.bottom::after {
  content: "";
  display: block;
  position: absolute;
  width: 3rem;
  height: 1px;
  background: black;
  bottom: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.5s ease;
}
.active {
  &::after {
    transform: scaleX(1);
  }
}

/* 定义淡入淡出动画 */
@keyframes fadeInOut {
  0% {
    height: 0;

    opacity: 0; /* 完全透明 */
  }
  100% {
    opacity: 1; /* 完全显示 */
    height: 40vh;
  }
}
/* 定义淡入淡出动画 */
@keyframes outInFade {
  0% {
    height: 40vh;
    opacity: 1;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}
.my-fadein {
  display: block !important;
  opacity: 1;
  height: 40vh;
  animation: fadeInOut 0.8s; /* 动画持续3秒并无限循环 */
}
.my-fadeout {
  height: 0;
  opacity: 0;
  animation: outInFade 0.8s; /* 动画持续3秒并无限循环 */
}
.modal-overlay {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    z-index: 999; /* 确保遮罩层在最上层 */
  }
}

.my-fadeout {
  /* visibility: hidden; */
}
</style>
