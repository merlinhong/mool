import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import appMount from  'virturl:app-mount';
const app = appMount(createApp,App,router);
app.mount('#app');
