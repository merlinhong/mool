import {defineConfig} from '@mooljs/cli-service';
export default defineConfig({
    <%_ if (lintOn&&lintOn.includes('save')) { _%>
 lintOnSave:true,
    <%_ } _%> 
    <%_ if (windicss) { _%>
 windicss:{}
    <%_ } _%> 
})