<template>
  <div class="propSetting flex">
    <el-scrollbar v-if="Current" :height="$props.scrollHeight" style="width: 100%;">
      <el-tabs v-model="activeName" style="height: 100%;">
        <el-tab-pane label="属性" name="0">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" style="padding: 0 10px">
              <template #title> 基础信息 </template>
              <BasicForm class="form-design-config" :config="basicConfig" v-model:data="Current" />
              <el-collapse v-if="Current.componentName != 'ElTable'">
                <el-collapse-item name="1" style="padding: 0 10px">
                  <template #title> 更多类型选项 </template>
                  <BasicForm class="form-design-config" :config="moreConfig" v-model:data="Current" />
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>

            <el-collapse-item name="2" style="padding: 0 10px" v-if="!Current.children">
              <template #title> 其他信息 </template>
              <BasicForm class="form-design-config" :config="otherConfig" v-model:data="Current" />
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane label="样式" name="1">
          <div style="padding: 9px" class="flex justify-around">
            <el-button @click="editGlobalStyle" size="small">编辑全局样式</el-button>
            <el-button type="primary" @click="editCurrentStyle" size="small">编辑当前样式</el-button>
          </div>
          <el-collapse v-model="styleActiveName">
            <el-collapse-item name="0" style="padding: 0 10px">
              <template #title> 布局 </template>
              <div style="margin-bottom: 10px">
                <div style="display: flex; justify-content: space-between" @click.capture="setLayout">
                  排布
                  <svg :style="{ fill: layout == 'block' ? 'green' : '' }" t="1723693979367" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6415" width="25"
                    height="25" data-id="block">
                    <path
                      d="M170.666667 149.333333h682.666666c46.933333 0 85.333333 38.4 85.333334 85.333334v554.666666c0 46.933333-38.4 85.333333-85.333334 85.333334H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333334V234.666667c0-46.933333 38.4-85.333333 85.333334-85.333334z m0 64c-12.8 0-21.333333 8.533333-21.333334 21.333334v554.666666c0 12.8 8.533333 21.333333 21.333334 21.333334h682.666666c12.8 0 21.333333-8.533333 21.333334-21.333334V234.666667c0-12.8-8.533333-21.333333-21.333334-21.333334H170.666667z m106.666666 85.333334h469.333334c23.466667 0 42.666667 19.2 42.666666 42.666666v341.333334c0 23.466667-19.2 42.666667-42.666666 42.666666H277.333333c-23.466667 0-42.666667-19.2-42.666666-42.666666V341.333333c0-23.466667 19.2-42.666667 42.666666-42.666666z"
                      p-id="6416" data-id="block"></path>
                  </svg>
                  <svg :style="{ fill: layout == 'flex' ? 'green' : '' }" t="1723694026816" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7438" width="25"
                    height="25" data-id="flex">
                    <path
                      d="M170.666667 149.333333h682.666666c46.933333 0 85.333333 38.4 85.333334 85.333334v554.666666c0 46.933333-38.4 85.333333-85.333334 85.333334H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333334V234.666667c0-46.933333 38.4-85.333333 85.333334-85.333334z m0 64c-12.8 0-21.333333 8.533333-21.333334 21.333334v554.666666c0 12.8 8.533333 21.333333 21.333334 21.333334h682.666666c12.8 0 21.333333-8.533333 21.333334-21.333334V234.666667c0-12.8-8.533333-21.333333-21.333334-21.333334H170.666667z m85.333333 85.333334h85.333333c23.466667 0 42.666667 19.2 42.666667 42.666666v341.333334c0 23.466667-19.2 42.666667-42.666667 42.666666h-85.333333c-23.466667 0-42.666667-19.2-42.666667-42.666666V341.333333c0-23.466667 19.2-42.666667 42.666667-42.666666z m213.333333 0h85.333334c23.466667 0 42.666667 19.2 42.666666 42.666666v341.333334c0 23.466667-19.2 42.666667-42.666666 42.666666h-85.333334c-23.466667 0-42.666667-19.2-42.666666-42.666666V341.333333c0-23.466667 19.2-42.666667 42.666666-42.666666z m213.333334 0h85.333333c23.466667 0 42.666667 19.2 42.666667 42.666666v341.333334c0 23.466667-19.2 42.666667-42.666667 42.666666h-85.333333c-23.466667 0-42.666667-19.2-42.666667-42.666666V341.333333c0-23.466667 19.2-42.666667 42.666667-42.666666z"
                      p-id="7439" data-id="flex"></path>
                  </svg>
                  <svg :style="{ fill: layout == 'inline' ? 'green' : '' }" t="1723694049381" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8500" width="20"
                    height="20" data-id="inline">
                    <path
                      d="M0 256h1024v512H0V256z m85.333333 85.333333v341.333334h853.333334V341.333333H85.333333zM0 0h1024v85.333333H0V0z m981.333333 42.666667L938.666667 85.333333V0l42.666666 42.666667zM0 938.666667h1024v85.333333H0v-85.333333z m981.333333 42.666666l-42.666666 42.666667v-85.333333l42.666666 42.666666z"
                      p-id="8501" data-id="inline"></path>
                  </svg>
                  <svg :style="{ fill: layout == 'hidden' ? 'green' : '' }" t="1723694092565" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9482" width="25"
                    height="25" data-id="hidden">
                    <path
                      d="M253.6 679.2l109.6-109.6C356 552 352 532.8 352 512c0-88 72-160 160-160 20.8 0 40 4 57.6 11.2l82.4-82.4C607.2 264.8 560 256 512 256c-168 0-329.6 106.4-384 256 24 65.6 68.8 123.2 125.6 167.2z"
                      p-id="9483" data-id="hidden"></path>
                    <path
                      d="M416 512v4.8L516.8 416H512c-52.8 0-96 43.2-96 96zM770.4 344.8l163.2-163.2L888 136l-753.6 753.6 45.6 45.6 192.8-192.8A390.4 390.4 0 0 0 512 768c167.2 0 330.4-106.4 384.8-256-24-65.6-69.6-123.2-126.4-167.2zM512 672c-20 0-40-4-57.6-11.2l53.6-53.6h4.8c52.8 0 96-43.2 96-96v-4.8l53.6-53.6C668 472 672 492 672 512c0 88-72 160-160 160z"
                      p-id="9484" data-id="hidden"></path>
                  </svg>
                </div>
              </div>
              <div v-if="setFlex">
                <el-form-item label="主轴方向"><el-select size="small" v-model="flexDirection"
                    @change="changeFlex(1)"><el-option v-for="item in ['row', 'row-reverse', 'column', 'column-reverse']"
                      :value="item" :label="item"></el-option></el-select></el-form-item>
                <el-form-item label="主轴对齐"><el-select size="small" v-model="justifyContent"
                    @change="changeFlex(2)"><el-option
                      v-for="item in ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']" :value="item"
                      :label="item"></el-option></el-select></el-form-item>
                <el-form-item label="辅轴对齐"><el-select size="small" v-model="alignItems" @change="changeFlex(3)"><el-option
                      v-for="item in ['flex-start', 'flex-end', 'center', 'baseline', 'stretch']" :value="item"
                      :label="item"></el-option></el-select></el-form-item>
                <el-form-item label="换行"><el-select size="small" v-model="flexWrap" @change="changeFlex(4)"><el-option
                      v-for="item in ['nowrap', 'wrap', 'wrap-reverse']" :value="item"
                      :label="item"></el-option></el-select></el-form-item>
              </div>
            </el-collapse-item>

            <el-collapse-item name="1" style="padding: 0 10px">
              <template #title> 边距 </template>
              <div style="display: flex; justify-content: space-evenly">
                <svg @click="setMargin" style="cursor: pointer" t="1723626368440" class="icon" viewBox="0 0 1024 1024"
                  version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14276" width="80" height="80">
                  <path
                    d="M681.179429 321.682286h-336.457143a14.628571 14.628571 0 0 0-14.628572 14.628571v336.457143c0 8.045714 6.582857 14.628571 14.628572 14.628571h336.457143a14.628571 14.628571 0 0 0 14.628571-14.628571v-336.457143a14.628571 14.628571 0 0 0-14.628571-14.628571z m-22.601143 327.241143h-292.571429v-292.571429h292.571429v292.571429zM156.086857 591.433143a7.314286 7.314286 0 0 0 11.922286-5.778286V550.765714h117.394286a7.314286 7.314286 0 0 0 7.314285-7.314285v-51.2a7.314286 7.314286 0 0 0-7.314285-7.314286H168.009143v-38.619429a7.314286 7.314286 0 0 0-11.922286-5.778285l-80.164571 71.606857a7.314286 7.314286 0 0 0 0 11.483428l80.164571 67.876572zM593.115429 867.913143a7.314286 7.314286 0 0 0-5.778286-11.922286h-34.962286v-117.394286a7.314286 7.314286 0 0 0-7.314286-7.314285h-51.2a7.314286 7.314286 0 0 0-7.314285 7.314285v117.394286h-38.619429a7.314286 7.314286 0 0 0-5.851428 11.922286l71.68 80.164571a7.314286 7.314286 0 0 0 11.483428 0l67.876572-80.164571zM434.468571 151.552a7.314286 7.314286 0 0 0 5.851429 11.922286h34.889143V280.868571a7.314286 7.314286 0 0 0 7.314286 7.314286h51.2a7.314286 7.314286 0 0 0 7.314285-7.314286V163.474286h38.692572a7.314286 7.314286 0 0 0 5.705143-11.922286L513.828571 71.387429a7.314286 7.314286 0 0 0-11.483428 0L434.468571 151.552zM868.059429 440.466286a7.314286 7.314286 0 0 0-11.922286 5.778285v34.889143H738.742857a7.314286 7.314286 0 0 0-7.314286 7.314286v51.2a7.314286 7.314286 0 0 0 7.314286 7.314286h117.394286v38.765714a7.314286 7.314286 0 0 0 11.922286 5.705143l80.091428-71.68a7.314286 7.314286 0 0 0 0-11.483429l-80.091428-67.803428z"
                    fill="#000000" fill-opacity=".651" p-id="14277"></path>
                </svg>
                <svg @click="setPadding" style="cursor: pointer" t="1723626415189" class="icon" viewBox="0 0 1024 1024"
                  version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16479" width="80" height="80">
                  <path
                    d="M882.614857 115.346286H142.409143a32.182857 32.182857 0 0 0-32.182857 32.182857v740.205714c0 17.773714 14.409143 32.182857 32.182857 32.182857h740.205714a32.182857 32.182857 0 0 0 32.182857-32.182857V147.529143a32.182857 32.182857 0 0 0-32.182857-32.182857z m-15.506286 754.102857h-708.022857v-708.022857h708.022857v708.022857z"
                    fill="#000000" fill-opacity=".651" p-id="16480"></path>
                  <path
                    d="M356.059429 440.466286a7.314286 7.314286 0 0 0-11.922286 5.778285v34.889143H226.742857a7.314286 7.314286 0 0 0-7.314286 7.314286v51.2a7.314286 7.314286 0 0 0 7.314286 7.314286h117.394286v38.765714a7.314286 7.314286 0 0 0 11.922286 5.705143l80.091428-71.68a7.314286 7.314286 0 0 0 0-11.483429l-80.091428-67.803428zM442.148571 667.940571a7.314286 7.314286 0 0 0 5.778286 11.922286H482.742857V797.257143a7.314286 7.314286 0 0 0 7.314286 7.314286h51.2a7.314286 7.314286 0 0 0 7.314286-7.314286V679.862857h38.765714a7.314286 7.314286 0 0 0 5.705143-11.922286l-71.68-80.091428a7.314286 7.314286 0 0 0-11.483429 0l-67.803428 80.091428zM585.435429 351.451429a7.314286 7.314286 0 0 0-5.705143-11.849143h-34.962286V222.208a7.314286 7.314286 0 0 0-7.314286-7.314286h-51.2a7.314286 7.314286 0 0 0-7.314285 7.314286v117.394286H440.32a7.314286 7.314286 0 0 0-5.778286 11.849143l71.68 80.164571a7.314286 7.314286 0 0 0 11.483429 0l67.803428-80.164571zM668.086857 591.433143a7.314286 7.314286 0 0 0 11.922286-5.778286V550.765714h117.394286a7.314286 7.314286 0 0 0 7.314285-7.314285v-51.2a7.314286 7.314286 0 0 0-7.314285-7.314286H680.009143v-38.619429a7.314286 7.314286 0 0 0-11.922286-5.778285l-80.164571 71.606857a7.314286 7.314286 0 0 0 0 11.483428l80.164571 67.876572z"
                    fill="#000000" fill-opacity=".651" p-id="16481"></path>
                </svg>
              </div>
            </el-collapse-item>

            <el-collapse-item name="2" style="padding: 0 10px">
              <template #title> 尺寸 </template>
              <BasicForm class="form-design-config" :config="sizeConfig" v-model:data="Current" style="padding: 10px" />
            </el-collapse-item>
            <el-collapse-item name="3" style="padding: 0 10px">
              <template #title> 文本 </template>
              <BasicForm class="form-design-config" :config="textConfig" v-model:data="Current" style="padding: 10px" />
              <el-divider style="margin: 0"></el-divider>
              <BasicForm class="form-design-config" :config="textExtraConfig" v-model:data="Current"
                style="padding: 10px" />
            </el-collapse-item>
            <el-collapse-item name="4" style="padding: 0 10px">
              <template #title> 背景 </template>
              <BasicForm class="form-design-config" :config="bgConfig" v-model:data="Current" />
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane label="高级" name="2">
          <el-collapse v-model="eventActiveName">
            <el-collapse-item name="0" style="padding: 0 10px">
              <template #title> 事件绑定 </template>

              <div style="padding: 9px; display: flex; justify-content: space-between">
                <el-button round>添加自定义事件</el-button>

                <el-tooltip :show-arrow="false" placement="bottom-end" effect="light" raw-content>
                  <template #content>
                    <div v-for="item in eventDesc" style="font-size: 16px; padding: 5px; cursor: pointer"
                      @click="bindEvent(item.val)">
                      {{ item.val + item.desc }}
                    </div>
                  </template>
                  <el-button round>绑定事件<i-ep-ArrowDown></i-ep-ArrowDown></el-button>
                </el-tooltip>
              </div>

              <div>
                <div v-if="!currEventMap.length">
                  点击<strong style="color: green">绑定事件</strong>为画布中所选元素增加事件
                </div>
                <div v-else v-for="item in currEventMap" style="border-top: 1px solid #f1f1f1; font-size: 16px">
                  <div>
                    {{ item }}
                    {{ eventDesc.find((_item) => _item.val == item)?.desc }}
                  </div>
                  <div style="color: green">{{ Current.props && Current.props[item].value }}</div>
                </div>
              </div>
            </el-collapse-item>

            <el-collapse-item name="1" style="padding: 0 10px">
              <template #title> 高级配置 </template>

              <BasicForm class="form-design-config" :config="seniorConfig" v-model:data="Current" />
            </el-collapse-item>
            <el-collapse-item name="2" style="padding: 0 10px">
              <template #title> 全局弹窗配置 </template>

              <ul v-if="!!PageConfig.popup?.length">
                <li v-for="(item, index) in PageConfig.popup"
                  class="p-2 border-b border-solid border-gray-100 flex justify-between">
                  {{ item.props.title }}
                  <div><i-ep-edit @click="editPopup(index)" /> <i-ep-delete @click="deletePopup(index)" /></div>
                </li>
              </ul>
              <div>
                <el-button @click="addPopup()">添加弹窗</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
    <div v-else style="color: #777" class="m-auto w-fit">点击组件进行属性设置</div>
  </div>
  <el-dialog v-model="styleDialogVisible" :title="dialogTitle" width="800">
    <div id="cssEditor_container" style="width: 560px; height: 400px; border: 1px solid #c9c8c8"></div>
    <template #footer>
      <div>
        <el-button type="primary" @click="saveStyle">保存</el-button>
        <el-button @click="styleDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="optionDialogVisible" :title="'编辑' + editTitleRef" width="800">
    <div id="optionEditor_container" style="width: 560px; height: 400px; border: 1px solid #c9c8c8"></div>
    <template #footer>
      <div>
        <el-button type="primary" @click="saveOption">保存</el-button>
        <el-button @click="optionDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog destroy-on-close v-model="renderDialogVisible" title="拖拽渲染schema" width="1000" :close-on-click-modal="false">
    <!-- <div id="renderEditor_container" style="width: 560px; height: 400px; border: 1px solid #c9c8c8"></div> -->
    <el-container :style="{ height: 'calc(50vh - 116px)' }" class="justify-between">
      <ul class="base-component">
        <li v-for="item in renderColumnCompLi" :key="item.dataType" :data-type="item.dataType" class="component-item">
          <iEpDocument width="15px" />
          <span>{{ item.text }}</span>
        </li>
      </ul>
      <BasicCanvas ref="canvasRef" :pageConfig="renderSchema"
        :customStyle="{ margin: '20px', backgroundColor: '#f1f1f1' }"
        @active="activeCurrent" />
      <el-aside>
        <config-plane scrollHeight="40vh" style="height: fit-content" :is-show-config="true" v-model:current="currentConf"
          v-model:pageConfig="renderSchema" />
      </el-aside>
    </el-container>
    <template #footer>
      <div>
        <el-button type="primary" @click="saveRender">保存</el-button>
        <el-button @click="renderDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-drawer title="设置外边距" v-model="marginVisible" :width="100" :height="400" direction="rtl" :size="250">
    <el-form-item label="外边距">
      <el-input v-model="marginValue" @input="changeMargin"></el-input>
    </el-form-item>
    <el-radio-group v-model="marginValue" @change="changeMargin">
      <el-radio-button v-for="item in ['auto', 0, 10, 20, 40, 60, 100, 140, 200]" :label="item">{{
        item
      }}</el-radio-button>
    </el-radio-group>
  </el-drawer>
  <el-drawer v-model="setTableVisible" title="设置表格" direction="rtl" :size="250" :modal="false" :z-index="1000"
    style="margin-right: 15%" :lock-scroll="false">
    <BasicForm class="form-design-config" :config="tableConfig" v-model:data="Current.props.columns[currColIndex]"
      v-if="Current.props?.columns && currColIndex !== null" />
  </el-drawer>
  <el-drawer v-model="setDialogVisible" title="设置弹窗" direction="rtl" :size="250" :modal="false" :z-index="1000"
    style="margin-right: 15%" :lock-scroll="false">
    <BasicForm class="form-design-config" :config="dialogConfig" v-model:data="pageConfig.popup[currPopupIndex ?? 0]"
      v-if="pageConfig.popup && currPopupIndex !== null" />
  </el-drawer>
  <!-- 数据请求设置 -->
  <el-dialog v-model="fetchDataDialogVisible" title="fetch请求设置" width="800">
    <el-form style="width: 100%">
      <el-row :gutter="100"> </el-row>
      <el-row>
        <div id="fetch_editor_container" style="width: 100%; height: 200px"></div>
      </el-row>
      <el-row><el-col><el-form-item label="Content-Type" style="width: 90%; margin-top: 10px">
            <el-select v-model="defaultContentType" placeholder="选择" clearable :multiple="false">
              <el-option v-for="item in contentType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> </el-form-item></el-col></el-row>

      <el-row><el-col><el-form-item label="请求类型" style="width: 60%">
            <el-radio-group v-model="defaultRequestType" clearable :multiple="false">
              <el-radio v-for="item in requesttype" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item></el-col></el-row>
    </el-form>
    <template #footer>
      <div>
        <el-button type="primary" @click="saveFetchData">保存</el-button>
        <el-button @click="fetchDataDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 表单规则校验 -->
  <el-dialog v-model="ruleDialogVisible" title="表单校验规则设置" width="800">
    <div id="rules_editor_container" style="width: 100%; height: 450px"></div>
    <template #footer>
      <div>
        <el-button type="primary" @click="saveRules">保存</el-button>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref, PropType, toRaw, watch, onMounted, nextTick, Ref, resolveComponent, h, } from "vue";
