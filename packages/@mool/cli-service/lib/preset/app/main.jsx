import { createApp,defineComponent } from 'vue';
import router,{RouterView} from '@mooljs/cli-service/lib/preset/app/router';
import appMount from  'virturl:app-mount';
const App = defineComponent({
  setup() {
    return () => (
      <RouterView v-slot={({ Component,route }) => (
        <>
          {route.meta.keepAlive ? (
            <keep-alive>
              <component is={Component} key={route.path} />
            </keep-alive>
          ) : (
            <component is={Component} />
          )}
        </>
      )} />
    );
  },
});
const app = appMount(createApp,App,router);
app.mount('#app');
