<template>
  <div class="card relative z-1001">
    <Toolbar class="!bg-white !py-0 ">
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
        <div
          data-edit="menu"

          :class="['p-5 box-border bottom']"
        ></div>
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
          elRef.classList.add('active');
          menuDrawer.classList.remove('my-fadeout');
          menuDrawer.classList.add('my-fadein');
          menuDrawer.classList.remove('hidden');
          menuDrawer.classList.remove('pointer-events-none');
          inactive = false;
          el?.classList.add('modal-overlay');
        }
      "
      @mouseleave="
        tabInd = null;
        inactive = true;
        elRef.classList.remove('active');
        el?.classList.remove('modal-overlay');
      "
      @animationend="
        (e) => {
          if (e.animationName == 'outInFade') {
            e.target?.classList.add('hidden');
            e.target?.classList.remove('pointer-events-none');
          }
          if (e.animationName == 'fadeInOut') {
            e.target?.classList.remove('hidden');
          }
        }
      "
      class="w-full h-[0] bg-white outline-1 overflow-hidden outline-surface-0/10 text-surface-0 font-bold absolute top-[66px] !z-2000 hidden"
    >
      <div
        class="flex p-4"
        :class="[{ 'content-fadein': !inactive, 'content-fadeout': inactive }]"
      >
        <div class="!w-[20%]">
          <div v-for="item in cities" class="w-full hover:!bg-surface-900">
            <a
              v-if="item.root"
              class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase"
              style="border-radius: 2rem"
            >
              <span>{{ item.label }}</span>
            </a>
            <a
              v-else-if="!item.image"
              class="flex items-center p-4 cursor-pointer mb-2 gap-3"
            >
              <span
                class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12"
              >
                <i :class="[item.icon, 'text-lg']"></i>
              </span>
              <span class="inline-flex flex-col gap-1">
                <span class="font-bold text-lg">{{ item.label }}</span>
                <span class="whitespace-nowrap">{{ item.subtext }}</span>
              </span>
            </a>
            <div v-else class="flex flex-col items-start gap-4 p-2">
              <img alt="megamenu-demo" :src="item.image" class="w-full" />
              <span>{{ item.subtext }}</span>
              <Button :label="item.label" outlined />
            </div>
          </div>
        </div>
        <div class="!w-[20%]">
          <div v-for="item in cities" class="w-full hover:!bg-surface-900">
            <a
              v-if="item.root"
              class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase"
              style="border-radius: 2rem"
            >
              <span>{{ item.label }}</span>
            </a>
            <a
              v-else-if="!item.image"
              class="flex items-center p-4 cursor-pointer mb-2 gap-3"
            >
              <span
                class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12"
              >
                <i :class="[item.icon, 'text-lg']"></i>
              </span>
              <span class="inline-flex flex-col gap-1">
                <span class="font-bold text-lg">{{ item.label }}</span>
                <span class="whitespace-nowrap">{{ item.subtext }}</span>
              </span>
            </a>
            <div v-else class="flex flex-col items-start gap-4 p-2">
              <img alt="megamenu-demo" :src="item.image" class="w-full" />
              <span>{{ item.subtext }}</span>
              <Button :label="item.label" outlined />
            </div>
          </div>
        </div>
        <div class="!w-[20%]">
          <div v-for="item in cities" class="w-full hover:!bg-surface-900">
            <a
              v-if="item.root"
              class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase"
              style="border-radius: 2rem"
            >
              <span>{{ item.label }}</span>
            </a>
            <a
              v-else-if="!item.image"
              class="flex items-center p-4 cursor-pointer mb-2 gap-3"
            >
              <span
                class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12"
              >
                <i :class="[item.icon, 'text-lg']"></i>
              </span>
              <span class="inline-flex flex-col gap-1">
                <span class="font-bold text-lg">{{ item.label }}</span>
                <span class="whitespace-nowrap">{{ item.subtext }}</span>
              </span>
            </a>
            <div v-else class="flex flex-col items-start gap-4 p-2">
              <img alt="megamenu-demo" :src="item.image" class="w-full" />
              <span>{{ item.subtext }}</span>
              <Button :label="item.label" outlined />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const selectedCity = ref();
const cities = ref([
  { label: "Features", icon: "pi pi-list", subtext: "Subtext of item" },
  { label: "Customers", icon: "pi pi-users", subtext: "Subtext of item" },
  { label: "Case Studies", icon: "pi pi-file", subtext: "Subtext of item" },
]);

const menuDrawer = ref();
const tabInd = ref<number|null>(null);
const inactive = ref(false);
const el = document.querySelector(".canvas_container");

const AbortSignal = new AbortController();
window.addEventListener(
  "mousemove",
  () => {
    if (inactive.value) {
      menuDrawer.value.classList.add("pointer-events-none");
      menuDrawer.value.classList.add("my-fadeout");
      menuDrawer.value.classList.remove("my-fadein");
    }
  },
  { signal: AbortSignal.signal }
);
onUnmounted((() => {
  AbortSignal.abort();
}))
const elRef = ref();
const mouseenterMenu = (e:HTMLElement, ind:number) => {
  tabInd.value = ind;
  e.classList.add("active");
  elRef.value = e;
  menuDrawer.value.classList.remove("my-fadeout");
  menuDrawer.value.classList.add("my-fadein");
  menuDrawer.value.classList.remove("hidden");
  menuDrawer.value.classList.remove("pointer-events-none");
  inactive.value = false;
  el?.classList.add("modal-overlay");
};
const mouseleaveMenu = (e:HTMLElement, ind:number) => {
  e.classList.remove("active");
  elRef.value.classList.remove("active");
  tabInd.value = null;
  inactive.value = true;
  el?.classList.remove("modal-overlay");
};
defineExpose({
  menu: [mouseenterMenu, mouseleaveMenu],
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

    /* 完全透明 */
  }

  100% {
    /* 完全显示 */
    height: 40vh;
  }
}

/* 定义淡入淡出动画 */
@keyframes outInFade {
  0% {
    height: 40vh;
  }

  100% {
    height: 0;
  }
}
/* 定义淡入淡出动画 */
@keyframes outInFadeContent {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
/* 定义淡入淡出动画 */
@keyframes fadeInOutContent {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
.content-fadein {
  opacity: 1;
  animation: fadeInOutContent 0.8s;
}
.content-fadeout {
  opacity: 0;
  animation: outInFadeContent 0.8s;
}
.my-fadein {
  display: block;
  height: 40vh;
  animation: fadeInOut 0.8s;
  /* 动画持续3秒并无限循环 */
}

.my-fadeout {
  height: 0;
  /* opacity: 0; */
  animation: outInFade 0.8s;
  /* 动画持续3秒并无限循环 */
}

.modal-overlay {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明黑色背景 */
    z-index: 100;
    /* 确保遮罩层在最上层 */
  }
}

.my-fadeout {
  /* visibility: hidden; */
}
</style>