import { BasicFormConfig, Col, Page } from "@/mool";
import { initEditor, renderColumnCompLi, camelize,hyphenate, type MonacoEditor } from "@/mool/utils";
import { useDrag } from "@/mool/hooks";
import { computed } from "vue";
import { defineComponent } from "vue";
import { Pagination } from "@/mool/types/BasicForm";
import BasicForm from "./BasicForm.vue";
import { AxiosRequestConfig } from "axios";
import ConfigPlane from "../components/settings.vue";

import BasicCanvas from "./BasicCanvas.vue";

import * as _ from "lodash-es";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 渲染schema
const renderSchema = ref<Page>({
  ref: {},
  lifeCycles: {},
  state: {},
  methods: {},
  componentName: "div",
  props: {
    style: {
      backgroundColor: "#fff",
      width: "100%",
      height: "100%",
    },
  },
  children: [],

  id: "55ty4epk",

  css: "",
});

const renderDialogVisible = ref(false);
const currentConf = ref<Col | null>(null);
const activeCurrent = (val: Col) => {
  currentConf.value = val;
};
// 动态加载 prettier 和 parser-babel
const marginValue = ref();
const marginType = ref("left");
const activeName = ref("0");
const activeNames = ref(["1", "2"]);
const styleActiveName = ref(["0", "1", "2", "3", "4"]);
const eventActiveName = ref(["0", "1"]);
const dialogTitle = ref("Css编辑");
const styleDialogVisible = ref(false);
const optionDialogVisible = ref(false);
const fetchDataDialogVisible = ref(false);
const ruleDialogVisible = ref(false);
const marginVisible = ref(false);
const pageSchema = ref<string>("");
const cssText = ref<string | null>("");
const editTitleRef = ref<string>("option");
// 设置表格drawer变量
const setTableVisible = ref(false);
// 设置弹窗drawer变量
const setDialogVisible = ref(false);
// 布局ref变量
const flexDirection = ref("row");
const flexWrap = ref("");
const justifyContent = ref("");
const alignItems = ref("stretch");
// 循环默认索引变量名&迭代变量名
const loopArgs = ref([]);
const loopVar = ref("");
// 事件描述
const eventDesc = ref([
  { val: "onClick", desc: "鼠标单机时触发" },
  { val: "onChange", desc: "值被改变时触发" },
]);
const currParamsConf = ref<AxiosRequestConfig>({
  url: "",
  headers: {},
  method: "",
  data: {},
});

