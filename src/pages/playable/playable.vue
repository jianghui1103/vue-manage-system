<template>
  <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">
    <el-form-item label="快应用包名" required prop="appName">
      <el-select v-model="form.appName" placeholder="请选择包名">
        <el-option
          v-for="(item, index) in appCodeArray"
          :key="index"
          :label="item.appName"
          :value="item.appAcronym"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="模版" required prop="templateVersion">
      <el-select v-model="form.templateVersion" placeholder="请选择版本">
        <el-option v-for="(item, index) in 7" :key="index" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="账户名称" required prop="marketCode">
      <el-input
        v-model="form.marketCode"
        style="width: 400px"
        placeholder="拼接marketcode后俩段，例：mfxsdq_ad_liangx04_jrtt1002"
      />
      <el-tooltip effect="dark" placement="top">
        <template #content>
          <p>marketcode字段格式说明：</p>
          <p>头条：mfxsdq_ad_liangx04_jrtt1002</p>
          <p>快手：jddcy_ad_yg01_ks1001</p>
          <p>vivo：jddcy_ad_yg01_vivo1001</p>
          <p>oppo：jddcy_ad_yg01_oppo1001</p>
        </template>
        <el-icon style="font-size: 16px; margin-left: 10px"
          ><QuestionFilled
        /></el-icon>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="厂商类型">
      <el-radio-group v-model="form.type" class="ml-4">
        <el-radio label="toutiao">头条</el-radio>
        <el-radio label="kuaishou">快手</el-radio>
        <el-radio disabled label="baidu">百度</el-radio>
        <el-radio disabled label="tencent">腾讯</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="环境限制" v-if="form.type === 'kuaishou'">
      <el-checkbox-group v-model="form.limit" :min="1">
        <el-checkbox label="KsWebView">站内</el-checkbox>
        <el-checkbox label="KSADSDK">联盟</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="拉起类型">
      <el-radio-group v-model="form.frequency" class="ml-4">
        <el-radio label="none">无自动拉</el-radio>
        <el-radio label="double">双拉</el-radio>
        <el-radio label="noLimit">多拉</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleClickGetLanding(ruleFormRef)"
        :disabled="isPLLoading"
        :loading="isLPLoading"
        style="margin-right: 20px"
        >生成落地页</el-button
      >
      <el-button
        type="primary"
        @click="submitForm(ruleFormRef)"
        :disabled="isLPLoading"
        :loading="isPLLoading"
        >生成pl</el-button
      >
      <el-button type="primary" @click="goToReportPage">ROI实时报表</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import axios from '@/axios/index'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router' // 传递参数用 useRouter
const router = useRouter()

const ruleFormRef = ref<FormInstance>()
// do not use same name with ref
// form表单参数
const form = reactive({
  appName: '',
  marketCode: '',
  templateVersion: 1,
  type: 'toutiao',
  frequency: 'double',
  limit: ['KsWebView', 'KSADSDK'],
})
// form规则
const rules = reactive<FormRules>({
  marketCode: [{ required: true, message: '请填写账户名称', trigger: 'blur' }],
  appName: [{ required: true, message: '请选择包名', trigger: 'change' }],
  templateVersion: [
    { required: true, message: '请选择版本', trigger: 'change' },
  ],
})

// playable 按钮loading
let isPLLoading = ref<Boolean>(false)
// landingpage 按钮loading
let isLPLoading = ref<Boolean>(false)
// 提交请求
const submitForm = async (
  formEl: FormInstance | undefined,
  isLandingPage?: Boolean | undefined
) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 如果是落地页, 更改一下数据类型，新增厂商字段
      const limit = form.type === 'kuaishou' ? form.limit : [];
      const params = {
        marketCode: form.marketCode,
        appName: form.appName,
        templateVersion: form.templateVersion,
        type: form.type,
        manufacturer: form.type,
        frequency: form.frequency,
        limit: JSON.stringify(limit),
      }
      if (isLandingPage) {
        params.type = 'landingPage'
        isLPLoading.value = true
      } else {
        isPLLoading.value = true
      }
      try {
        const data = await axios.get(`/api/DownLoadZip`, params)
        if (isLandingPage) {
          window.open(String(data.data))
        } else {
          window.location.href = String(data.data)
        }
      } catch (err) {}
      isLPLoading.value = false
      isPLLoading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 获取快应用包
interface AppListItemType {
  appAcronym: string
  appCode: string
  appName: string
  appPackage: string
  createTime: string
  desc: string
  id: string
  jL_AppId: string
  oauthUrl: string
  platform: string
  topOn_AppId: string
  type: string
  updateTime: string
  status: number
}
const appCodeArray = ref<AppListItemType[]>([])
const getAppList = async () => {
  const data = await axios.get<AppListItemType[]>(
    `http://admin-api.guangjiubusiness.com/flow/app/GetAppList?pageIndex=0&pageSize=100`
  )
  if (data.code != 200) {
    return ElMessage.error(data.msg)
  }
  let appList: AppListItemType[] = data.data || []
  appCodeArray.value = appList.filter((item) => {
    return item.platform === '3'
  })
}
// 点击获取落地页地址
const handleClickGetLanding = (formEl: FormInstance | undefined) => {
  submitForm(formEl, true)
}
getAppList();

// 点击获取落地页地址
const goToReportPage = () => {
  router.push({
    path: '/roi',
  })
}
</script>
