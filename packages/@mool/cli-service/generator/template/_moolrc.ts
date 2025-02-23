import {defineConfig} from '@mooljs/cli-service';
export default defineConfig({
    <%_ if (lintOn&&!lintOn.includes('save')) { _%>
 lintOnSave:false,
    <%_ } _%> 
    <%_ if (windicss) { _%>
 windicss:{}
    <%_ } _%> 
})