import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import GlobalLayOut from '/src/global.tsx';

const GlobalApp = GlobalLayOut({router,Root:App});
createApp(GlobalApp).use(router).mount('#app');