const Current = defineModel<Col>("current", {
  required: false,
  default: () => ({ componentName: "" }),
});
const PageConfig = defineModel<Page>("pageConfig", {
  required: true,
});
let optionIndex: number | null = null;

let daterangeIndex: number = 0;
let datetimerangeIndex: number = 0;

let remove: ReturnType<typeof useDrag> | null = null;

// 分页器配置
const pagerConfig: { order: number | null; value: Pagination } = {
  order: null,
  value: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 50, 100, 200],
    small: false,
    background: false,
    disabled: false,
    layout: "->,total, sizes, prev, pager, next, jumper",
    total: 40,
    params: { currentPage: ["pageNo", 1], pageSize: ["pageSize", 10] },
  },
};

const formColumns = ref<any[]>([]);
const findComp = () => {
  formColumns.value = [];
  findId(PageConfig.value as Page);
  function findId(list: Page | Col) {
    list.children?.forEach((child, index, li) => {
      if (child.componentName == "ElFormItem") {
        if (child.children?.length == 1) {
          if (formColumns.value.find((item) => item.title == child.props?.label)) {
            return;
          }
          const checked = Current.value.props?.columns?.some((item) => item.dataIndex == (child.children ?? [])[0].key);
          formColumns.value.push({
            title: child.props?.label,
            dataIndex: child.children[0].key,
            checked,
          });
        }
      } else {
        findId(child as Col);
      }
    });
  }
};
// 请求入参媒体类型

const contentType = [
  { label: "application/x-www-form-urlencoded", value: 0 },

  { label: "application/json", value: 1 },

  { label: "multipart/form-data", value: 2 },
];
const defaultContentType = ref(1);
// 请求类型&默认请求类型
const defaultRequestType = ref(1);
const requesttype = [
  { label: "GET", value: 0 },

  { label: "POST", value: 1 },
];
const fetchData = computed<typeof Current.value.fetchData>(() => {
  return {
    order: null,
    params: {
      method: requesttype.find((item) => item.value == defaultRequestType.value)?.label,
      headers: {
        "content-type": contentType.find((item) => item.value == defaultContentType.value)?.label,
      },
    },
  };
});
const saveFetchData = () => {
  const result = new Function(`return ${pageSchema.value.split("=")[1]}`)() ?? {};

  let params = {
    ...result,
    ...fetchData.value?.params,
  };
  currParamsConf.value = params;
  console.log(params);

  fetchDataDialogVisible.value = false;

  if (Current.value.componentName == "ElTable" && fetchData.value) {
    if (!Current.value.fetchData) {
      if (fetchData.value?.order !== null) {
        fetchData.value.order++;
        PageConfig.value.ref.searchParams.value[fetchData.value?.order] = params;
      } else {
        fetchData.value.order = 0;
        PageConfig.value.ref = {
          ...PageConfig.value.ref,
          searchParams: {
            type: "SearchParams",
            value: [params],
          },
        };
      }
      Current.value.fetchData = {
        order: fetchData.value.order,
        params,
      };
    } else {
      PageConfig.value.ref.searchParams.value[Current.value.fetchData?.order!] = params;
      Current.value.fetchData.params = params;
    }
    emit("openRef");
    const ind = Current.value.pagerConfig?.order;
    if (Current.value.pager) {
      PageConfig.value.methods = {
        ...PageConfig.value.methods,
        [`onSearch${ind || ""}`]: {
          type: "JSFunction",
          value: `//查询表格\nfunction onSearch${ind || ""} (option: {[key in "pageSize" | "currentPage"]+?:number} | null = null, data = {}) {
            if (option) {
              for (const [type, value] of Object.entries(option)) {
                pagerConfig.value[${ind}][type as keyof Pagination["params"]] = Number(value);
                pagerConfig.value[${ind}].params[type as keyof Pagination["params"]]![1] = Number(value);
              }
            }
            const { format, ...params } = searchParams.value[${ind}];
            params.data = JSON.stringify({
              ...Object.fromEntries(Object.values(pagerConfig.value[${ind}].params)),
              ...Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== "")),
            });
            request<CommonResponse>(params).then((res) => {
              state.tabledata${ind || ""} = format ? format(res) : res.data.rows;
              pagerConfig.value[${ind}].total = res.data.total;
            });
        };
      `,
        },
      };
    }
  } else {
    if (!Current.value.fetchData) {
      if (optionIndex !== null) {
        optionIndex++;
        PageConfig.value.methods[`getOption${optionIndex || ""}`] = {
          type: "JSFunction",
          value: `
          //从接口获取option${optionIndex || ""}的下拉选项数据
          function getOption${optionIndex || ""} (){
            request<CommonResponse<any[]>>(${JSON.stringify(params)}).then((res) => {
            if (res.code == 0) {
              state.option${optionIndex || ""}.value = res.data?.map((item) => {
                return {
                  label: item.label,
                  value: item.value,
                };
              });
            }
          });
          }
          `,
        };
      } else {
        optionIndex = 0;
        PageConfig.value.methods = {
          ...PageConfig.value.methods,
          [`getOption${optionIndex || ""}`]: {
            type: "JSFunction",
            value: `
              //从接口获取option${optionIndex || ""}的下拉选项数据
              function getOption${optionIndex || ""} (){
                request<CommonResponse<any[]>>(${JSON.stringify(params)}).then((res) => {
                  if (res.code == 0) {
                    state.option${optionIndex || ""}.value = res.data?.map((item) => {
                      return {
                        label: item.label,
                        value: item.value,
                      };
                    });
                  }
                });
              }
            `,
          },
        };
      }
    } else {
      PageConfig.value.methods[`getOption${optionIndex || ""}`] = {
        type: "JSFunction",
        value: `
        //从接口获取option${optionIndex || ""}的下拉选项数据
          function getOption${optionIndex || ""} (){
            request<CommonResponse<any[]>>(${JSON.stringify(params)}).then((res) => {
            if (res.code == 0) {
              state.option${optionIndex || ""}.value = res.data?.map((item) => {
                return {
                  label: item.label,
                  value: item.value,
                };
              });
            }
          });
          }
          `,
      };
    }
    Current.value.fetchData = fetchData.value;
    emit("openJs");
    Current.value.props && (Current.value.props.option = []);
  }
};
const saveRules = () => {
  const result = JSON.parse(pageSchema.value);
  Current.value.props && (Current.value.props.rules = result);
  ruleDialogVisible.value = false;
};
const changeFlex = (type: number) => {
  let style: Record<string, string> = {};
  switch (type) {
    case 1:
      Current.value.props && (style.flexDirection = flexDirection.value);
      break;
    case 2:
      Current.value.props && (style.justifyContent = justifyContent.value);
      break;
    case 3:
      Current.value.props && (style.alignItems = alignItems.value);

      break;
    case 4:
      Current.value.props && (style.flexWrap = flexWrap.value);

      break;
    default:
      break;
  }
  if (Current.value.props.style) {
    Current.value.props.style = {
      ...Current.value.props?.style,
      ...style,
    };
  } else {
    Current.value.props.style = style;
  }
};

const currPopupIndex = ref<number | null>(null);
// 编辑弹窗
const editPopup = (index: number) => {
  setDialogVisible.value = true;
  currPopupIndex.value = index;
};
const deletePopup = (index: number) => {
  PageConfig.value.popup?.splice(index, 1);
};
const addPopup = () => {
  PageConfig.value.ref[`dialogVisible${PageConfig.value.popup?.length || ""}`] = false;

  PageConfig.value.popup?.push({
    componentName: "ElDialog",
    props: {
      style: {},
      title: `弹窗${PageConfig.value.popup?.length + 1}`,
      width: "50%",
      value: {
        type: "JSExpression",
        value: `dialogVisible${PageConfig.value.popup?.length || ""}`,
        model: {
          prop: "modelValue",
        },
      },
    },
    children: [],
  });
};
const props = defineProps({
  formData: {
    type: Object,

    default: () => {},
  },

  current: {
    type: Object as PropType<Col | null>,
    default: () => null,
    required: true,
  },
  pageConfig: {
    type: Object as PropType<Page>,
    required: true,
  },

  isShowConfig: {
    type: Boolean,
    default: false,
  },
  scrollHeight: {
    type: String,
    default: "90vh",
  },
});

const currEventMap = computed(() => {
  console.log(Object.keys(Current.value.props ?? {}).filter((val) => val.startsWith("on")));

  return Object.keys(Current.value.props ?? {}).filter((val) => val.startsWith("on"));
});
const emit = defineEmits(["save", "openJs", "openRef"]);
const styleEditor = ref<MonacoEditor>(null);
const optionEditor = ref<MonacoEditor>(null);
const fetchEditor = ref<MonacoEditor>(null);
const ruleEditor = ref<MonacoEditor>(null);

// 绑定变量组件
const BindVar = defineComponent({
  emits: ["bindAfter"],
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    // config: {
    //   type: Object as div,
    //   required: true,
    // },
  },
  setup(props, { emit }) {
    const visibleRef = ref(props.visible);
    const varName = ref("");
    return () => (
      <>
        <el-tooltip
          v-model:visible={visibleRef.value}
          show-arrow={false}
          placement="right-end"
          effect="light"
          trigger="click"
          raw-content
          v-slots={{
            content: () => {
              return (
                <div>
                  <el-form-item label={props.title ? "ref名称" : "变量名"}>
                    <el-input v-model={varName.value} />
                  </el-form-item>
                  <div
                    style={{
                      display: "flex",
                      margin: "auto",
                      width: "fit-content",
                    }}
                  >
                    <el-button
                      onClick={() => {
                        visibleRef.value = false;

                        emit("bindAfter", varName.value);
                      }}
                    >
                      确定
                    </el-button>
                    <el-button
                      onClick={() => {
                        visibleRef.value = false;
                      }}
                    >
                      取消
                    </el-button>
                  </div>
                </div>
              );
            },
            default: () => {
              return (
                <el-button style={{ marginLeft: "10px" }} size="small" round>
                  {props.title || "绑定变量"}
                </el-button>
              );
            },
          }}
        ></el-tooltip>
      </>
    );
  },
});

