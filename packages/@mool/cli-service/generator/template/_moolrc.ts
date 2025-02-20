import {defineConfig} from '@mooljs/cli-service';
console.log(lintOn);

export default defineConfig({
    <%_ if (lintOn&&!lintOn.includes('save')) { _%>
 lintOnSave:false,
    <%_ } _%> 
    <%_ if (windicss) { _%>
 windicss:{}
    <%_ } _%> 
})