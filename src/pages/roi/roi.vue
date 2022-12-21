<template>
  <el-table :data="tableData" style="width: 100%" height="100%">
    <el-table-column fixed prop="date" label="时间" width="150" />
    <el-table-column prop="appName" label="应用名称" width="120" />
    <el-table-column prop="appFactory" label="厂商" width="120" />
    <el-table-column prop="accountName" label="账户名称" width="120" />
    <el-table-column prop="ksCost" label="快手消耗" width="120" />
    <el-table-column prop="ksOpen" label="快手曝光" width="120" />
    <el-table-column prop="ksEcpm" label="快手ecpm" width="120" />
    <el-table-column prop="sensorOpen" label="神策曝光" width="120" />
    <el-table-column prop="openChange" label="曝光转化率" width="120" />
    <el-table-column prop="costEcpm" label="回本ecpm" width="120" />
    <el-table-column prop="getEcpm" label="变现ecpm" width="120" />
    <el-table-column prop="expactRoi" label="预估roi" width="120" />
  </el-table>
</template>

<script language="javascript">
import axios from 'axios'
export default {
  name: 'QuickAppManageMentRoi',
  data() {
    return {
      tableData: [],
    }
  },

  mounted() {},

  methods: {},
  created() {
    axios.get('/roi/20221212/2022121216' + '.json', {}).then((response) => {
      console.log('static', response.data)
      this.tableData = response.data
    })
  },
}
</script>

<style lang="scss" scoped></style>