// 绑定事件
const bindEvent = (val: string) => {
  (Current.value.props ?? {})[val] = {
    type: "JSExpression",
    value: `${val}`,
  };
  PageConfig.value.methods[val] = {
    type: "JSFunction",
    value: `function ${val}(event){}`,
  };
  emit("openJs");
};
const editGlobalStyle = () => {
  pageSchema.value = "";
  dialogTitle.value = "Css编辑";
  cssText.value = "";
  styleDialogVisible.value = true;
  initEditor({
    code: `body {${props.pageConfig.css}\n}`,
    id: "cssEditor_container",
    lang: "css",
    update: (val) => {
      pageSchema.value = val;
    },
    callback(ins) {
      styleEditor.value = ins;
    },
  });
};
const editCurrentStyle = () => {
  pageSchema.value = "";
  dialogTitle.value = "Style编辑";
  cssText.value = "";
  styleDialogVisible.value = true;
  if (Current.value.props?.style) {
    Object.keys(Current.value.props?.style).map((key) => {
      const kebabCaseKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      cssText.value += `  \n${kebabCaseKey}: ${Current.value.props?.style?.[key] ?? ""};`;
    });
  }

  initEditor({
    code: `:root {${cssText.value}\n}`,
    id: "cssEditor_container",
    lang: "css",
    update: (val) => {
      pageSchema.value = val;
    },
    callback(ins) {
      styleEditor.value = ins;
    },
  });
};
watch(
  () => styleDialogVisible.value,
  (n, o) => {
    if (!n) {
      toRaw(styleEditor.value)?.dispose();
    }
  },
);
watch(
  () => optionDialogVisible.value,
  (n, o) => {
    if (!n) {
      toRaw(optionEditor.value)?.dispose();
    }
  },
);
watch(
  () => renderDialogVisible.value,
  (n, o) => {
    if (!n) {
      toRaw(optionEditor.value)?.dispose();
    }
  },
);
watch(
  () => setTableVisible.value,
  (n, o) => {
    if (!n && Current.value.props?.columns) {
      const { title, dataIndex } = Current.value.props.columns[currColIndex.value ?? 0];
      if (isAddColumn.value && !title) {
        Current.value.props.columns.splice(currColIndex.value ?? 0, 1);
        currColIndex.value = null;
        isAddColumn.value = false;
      }

      if (isAddColumn.value && title && dataIndex) {
        nextTick(() => {
          _useDrag();
        });
      }
    }
  },
);
watch(
  () => fetchDataDialogVisible.value,
  (n, o) => {
    if (!n) {
      toRaw(fetchEditor.value)?.dispose();
    }
  },
);
watch(
  () => ruleDialogVisible.value,
  (n, o) => {
    if (!n) {
      toRaw(ruleEditor.value)?.dispose();
    }
  },
);
const setFlex = ref(false);
const layout = ref("block");
const setLayout = (e: MouseEvent) => {
  layout.value = (e.target as HTMLElement).dataset.id as string;
  let style: Record<string, string> = {};
  switch (layout.value) {
    case "block":
      Current.value.props && (style.display = "block");
      break;
    case "flex":
      Current.value.props && (style.display = "flex");
      break;
    case "inline-block":
      Current.value.props && (style.display = "inline-block");
      break;
    case "inline":
      Current.value.props && (style.display = "inline");
      break;
    case "hidden":
      Current.value.props && (style.display = "none");
      break;

    default:
      break;
  }
  setFlex.value = layout.value == "flex";
  if (Current.value.props.style) {
    Current.value.props.style = {
      ...Current.value.props?.style,
      ...style,
    };
  } else {
    Current.value.props.style = style;
  }
};
const setMargin = (e: MouseEvent) => {
  marginValue.value = "";
  if (e.offsetX <= 22 && e.offsetX >= 5) {
    console.log("设置左外边距");

    marginType.value = "left";
  }
  if (e.offsetX <= 71 && e.offsetX >= 58) {
    console.log("设置右外边距");
    marginType.value = "right";
  }
  if (e.offsetY <= 22 && e.offsetY >= 5) {
    console.log("设置顶部外边距");
    marginType.value = "top";
  }
  if (e.offsetY <= 71 && e.offsetY >= 58) {
    console.log("设置底部外边距");
    marginType.value = "bottom";
  }
  marginVisible.value = true;
};
const setPadding = (e: MouseEvent) => {};
const changeMargin = () => {
  console.log(3333, marginValue.value);
  let result = "";
  if (marginValue.value == "auto") {
    result = marginValue.value;
  } else {
    result = marginValue.value + "px";
  }
  let style: Record<string, string> = {};
  switch (marginType.value) {
    case "left":
      Current.value.props && (style.marginLeft = result);
      break;
    case "right":
      Current.value.props && (style.marginRight = result);
      break;
    case "top":
      Current.value.props && (style.marginTop = result);
      break;
    case "bottom":
      Current.value.props && (style.marginBottom = result);
      break;
    default:
      break;
  }
  if (Current.value.props.style) {
    Current.value.props.style = {
      ...Current.value.props?.style,
      ...style,
    };
  } else {
    Current.value.props.style = style;
  }
};
let styleEle: HTMLElement | null = null;
const saveStyle = () => {
  let matched: RegExpMatchArray | null = null;
  let style: Record<string, string> = {};
  if (dialogTitle.value === "Css编辑") {
    matched = pageSchema.value.match(/body\s*{(.*?)}$/s);
    if (matched) {
      props.pageConfig.css = matched[1];
      styleDialogVisible.value = false;
      // 创建 <style> 元素并插入样式
      const getStyle = document.querySelector(`style[data-id="${props.pageConfig.id}"]`);
      if (styleEle || getStyle) {
        document.querySelector(`style[data-id="${props.pageConfig.id}"]`)!.innerHTML = props.pageConfig.css;
      } else {
        styleEle = document.createElement("style");
        styleEle.dataset.id = props.pageConfig.id;
        styleEle.innerHTML = props.pageConfig.css;
        document.head.appendChild(styleEle);
      }
      return;
    }
  }
  if (dialogTitle.value === "Style编辑") {
    matched = pageSchema.value.match(/:root\s*{([^}]*)}/s);
    if (Current.value.props) {
      style = Current.value.props.style = {};
    }
  }
  if (dialogTitle.value === "表头样式编辑") {
    matched = pageSchema.value.match(/:root\s*{([^}]*)}/s);
    Current.value.props && (style = Current.value.props.headerCellStyle = {});
  }

  if (matched !== null) {
    const cssProperty = matched[1].replace(/\n/g, "");
    const camelCaseProperty = cssProperty
      .split(";")
      .map((property) => property.trim())
      .filter(Boolean)
      .map((property) => {
        const [key, value] = property.split(":");
        console.log(key, value);

        const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return [`${camelCaseKey}`, `${value.trim()}`];
      });
    for (const [prop, value] of camelCaseProperty) {
      style[prop] = value;
    }
  }

  styleDialogVisible.value = false;
};
const saveOption = () => {
  const config = JSON.parse(pageSchema.value);
  console.log(config);
  if (editTitleRef.value == "option") {
    (Current.value.props ?? {}).option = config;
  }
  if (editTitleRef.value == "data") {
    (Current.value.props ?? { data: "" }).data = config;
  }
  optionDialogVisible.value = false;
};

// jsontohtml

const jsonToHtml = (json: Page | Col) => {
  let html = "";

  // 处理组件名
  if (json.componentName) {
    // 开始标签
    html += `<${hyphenate(json.componentName)}`;

    // 处理属性
    if (json.props) {
      // 处理样式
      if (json.props.style) {
        const styleString = Object.entries(json.props.style)
          .map(([key, value]) => `${camelize(key)}: "${value}"`)
          .join(",");
        html += ` style={{${styleString}}}`;
      }

      // 处理其他属性
      for (const [key, value] of Object.entries(json.props)) {
        console.log(key,value);
        
        if (key !== "style") {
          // 避免重复处理样式
          html += ` ${key}=${typeof value=='boolean'?`{${value}}`:`"${value}"`}`;
        }
      }
    }

    html += ">";

    // 处理子元素
    if (Array.isArray(json.children)) {
      json.children.forEach((child) => {
        html += jsonToHtml(child); // 递归处理子元素
      });
    }

    html += `${(json as Col).label??''}</${hyphenate(json.componentName)}>`;
  }
  return html;
};
const saveRender = () => {
  const schema = _.cloneDeep(renderSchema.value);
  if (currPopupIndex.value != null) {
    PageConfig.value.popup[currPopupIndex.value].children = schema.children;
  }

  if (Current.value.componentName == "ElTable") {
    const columns = Current.value.props?.columns ?? [];
    if (schema?.children.length) {
      if(schema?.children.length>1){
        return ElMessage.warning('JSX element must has a parent node')
      }
      columns[currColIndex.value ?? 0].render = {
        type: "JSFunction",
        value: `function r(){return '${jsonToHtml(schema.children[0])}'}`,
        schema
      };
    } else {
      delete columns[currColIndex.value ?? 0].render;
    }
  }
  if (Current.value.componentName == "ElCarousel") {
    const option = Current.value.props?.option ?? [];

    option[currCarouselIndex.value ?? 0].schema = schema;
    option[currCarouselIndex.value ?? 0].style = {height:'auto'};
  }
  renderDialogVisible.value = false;
};
let current: HTMLElement | null = null;
onMounted(() => {
  watch(
    () => Current.value?.componentName,
    (n, o) => {
      console.log("n", n);

      if (n == "ElTable" || n == "ElMenu") {
        nextTick(() => {
          _useDrag();
        });
      }
    },
  );
});
const _useDrag = () => {
  remove?.();
  let sourceIndex: number | null = null;
  const removeDrag = useDrag([".radioGroup .hover"], ".radioGroup", {
    start(el, source) {
      console.log(el.target, source);

      sourceIndex = source;
      current = el.target as HTMLElement;
    },

    enter(el, sort) {
      if (el.target == el.currentTarget || el.target == current) return;

      sort(el, current!, el.currentTarget as HTMLElement)!;
    },

    leave(el) {},

    over(el) {},

    end(el, data, insertIndex) {
      console.log("in", sourceIndex);
      switch (Current.value.componentName) {
        case "ElMenu":
          const option = (Current.value.props?.option ?? [])[sourceIndex!];
          Current.value.props?.option?.splice(sourceIndex!, 1);
          Current.value.props?.option?.splice(insertIndex.value!, 0, option);
          break;
        case "ElTable":
          const column = (Current.value.props?.columns ?? [])[sourceIndex!];
          Current.value.props?.columns?.splice(sourceIndex!, 1);
          Current.value.props?.columns?.splice(insertIndex.value!, 0, column);
          break;
      }
    },
  });
  remove = removeDrag;
};
const currColIndex = ref<number | null>(null);
const currCarouselIndex = ref<number | null>(null);
const isAddColumn = ref<boolean>(false);

