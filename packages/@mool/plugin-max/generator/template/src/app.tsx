import { Router, useRouter } from "vue-router";
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import { App, defineAsyncComponent } from "vue";
import { type LayoutConfig } from 'mooljs';

export const onRouterGuard = (router: Router) => { };

export const onSetupPlugins = (app: App) => {
  app.use(PrimeVue, {
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: '.app-dark',
        cssLayer: false
      }
    }
  });
};
export const layout: LayoutConfig = {
  headerRender: defineAsyncComponent(() => import('./layouts/header.tsx')),
  unAccessible: defineAsyncComponent(() => import('./layouts/403.tsx'))
}
export function getInitialState() {
  return {
    userName: 'merlinhog'
  }
}
