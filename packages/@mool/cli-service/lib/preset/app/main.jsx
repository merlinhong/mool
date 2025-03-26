import { createApp, defineComponent,KeepAlive } from 'vue';
import router, { RouterView,routes } from '@mooljs/cli-service/lib/preset/app/router';
import appMount from 'virturl:app-mount';
const App = defineComponent({
  setup() {
    return () => (
      <RouterView>
        {{
          default: ({ Component, route }) => (
            <>
              {Component&&(route.meta.keepAlive ? (
                <KeepAlive>
                  {{default:()=>(
                    <Component key={route.path}/>
                  )}}
                </KeepAlive>
              ) : (
                <Component/>
              ))}
            </>
          )
        }}
      </RouterView>
    );
  },
});
const app = appMount(createApp, App, router);
app.mount('#app');

export {routes};