const items = ref([]);
const page = ref(1);
const load = () => {
  if (page.value > 1) return;
  //https://undraw.co/api/illustrations
  fetch(`https://picsum.photos/v2/list?page=${page.value}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      items.value = [...items.value, ...res.map((item) => item.download_url)];
      page.value++;
    })
    .catch((error) => {
      console.error("Error in fetch:", error);
    });
};
const tableConfig = ref<BasicFormConfig>({
  row: {
    col: [
      {
        label: "title",

        key: "title",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-input
              modelValue={data}
              onUpdate:modelValue={(e: string) => {
                data = e;
              }}
            ></el-input>
          );
        },
      },
      {
        label: "dataIndex",

        key: "dataIndex",

        props: { style: { display: "flex", flexDirection: "column" }, required: true },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
      {
        label: "sortable",

        key: "sortable",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "width",

        key: "width",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
      {
        label: "align",

        key: "align",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select>
              {["left", "center", "right"].map((val) => {
                return <el-option label={val} value={val}></el-option>;
              })}
            </el-select>
          );
        },
      },
      {
        label: "render",

        key: "render",

        props: { style: { display: "flex" } },

        render(data, col) {
          console.log("data", data);

          return (
            <el-button
              onClick={() => {
                renderDialogVisible.value = true;
                const columns = Current.value.props?.columns ?? [];
                renderSchema.value.children = (columns[currColIndex.value ?? 0].render?.schema as Page)?.children ?? [];
              }}
            >
              {" "}
              编辑代码
            </el-button>
          );
        },
      },
      {
        label: "type",

        key: "type",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-select>
              {[
                { name: "索引列", value: "index" },
                { name: "单选列", value: "radio" },
                { name: "多选列", value: "selection" },
                { name: "展开列", value: "expand" },
              ].map((val) => {
                return <el-option label={val.name} value={val.value}></el-option>;
              })}
            </el-select>
          );
        },
      },
      {
        label: "show-overflow-tooltip",
        key: "showOverflowTooltip",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
    ],
  },
});
const dialogConfig = ref<BasicFormConfig>({
  row: {
    col: [
      {
        label: "title",
        pkey: "props",
        key: "title",
        props: { style: { display: "flex", flexDirection: "column" } },
        render(data, col) {
          return (
            <el-input
              modelValue={data}
              onUpdate:modelValue={(e: string) => {
                data = e;
              }}
            ></el-input>
          );
        },
      },
      {
        label: "width",
        pkey: "props",
        key: "width",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
      {
        label: "modelvalue",
        pkey: "props",
        key: "value",
        props: { style: { display: "flex", flexDirection: "column" } },
        render(data, col) {
          console.log(data);

          return (
            <>
              <el-input
                modelValue={data.value}
                onUpdate:modelValue={(e: string) => {
                  if (PageConfig.value.ref[data.value] !== undefined) {
                    delete PageConfig.value.ref[data.value];
                  };
                  data.value = e;
                  PageConfig.value.ref[`${e}`] = false;
                }}
              ></el-input>
            </>
          );
        },
      },
      {
        label: "render",

        key: "children",

        props: { style: { display: "flex" } },

        render(data, col) {
          console.log("data", data);

          return (
            <el-button
              onClick={() => {
                renderDialogVisible.value = true;
                const columns = Current.value.props?.columns ?? [];
                renderSchema.value.children = (columns[currColIndex.value ?? 0].render?.schema as Page)?.children ?? [];
              }}
            >
              {" "}
              编辑代码
            </el-button>
          );
        },
      },
    ],
  },
});
const basicConfig = ref<BasicFormConfig>({
  row: {
    col: [
      {
        label: "span",
        display: {
          relate: {
            key: "componentName",
            value: "ElCol",
          },
        },
        pkey: "props",
        key: "span",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input-number></el-input-number>;
        },
      },
      {
        label: "gutter",
        display: {
          relate: {
            key: "componentName",
            value: "ElRow",
          },
        },
        pkey: "props",
        key: "gutter",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input-number></el-input-number>;
        },
      },
      {
        label: "id",

        key: "",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },

      {
        label: "class",

        key: "",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <>
              {!Current.value.props?.class || typeof Current.value.props?.class == "string" ? (
                <el-input v-model={(Current.value.props ?? {}).class}></el-input>
              ) : (
                <el-tag
                  onClose={() => {
                    delete Current.value.props?.class;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              )}
              <BindVar
                visible={false}
                onBindAfter={(value: string) => {
                  (Current.value.props ?? {}).class = {
                    type: "JSExpression",
                    value: `${value}`,
                  };
                  const [key, val] = value.split(/\./);
                  if (!PageConfig.value.ref[key]) {
                    PageConfig.value.state = {
                      ...PageConfig.value.ref,
                      [key]: {
                        [`${val}`]: "",
                      },
                    };
                  } else {
                    PageConfig.value.ref[key][val] = "";
                  }
                }}
              />
            </>
          );
        },
      },
      {
        label: "ref",

        key: "",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <>
              {!Current.value.props?.ref ? (
                <el-input v-model={(Current.value.props ?? {}).ref}></el-input>
              ) : (
                <el-tag
                  onClose={() => {
                    delete Current.value.props?.ref;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              )}
              <BindVar
                title={"绑定ref"}
                visible={false}
                onBindAfter={(value: string) => {
                  const type =
                    Current.value.componentName != "ElForm"
                      ? `InstanceType<typeof ${Current.value.componentName}>`
                      : "FormInstance|null";
                  if (!PageConfig.value.ref[value]) {
                    PageConfig.value.ref = {
                      ...PageConfig.value.ref,
                      [value]: {
                        type,
                        value: null,
                      },
                    };
                  } else {
                    PageConfig.value.ref[value] = {
                      type,
                      value: null,
                    };
                  }
                  (Current.value.props ?? {}).ref = value;
                }}
              />
            </>
          );
        },
      },
      {
        label: "图标列表",
        display: {
          relate: {
            key: "componentName",
            value: "ElIcon",
          },
        },
        key: "",
        props: { style: { display: "flex", flexDirection: "column" } },
        render(data, col) {
          return (
            <ul style="overflow: auto; height: 200px;width: 100%;display: flex;flex-wrap: wrap;">
              {Object.keys(ElementPlusIconsVue).map((icon) => {
                const IconComponent = ElementPlusIconsVue[icon];
                return (
                  <li
                    onClick={() => {
                      Current.value.props.icon = icon;
                    }}
                    style="padding: 10px; cursor: pointer; display: flex;align-items: center;justify-content: center;"
                  >
                    <el-icon size="25">
                      <IconComponent />
                    </el-icon>
                  </li>
                );
              })}
            </ul>
          );
        },
      },
      {
        label: "图片列表",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElImage",
            },
            {
              key: "componentName",
              value: "ElMain",
            },
            {
              key: "componentName",
              value: "ElContainer",
            },
            {
              key: "componentName",
              value: "ElFooter",
            },
            {
              key: "componentName",
              value: "ElHeader",
            },
            {
              key: "componentName",
              value: "div",
            },
          ],
        },
        key: "",
        props: { style: { display: "flex", flexDirection: "column" } },
        render(data, col) {
          return (
            <ul
              v-infinite-scroll={load}
              style="overflow: auto; height: 200px;width: 100%;display: flex;flex-wrap: wrap;justify-content:start;"
              infinite-scroll-distance={10}
            >
              {items.value.map((item) => {
                return (
                  <el-image
                    key={item}
                    style="width: 100px; height: 100px"
                    fit="fill"
                    onClick={() => {
                      if (Current.value.componentName == "ElImage") {
                        Current.value.props.src = item;
                      } else {
                        Current.value.props.style = {
                          ...Current.value.props.style,
                          backgroundImage: `url(${item})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        };
                      }
                    }}
                    lazy
                    src={item}
                  ></el-image>
                );
              })}
              <span>loading...</span>
            </ul>
          );
        },
      },
      {
        label: "轮播项",
        key: "",
        props: { style: { display: "flex", flexDirection: "column" } },
        display: {
          relate: {
            key: "componentName",
            value: "ElCarousel",
          },
        },
        labelWidth: "100%",
        render(data, col) {
          return (
            <>
              <div style={{ width: "100%" }} class="radioGroup">
                {Current.value.props?.option?.map((opt, index) => {
                  return (
                    <div
                      style={{
                        padding: "2px 20px 2px 2px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                      class="hover"
                      draggable
                      key={opt.id}
                    >
                      <div class="flex">
                        <svg
                          t="1720276255218"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2736"
                          width="25"
                          height="33"
                          style={{ verticalAlign: "middle", cursor: "move" }}
                        >
                          <path
                            d="M368 672a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128zM368 448a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-288-224a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"
                            fill="#707070"
                            p-id="2737"
                          ></path>
                        </svg>

                        <el-input v-model={opt.label} placeholder="指示器文本"></el-input>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i-ep-edit
                          onClick={() => {
                            renderDialogVisible.value = true;
                            currCarouselIndex.value = index;
                            const option = Current.value.props?.option ?? [];
                            renderSchema.value.children =
                              (option[currCarouselIndex.value ?? 0]?.schema as Page)?.children ?? [];
                          }}
                        />
                        <i-ep-delete
                          style={{
                            color: "#999",

                            width: "20px",

                            height: "20px",
                          }}
                          onClick={() => {
                            Current.value.props?.option?.splice(index, 1);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <el-button
                type="primary"
                text
                onClick={() => {
                  Current.value.props?.option?.push({ title: "", index: Current.value.props?.option?.length });
                }}
              >
                新增轮播项
              </el-button>
            </>
          );
        },
      },
      {
        label: "菜单项",
        key: "",
        props: { style: { display: "flex", flexDirection: "column" } },
        display: {
          relate: {
            key: "componentName",
            value: "ElMenu",
          },
        },
        labelWidth: "100%",
        render(data, col) {
          return (
            <>
              <div style={{ width: "100%" }} class="radioGroup">
                {Current.value.props?.option?.map((opt, index) => {
                  return (
                    <div
                      style={{
                        padding: "2px 20px 2px 2px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                      class="hover"
                      draggable
                      key={opt.index}
                    >
                      <div class="flex">
                        <svg
                          t="1720276255218"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2736"
                          width="25"
                          height="33"
                          style={{ verticalAlign: "middle", cursor: "move" }}
                        >
                          <path
                            d="M368 672a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128zM368 448a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-288-224a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"
                            fill="#707070"
                            p-id="2737"
                          ></path>
                        </svg>

                        <el-input v-model={opt.title}></el-input>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i-ep-edit onClick={() => {}} />
                        <i-ep-delete
                          style={{
                            color: "#999",

                            width: "20px",

                            height: "20px",
                          }}
                          onClick={() => {
                            Current.value.props?.option?.splice(index, 1);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <el-button
                type="primary"
                text
                onClick={() => {
                  Current.value.props?.option?.push({ title: "", index: Current.value.props?.option?.length });
                }}
              >
                新增菜单项
              </el-button>
            </>
          );
        },
      },
      {
        label: "modelValue",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElSelect",
            },
            {
              key: "componentName",
              value: "ElCheckBox",
            },
            {
              key: "componentName",
              value: "ElRadio",
            },
            {
              key: "componentName",
              value: "ElInput",
            },
          ],
        },
        key: "key",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <>
              {!Current.value.props?.value || typeof Current.value.props?.value == "string" ? (
                <el-input v-model={(Current.value.props ?? {}).value}></el-input>
              ) : (
                <el-tag
                  onClose={() => {
                    delete Current.value.props?.value;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              )}
              <BindVar
                visible={false}
                onBindAfter={(value: string) => {
                  (Current.value.props ?? {}).value = {
                    type: "JSExpression",
                    value: `${value}`,
                    model: {
                      prop: "",
                    },
                  };
                  const [key, val] = value.split(/\./);
                  if (!PageConfig.value.ref[key]) {
                    PageConfig.value.ref = {
                      ...PageConfig.value.ref,
                      [key]: {
                        [`${val}`]: "",
                      },
                    };
                  } else {
                    PageConfig.value.ref[key][val] = "";
                  }
                  Current.value.key = val;
                }}
              />
            </>
          );
        },
      },
      {
        label: "option",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElSelect",
            },
            {
              key: "componentName",
              value: "ElCheckBox",
            },
            {
              key: "componentName",
              value: "ElRadio",
            },
            {
              key: "componentName",
              value: "ElMenu",
            },
          ],
        },
        key: "option",
        props: { props: { style: { display: "flex" } } },

        render(data, col) {
          return (
            <el-button
              onClick={async () => {
                optionDialogVisible.value = true;
                pageSchema.value = "";
                initEditor({
                  code: JSON.stringify(Current.value.props?.option),
                  id: "optionEditor_container",
                  update: (val) => {
                    pageSchema.value = val;
                  },
                  callback(ins) {
                    optionEditor.value = ins;
                  },
                });
              }}
            >
              编辑代码
            </el-button>
          );
        },
      },
      {
        label: "data",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElTable",
            },
          ],
        },
        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-button
              onClick={async () => {
                optionDialogVisible.value = true;
                pageSchema.value = "";
                editTitleRef.value = "data";
                initEditor({
                  code: JSON.stringify(Current.value.props?.data),
                  id: "optionEditor_container",
                  update: (val) => {
                    pageSchema.value = val;
                  },
                  callback(ins) {
                    optionEditor.value = ins;
                  },
                });
              }}
            >
              编辑代码
            </el-button>
          );
        },
      },
      {
        label: "表格列",
        key: "",
        tooltip() {
          return (
            <el-select
              placeholder=""
              style={{ width: "50%", marginLeft: "auto" }}
              multiple
              onVisible-change={() => {
                findComp();
              }}
              v-slots={{
                header: () => {
                  return (
                    <el-checkbox
                      modelValue={formColumns.value.some((item) => item.checked == true)}
                      onUpdate:modelValue={(e: boolean) => {
                        if (e) {
                          formColumns.value.forEach((item) => {
                            item.checked = true;
                            const { checked, ...col } = item;
                            Current.value.props?.columns?.push(col);
                          });
                        } else {
                          formColumns.value.forEach((item) => {
                            item.checked = false;
                            (Current.value.props ?? {}).columns = Current.value.props?.columns?.filter(
                              (i: any) => i.dataIndex !== item.dataIndex,
                            );
                          });
                          console.log(Current.value.props?.columns);
                        }
                      }}
                    >
                      全选
                    </el-checkbox>
                  );
                },
                tag: () => {
                  return <span style={{ color: "#333", fontSize: "14px" }}>已选择0项</span>;
                },
              }}
            >
              {formColumns.value?.map((item: any) => {
                return (
                  <el-option label={item.title} value={item.dataIndex} key={item.dataIndex}>
                    <el-checkbox
                      label={item.title}
                      modelValue={item.checked}
                      onUpdate:modelValue={(e: boolean) => {
                        item.checked = e;
                        if (e) {
                          Current.value.props?.columns?.push(item);
                        } else {
                          (Current.value.props ?? {}).columns = Current.value.props?.columns?.filter(
                            (i: any) => i.dataIndex !== item.dataIndex,
                          );
                        }
                      }}
                    />
                  </el-option>
                );
              })}
            </el-select>
          );
        },
        props: { style: { display: "flex", flexDirection: "column" } },
        display: {
          relate: {
            key: "componentName",
            value: "ElTable",
          },
        },
        labelWidth: "100%",
        render(data, col) {
          return (
            <>
              <div style={{ width: "100%" }} class="radioGroup">
                {Current.value.props?.columns?.map((opt, index) => {
                  return (
                    <div
                      style={{
                        padding: "2px 20px 2px 2px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                      class="hover"
                      draggable
                      key={opt.dataIndex}
                    >
                      <div>
                        <svg
                          t="1720276255218"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2736"
                          width="25"
                          height="33"
                          style={{ verticalAlign: "middle", cursor: "move" }}
                        >
                          <path
                            d="M368 672a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128zM368 448a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-288-224a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m288 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"
                            fill="#707070"
                            p-id="2737"
                          ></path>
                        </svg>

                        {opt.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i-ep-edit
                          onClick={() => {
                            setTableVisible.value = true;
                            currColIndex.value = index;
                          }}
                        />
                        <i-ep-delete
                          style={{
                            color: "#999",

                            width: "20px",

                            height: "20px",
                          }}
                          onClick={() => {
                            Current.value.props?.columns?.splice(index, 1);
                            currColIndex.value = null;
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <el-button
                type="success"
                text
                onClick={() => {
                  setTableVisible.value = true;
                  Current.value.props?.columns?.push({});
                  currColIndex.value = (Current.value.props?.columns ?? []).length - 1;
                  isAddColumn.value = true;
                }}
              >
                新增列
              </el-button>
            </>
          );
        },
      },
      {
        label: "fetchData",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElTable",
            },
            {
              key: "componentName",
              value: "ElSelect",
            },
            {
              key: "componentName",
              value: "ElCheckBox",
            },
            {
              key: "componentName",
              value: "ElRadio",
            },
          ],
        },
        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              {Current.value.fetchData ? (
                <el-tag
                  onClose={() => {
                    if (Current.value.componentName == "ElTable") {
                      delete PageConfig.value.methods[`onSearch${(Current.value.fetchData?.order ?? 0) || ""}`];
                      delete Current.value.fetchData;
                      if (fetchData.value?.order === 0) {
                        fetchData.value.order = null;
                      } else {
                        fetchData.value?.order && fetchData.value.order--;
                      }
                    } else {
                      delete PageConfig.value.methods[`getOption${(Current.value.fetchData?.order ?? 0) || ""}`];
                      delete Current.value.fetchData;
                      if (optionIndex === 0) {
                        optionIndex = null;
                      } else {
                        optionIndex && optionIndex--;
                      }
                    }
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              ) : (
                ""
              )}
              <el-button
                onClick={async () => {
                  fetchDataDialogVisible.value = true;
                  pageSchema.value = "";
                  currParamsConf.value = Current.value.fetchData?.params || currParamsConf.value;
                  defaultContentType.value =
                    contentType.find((item) => item.label == (currParamsConf.value.headers ?? {})["content-type"])
                      ?.value ?? 1;
                  defaultRequestType.value =
                    requesttype.find((item) => item.label == currParamsConf.value.method)?.value ?? 1;
                  initEditor({
                    code: `let params = {\nurl:'${currParamsConf.value.url}',\nmethod:'${currParamsConf.value.method}',\nheaders:${JSON.stringify(currParamsConf.value.headers)},\ndata:${JSON.stringify(currParamsConf.value.data)}\n}`,
                    id: "fetch_editor_container",
                    lang: "javascript",
                    update: (val) => {
                      pageSchema.value = val;
                    },
                    callback(ins) {
                      fetchEditor.value = ins;
                    },
                  });
                }}
              >
                编辑代码
              </el-button>
            </>
          );
        },
      },
      {
        label: "edit_rules",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElForm",
            },
          ],
        },
        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-button
              onClick={async () => {
                ruleDialogVisible.value = true;
                initEditor({
                  code: `{"formData.ceshi": [{"required": true,"message": "请输入内容","trigger": "blur"}]}`,
                  id: "rules_editor_container",
                  update: (val) => {
                    pageSchema.value = val;
                  },
                  callback(ins) {
                    ruleEditor.value = ins;
                  },
                });
              }}
            >
              编辑代码
            </el-button>
          );
        },
      },
      {
        label: "headre-cell-style",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElTable",
            },
          ],
        },
        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-button
              onClick={async () => {
                pageSchema.value = "";
                dialogTitle.value = "表头样式编辑";
                cssText.value = "";
                styleDialogVisible.value = true;
                Object.keys(Current.value.props?.headerCellStyle).map((key) => {
                  const kebabCaseKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                  cssText.value += `  \n${kebabCaseKey}: ${Current.value.props?.headerCellStyle[key]};`;
                });
                initEditor({
                  code: `:root {${cssText.value}\n}`,
                  id: "cssEditor_container",
                  lang: "css",
                  update: (val) => {
                    pageSchema.value = val;
                  },
                  callback(ins) {
                    styleEditor.value = ins;
                  },
                });
              }}
            >
              编辑代码
            </el-button>
          );
        },
      },
      {
        label: "label-width",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElForm",
            },
          ],
        },
        pkey: "props",
        key: "labelWidth",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-input />;
        },
      },
      {
        label: "label",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElFormItem",
            },
          ],
        },
        pkey: "props",
        key: "label",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-input />;
        },
      },
      {
        label: "prop",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElFormItem",
            },
          ],
        },
        pkey: "props",
        key: "prop",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-input />;
        },
      },
      {
        label: "required",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElFormItem",
            },
          ],
        },
        pkey: "props",
        key: "required",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-switch />;
        },
      },
      {
        label: "model",
        key: "",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElForm",
            },
          ],
        },
        props: { style: { display: "flex" } },
        render(data, col) {
          return (
            <>
              {Current.value.props?.model ? (
                <el-tag
                  onClose={() => {
                    delete Current.value.props?.model;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              ) : (
                <BindVar
                  visible={false}
                  onBindAfter={(val: string) => {
                    (Current.value.props ?? {}).model = {
                      type: "JSExpression",
                      value: val,
                    };
                  }}
                />
              )}
            </>
          );
        },
      },
      {
        label: "text",
        display: {
          relate: [
            {
              key: "componentName",
              value: "Text",
            },
            {
              key: "componentName",
              value: "ElButton",
            },
          ],
        },
        key: "label",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input type="textarea"></el-input>;
        },
      },
      {
        label: "type",
        display: {
          relate: {
            key: "componentName",
            value: "ElInput",
          },
        },
        pkey: "props",
        key: "type",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="text" value="text"></el-option>
              <el-option label="password" value="password"></el-option>
              <el-option label="textarea" value="textarea"></el-option>
              <el-option label="number" value="number"></el-option>
            </el-select>
          );
        },
      },
      {
        label: "range-separator",
        display: {
          relate: {
            key: "componentName",
            value: "ElDatePicker",
          },
        },
        pkey: "props",
        key: "range-separator",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
      {
        label: "type",
        display: {
          relate: {
            key: "componentName",
            value: "ElDatePicker",
          },
        },
        pkey: "props",
        key: "type",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select
              onChange={(e: string) => {
                if (e == "daterange") {
                  PageConfig.value.ref[`${e}${daterangeIndex ?? ""}`] = {
                    type: "ComputedRef",
                    value: "",
                  };
                  daterangeIndex++;
                }
                if (e == "datetimerange") {
                  PageConfig.value.ref[`${e}${datetimerangeIndex ?? ""}`] = {
                    type: "ComputedRef",
                    value: "",
                  };
                  datetimerangeIndex++;
                }
                emit("openRef");
              }}
            >
              <el-option label="datatime" value="datetime"></el-option>
              <el-option label="datatimerange" value="datetimerange"></el-option>
              <el-option label="date" value="date"></el-option>
              <el-option label="daterange" value="daterange"></el-option>
            </el-select>
          );
        },
      },
      {
        label: "type",
        display: {
          relate: {
            key: "componentName",
            value: "ElButton",
          },
        },
        pkey: "props",
        key: "type",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="primary" value="primary"></el-option>
              <el-option label="success" value="success"></el-option>
              <el-option label="warning" value="warning"></el-option>
              <el-option label="danger" value="danger"></el-option>
            </el-select>
          );
        },
      },
    ],
  },
});
const moreConfig = ref<BasicFormConfig>({
  row: {
    col: [
      {
        label: "fit",
        display: {
          relate: {
            key: "componentName",
            value: "ElImage",
          },
        },
        pkey: "props",
        key: "fit",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="cover" value="cover"></el-option>
              <el-option label="fill" value="fill"></el-option>
              <el-option label="none" value="none"></el-option>
              <el-option label="scale-down" value="scale-down"></el-option>
              <el-option label="contain" value="contain"></el-option>
            </el-select>
          );
        },
      },
      {
        label: "autoplay",
        display: {
          relate: {
            key: "componentName",
            value: "ElCarousel",
          },
        },
        pkey: "props",
        key: "autoplay",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "loop",
        display: {
          relate: {
            key: "componentName",
            value: "ElCarousel",
          },
        },
        pkey: "props",
        key: "loop",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "卡片模式",
        display: {
          relate: {
            key: "componentName",
            value: "ElCarousel",
          },
        },
        pkey: "props",
        key: "type",
        props: { style: { display: "flex" } },

        render(data, col) {
          console.log(data);

          return (
            <>
              <el-switch
                modelValue={Current.value.props.type == "card"}
                onUpdate:modelValue={(e: boolean) => {
                  if (e) {
                    Current.value.props.type = "card";
                  } else {
                    delete Current.value.props.type;
                  }
                }}
              ></el-switch>
            </>
          );
        },
      },
      {
        label: "mode",
        display: {
          relate: {
            key: "componentName",
            value: "ElMenu",
          },
        },
        pkey: "props",
        key: "mode",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="horizontal " value="horizontal"></el-option>
              <el-option label="vertical" value="vertical"></el-option>
            </el-select>
          );
        },
      },
      {
        label: "backgroundColor",
        display: {
          relate: {
            key: "componentName",
            value: "ElMenu",
          },
        },
        pkey: "props",
        key: "backgroundColor",
        span: 16,
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-color-picker></el-color-picker>;
        },
      },
      {
        label: "textColor",
        display: {
          relate: {
            key: "componentName",
            value: "ElMenu",
          },
        },
        pkey: "props",
        key: "textColor",
        span: 16,
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-color-picker></el-color-picker>;
        },
      },
      {
        label: "placeholder",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElSelect",
            },
            {
              key: "componentName",
              value: "ElInput",
            },
          ],
        },
        pkey: "props",
        key: "placeholder",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
      {
        label: "clearable",
        display: {
          relate: [
            {
              key: "componentName",
              value: "ElSelect",
            },
            {
              key: "componentName",
              value: "ElInput",
            },
          ],
        },
        pkey: "props",
        key: "clearable",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "plain",
        display: {
          relate: {
            key: "componentName",
            value: "ElButton",
          },
        },
        pkey: "props",
        key: "plain",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-switch />;
        },
      },
      {
        label: "text",
        display: {
          relate: {
            key: "componentName",
            value: "ElButton",
          },
        },
        pkey: "props",
        key: "text",
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return <el-switch />;
        },
      },
      {
        label: "label-position",
        display: {
          relate: {
            key: "componentName",
            value: "ElForm",
          },
        },
        pkey: "props",
        key: "labelPosition",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="left" value="left"></el-option>
              <el-option label="center" value="center"></el-option>
              <el-option label="right" value="right"></el-option>
              <el-option label="top" value="top"></el-option>
            </el-select>
          );
        },
      },
      {
        label: "disabeld",
        pkey: "props",
        key: "disabeld",
        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "multiple",
        pkey: "props",
        key: "multiple",
        display: {
          relate: {
            key: "componentName",
            value: "ElSelect",
          },
        },
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-switch></el-switch>;
        },
      },

      {
        label: "size",

        key: "",

        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="mini" value="mini"></el-option>
              <el-option label="small" value="small"></el-option>
              <el-option label="middle" value="middle"></el-option>
              <el-option label="large" value="large"></el-option>
            </el-select>
          );
        },
      },
    ],
  },
});
const sizeConfig = ref<BasicFormConfig>({
  row: {
    style: {},
    gutter: 20,
    col: [
      {
        label: "宽",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                v-slots={{ suffix: () => "px" }}
                modelValue={data.width == "fit-content" || data.width == "auto" ? "" : data.width?.replace("px", "")}
                onUpdate:modelValue={(e: string) => {
                  console.log(e);
                  data.width = e ? e + "px" : "fit-content";
                }}
              ></el-input>
            </>
          );
        },
      },
      {
        label: "高",

        pkey: "props",
        key: "style",
        span: 8,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                v-slots={{ suffix: () => "px" }}
                modelValue={data.height == "fit-content" || data.height == "auto" ? "" : data.height?.replace("px", "")}
                onUpdate:modelValue={(e: string) => {
                  console.log(e);
                  data.height = e ? e + "px" : "auto";
                }}
              ></el-input>
            </>
          );
        },
      },
      {
        label: "自适应",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <div
              onClick={() => {
                console.log(data.width);
                data.width = "fit-content";
                data.height = "fit-content";
              }}
            >
              <svg
                t="1723713469603"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="24981"
                width="25"
                height="25"
              >
                <path
                  d="M164.352 385.024c23.552 0 29.696-19.456 29.696-43.008V210.944c0-9.216 7.68-16.896 16.896-16.896h131.072c23.552 0 42.496-6.144 42.496-29.184 0-23.552-18.944-34.304-42.496-34.304H172.544h-0.512c-23.04 0-41.472 18.944-41.472 41.472v169.472c0 24.064 10.24 43.52 33.792 43.52z m89.088 385.536h517.12v-517.12h-517.12v517.12z m61.44-455.68h394.24v394.24h-394.24v-394.24z m544.768 324.096c-23.552 0-29.696 19.456-29.696 43.008v130.56c0 9.216-7.68 16.896-16.896 16.896h-131.072c-23.552 0-42.496 6.144-42.496 29.184 0 23.552 18.944 34.304 42.496 34.304H852.48c23.04 0 41.472-18.944 41.472-41.472v-169.472c-0.512-23.552-10.752-43.008-34.304-43.008zM342.528 829.44H210.944c-9.216 0-16.896-7.68-16.896-16.896v-130.56c0-23.552-6.144-43.008-29.696-43.008s-33.792 19.456-33.792 43.008v169.984c0 23.04 18.432 41.472 41.472 41.472h169.984c23.552 0 42.496-10.752 42.496-34.304 0.512-23.552-18.432-29.696-41.984-29.696z m509.44-698.88h-169.984c-23.552 0-42.496 10.752-42.496 34.304s18.944 29.184 42.496 29.184h131.072c9.216 0 16.896 7.68 16.896 16.896v130.56c0 23.552 6.144 43.008 29.696 43.008s33.792-19.456 33.792-43.008V172.032v-0.512c0-22.528-18.944-40.96-41.472-40.96z"
                  p-id="24982"
                ></path>
              </svg>
            </div>
          );
        },
      },
      {
        label: "full",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex", textAlign: "center", justifyContent: "center" } },

        render(data, col) {
          return (
            <div
              onClick={() => {
                console.log(data.width);
                data.width = "100%";
                data.height = "100%";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M4 4V3H3v1zm7.293 8.707a1 1 0 0 0 1.414-1.414zM5 10V4H3v6zM4 5h6V3H4zm-.707-.293l8 8l1.414-1.414l-8-8z"
                />
                <path
                  fill="#000000"
                  d="M4 20v1H3v-1zm7.293-8.707a1 1 0 0 1 1.414 1.414zM5 14v6H3v-6zm-1 5h6v2H4zm-.707.293l8-8l1.414 1.414l-8 8z"
                />
                <path
                  fill="#000000"
                  d="M20 4V3h1v1zm-7.293 8.707a1 1 0 0 1-1.414-1.414zM19 10V4h2v6zm1-5h-6V3h6zm.707-.293l-8 8l-1.414-1.414l8-8z"
                />
                <path
                  fill="#000000"
                  d="M20 20v1h1v-1zm-7.293-8.707a1 1 0 0 0-1.414 1.414zM19 14v6h2v-6zm1 5h-6v2h6zm.707.293l-8-8l-1.414 1.414l8 8z"
                />
              </svg>
            </div>
          );
        },
      },
    ],
  },
});
const textConfig: Ref<BasicFormConfig> = ref({
  row: {
    gutter: 20,
    col: [
      {
        label: "字号",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          console.log(data.fontSize);
          return (
            <>
              <el-input
                v-slots={{ suffix: () => "px" }}
                modelValue={data.fontSize?.replace("px", "")}
                onUpdate:modelValue={(e: string) => {
                  console.log(e);
                  data.fontSize = e + "px";
                }}
              ></el-input>
            </>
          );
        },
      },
      {
        label: "字体",

        key: "",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input></el-input>
            </>
          );
        },
      },
      {
        label: "行高",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                v-slots={{ suffix: () => "px" }}
                modelValue={data.lineHeight?.replace("px", "")}
                onUpdate:modelValue={(e: string) => {
                  data.lineHeight = e + "px";
                }}
              ></el-input>
            </>
          );
        },
      },
      {
        label: "字重",

        pkey: "props",
        key: "style",
        span: 12,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                modelValue={data.fontWeight ?? ""}
                onUpdate:modelValue={(e: string) => {
                  data.fontWeight = e;
                }}
              ></el-input>
            </>
          );
        },
      },
    ],
  },
});
const textExtraConfig: Ref<BasicFormConfig> = ref({
  row: {
    gutter: 20,
    col: [
      {
        label: "颜色",

        pkey: "props",
        key: "style",
        span: 16,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-color-picker
                modelValue={data.color ?? ""}
                onUpdate:modelValue={(e: string | null) => {
                  data.color = e;
                }}
              ></el-color-picker>
            </>
          );
        },
      },
      {
        label: "对齐",
        pkey: "props",
        key: "style",
        span: 24,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "80%",
                cursor: "pointer",
              }}
              onClick={(e: Event) => {
                switch ((e.target as HTMLElement)?.dataset.id) {
                  case "left":
                    data.justifyContent = "start";
                    break;
                  case "center":
                    data.justifyContent = "center";
                    break;
                  case "right":
                    data.justifyContent = "end";
                    break;
                  case "both":
                    data.justifyContent = "space-between";
                    break;
                }
              }}
            >
              <svg
                t="1723710885979"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="14923"
                width="22"
                height="22"
                data-id="left"
                style={{ fill: data.justifyContent === "start" ? "green" : "" }}
              >
                <path
                  data-id="left"
                  d="M96 128h832v96H96zM96 576h832v96H96zM96 352h576v96H96zM96 800h576v96H96z"
                  p-id="14924"
                ></path>
              </svg>
              <svg
                t="1723710900357"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="15247"
                width="22"
                height="22"
                data-id="center"
                style={{
                  fill: data.justifyContent === "center" ? "green" : "",
                }}
              >
                <path
                  d="M96 128h832v96H96zM96 576h832v96H96zM224 352h576v96H224zM224 800h576v96H224z"
                  p-id="15248"
                  data-id="center"
                ></path>
              </svg>

              <svg
                t="1723710864182"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="14599"
                width="22"
                height="22"
                data-id="right"
                style={{ fill: data.justifyContent === "end" ? "green" : "" }}
              >
                <path
                  data-id="right"
                  d="M96 128h832v96H96zM96 576h832v96H96zM352 352h576v96H352zM352 800h576v96H352z"
                  p-id="14600"
                ></path>
              </svg>

              <svg
                t="1723710893396"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="15085"
                width="22"
                height="22"
                data-id="both"
                style={{
                  fill: data.justifyContent === "space-between" ? "green" : "",
                }}
              >
                <path
                  data-id="both"
                  d="M96 128h832v96H96zM96 576h832v96H96zM96 352h832v96H96zM96 800h832v96H96z"
                  p-id="15086"
                ></path>
              </svg>
            </div>
          );
        },
      },
      {
        label: "风格",

        key: "",
        span: 16,
        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-input></el-input>;
        },
      },
    ],
  },
});
const bgConfig: Ref<BasicFormConfig> = ref({
  row: {
    gutter: 20,
    col: [
      {
        label: "颜色",
        pkey: "props",
        key: "style",
        span: 16,
        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-color-picker
                modelValue={data.backgroundColor ?? ""}
                onUpdate:modelValue={(e: string | null) => {
                  data.backgroundColor = e;
                }}
              ></el-color-picker>
            </>
          );
        },
      },
    ],
  },
});
const otherConfig = ref<BasicFormConfig>({
  row: {
    col: [
      {
        label: "点击打开弹窗",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "插槽",
        display: {
          relate: {
            key: "componentName",
            value: "ElCard",
          },
        },
        pkey: "props",
        key: "slot",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "maxlength",
        display: {
          relate: {
            key: "componentName",
            value: "ElInput",
          },
        },
        pkey: "props",
        key: "maxlength",
        props: { style: { display: "flex" } },
        render(data, col) {
          return <el-input-number></el-input-number>;
        },
      },
      {
        label: "border",
        display: {
          relate: {
            key: "componentName",
            value: "ElTable",
          },
        },
        pkey: "props",
        key: "border",

        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "pager",
        display: {
          relate: {
            key: "componentName",
            value: "ElTable",
          },
        },
        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-switch
                modelValue={Current.value.pager}
                onUpdate:modelValue={(e: boolean) => {
                  Current.value.pager = e;
                  if (e) {
                    Current.value.pagerConfig = pagerConfig;
                    if (pagerConfig.order !== null) {
                      pagerConfig.order++;
                    } else {
                      pagerConfig.order = 0;
                    }
                  } else {
                    PageConfig.value.methods[`onSearch${Current.value.pagerConfig?.order || ""}`] = {
                      type: "JSFunction",
                      value: `function onSearch${Current.value.pagerConfig?.order || ""} (data = {}) {
                         const { format, ...params } = searchParams.value[${Current.value.pagerConfig?.order}];
                         params.data = JSON.stringify({
                           ...Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== "")),
                         });
                         request<CommonResponse>(params).then((res) => {
                           state.tabledata${Current.value.pagerConfig?.order || ""} = format ? format(res) : res.data.rows;
                         });
                      };
                     `,
                    };
                    delete Current.value.pagerConfig;
                  }
                }}
              ></el-switch>
            </>
          );
        },
      },
      {
        display: {
          relate: {
            key: "componentName",
            value: "ElTable",
          },
        },
        label: "highlight-current-row",
        pkey: "props",
        key: "highlight-current-row",
        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        display: {
          relate: {
            key: "componentName",
            value: "ElTable",
          },
        },
        label: "show-overflow-tooltip",
        pkey: "props",
        key: "show-overflow-tooltip",
        props: { style: { display: "flex" } },

        render(data, col) {
          return <el-switch></el-switch>;
        },
      },
      {
        label: "type",

        key: "",
        display: {
          relate: {
            key: "componentName",
            value: "ElInput",
          },
        },
        props: { style: { display: "flex", flexDirection: "column" } },

        render(data, col) {
          return (
            <el-select>
              <el-option label="text" value="text"></el-option>
              <el-option label="password" value="password"></el-option>
              <el-option label="textarea" value="textarea"></el-option>
              <el-option label="number" value="number"></el-option>
            </el-select>
          );
        },
      },
    ],
  },
});
const seniorConfig: Ref<BasicFormConfig> = ref({
  row: {
    col: [
      {
        label: "是否渲染",

        display: {
          relate: {
            key: "componentName",

            value: "ElInput",
          },
        },

        key: "",
        props: { style: { display: "flex" } },
        render(data, col) {
          return (
            <>
              {!Current.value.condition ? (
                <el-switch></el-switch>
              ) : (
                <el-tag
                  onClose={() => {
                    delete Current.value.condition;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              )}
              <BindVar
                visible={false}
                onBindAfter={(val: string) => {
                  Current.value.condition = {
                    type: "JSExpression",
                    value: `${val}`,
                  };
                }}
              />
            </>
          );
        },
      },

      {
        label: "循环数据",

        pkey: "props",

        key: "border",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              {!Current.value.loop ? (
                <el-button round>编辑代码</el-button>
              ) : (
                <el-tag
                  onClose={() => {
                    delete Current.value.loop;
                    delete Current.value.loopArgs;
                  }}
                  closable
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  已绑定
                </el-tag>
              )}
              <BindVar
                visible={false}
                onBindAfter={(val: string) => {
                  Current.value.loop = {
                    type: "JSExpression",
                    value: `${val}`,
                  };

                  Current.value.loopArgs = ["item", "index"];
                  loopVar.value = val;
                  (Current.value.props ?? {}).key = {
                    type: "JSExpression",
                    value: "index",
                  };
                }}
              />
            </>
          );
        },
      },

      {
        label: "迭代变量命名",

        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                modelValue={(Current.value.loopArgs ?? [])[0]}
                placeholder="默认为item"
                onUpdate:modelValue={(e: string) => {
                  if (Current.value.loopArgs) {
                    Current.value.loopArgs[0] = e;
                  }
                }}
              ></el-input>
            </>
          );
        },
      },

      {
        label: "索引变量命名",

        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                modelValue={(Current.value.loopArgs ?? [])[1]}
                placeholder="默认为index"
                onUpdate:modelValue={(e: string) => {
                  if (Current.value.loopArgs) {
                    Current.value.loopArgs[1] = e;
                  }
                }}
              ></el-input>
            </>
          );
        },
      },

      {
        label: "key",

        key: "",

        props: { style: { display: "flex" } },

        render(data, col) {
          return (
            <>
              <el-input
                v-model={((Current.value.props ?? {}).key ?? {}).value}
                placeholder="默认为索引变量名"
              ></el-input>
            </>
          );
        },
      },
    ],
  },
});
</script>

<style lang="less" scoped>
.propSetting {
  width: 100%;
  height: 100%;
  // display: flex;
  // align-items: center;
}

.el-tabs__content {
  overflow: scroll !important;
}

.component-list {
  margin-top: 15px;
}

.base-component,
.block-component {
  list-style: none;
  padding: 5px;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    width: 90px;
    line-height: 25px;
    text-align: left;
    height: 25px;
    padding: 4px 5px;
    margin: 10px 5px;
    font-size: 13px;
    cursor: move;
    // border: 1px solid @border-color-base;
    border-radius: 5px;

    &:hover {
      border: 1px dashed @primary-color !important;
    }
  }
}

.infinite-list {
  width: 100%;
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;

  .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }
}
:deep(.el-tabs__nav-wrap::after) {
  height: 0; /* 移除底部的线 */
}
:deep(.el-tabs__nav) {
  float: none;
  justify-content: center;
}

</style>
