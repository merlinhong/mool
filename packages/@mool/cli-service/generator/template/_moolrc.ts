import {defineConfig} from '@mooljs/cli-service';
export default defineConfig({
   route:{
      extensions:['vue','tsx']
   },
   open:true,
    <%_ if (lintOn&&lintOn.includes('save')) { _%>
   lintOnSave:true,
    <%_ } _%> 
})