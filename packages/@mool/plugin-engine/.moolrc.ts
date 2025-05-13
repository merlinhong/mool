import {defineConfig} from '@mooljs/cli-service';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    // windicss:{},
    configureVite:()=>{
        return {
            plugins:[tailwindcss()]
        }
    }
})