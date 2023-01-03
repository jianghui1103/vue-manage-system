<template>
  <div class="container">
    <div class="export">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-success="handleChange"
        :file-list="fileList"
        class="el-upload"
      >
        <el-button size="primary" type="primary">变现ecpm,点击上传</el-button>
      </el-upload>
    </div>
    <div class="table-parent">
      <el-table
        :data="tableData"
        class="table"
        border
        :default-sort="{ prop: 'ksCost', order: 'descending' }"
      >
        <el-table-column fixed prop="date" label="数据刷新时间" width="150" />
        <el-table-column prop="appName" label="应用名称" width="100" />
        <el-table-column prop="appCode" label="产品线" width="100" />
        <el-table-column prop="appFactory" sortable label="厂商" width="80" />
        <el-table-column prop="accountName" label="账户名称" width="120" />
        <el-table-column prop="ksCost" sortable label="快手消耗" width="120" />
        <el-table-column prop="ksOpen" sortable label="快手曝光" width="120" />
        <el-table-column prop="ksEcpm" sortable label="快手ecpm" width="120" />
        <el-table-column
          prop="sensorOpen"
          sortable
          label="神策曝光"
          width="120"
        />
        <el-table-column
          prop="openChange"
          sortable
          label="曝光转化率"
          width="120"
        />
        <el-table-column
          prop="costEcpm"
          sortable
          label="回本ecpm"
          width="120"
        />
        <el-table-column prop="getEcpm" sortable label="变现ecpm" width="120" />
        <!-- <el-table-column
          prop="expactRoi"
          sortable
          label="预估roi"
          width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope"> {{ scope.row.dataRate }}% </template>
        </el-table-column> -->

        <el-table-column prop="expactRoi" label="预估roi" width="140" />
      </el-table>
    </div>
  </div>
</template>

<script language="javascript">
import axios from 'axios'
import { read, utils } from 'xlsx' // 注意处理方法引入方式

export default {
  name: 'QuickAppManageMentRoi',
  data() {
    return {
      tableData: [], //快手数据
      table_Data: [], //快手数据
      ropanFilterData: [], //快手数据
      sensorList: [], //神策数据
      appCodeList: [], //appCode-appname对应关系
    }
  },

  mounted() {},

  methods: {
    // 导入成功时执行
    handleChange(res, file, fileList) {
      // 将文件放入
      for (let i = 0; i < fileList.length; i++) {
        if (file.name != fileList[i].name) {
          this.fileList.push({
            name: file.name,
            url: '',
            uid: file.uid,
          })
        }
      }
      const files = { 0: file }
      this.readExcel(files)
    },
    readExcel(file) {
      let self = this
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result
          const workbook = read(data, { type: 'binary' })
          const params = []
          // 取对应表生成json表格内容
          workbook.SheetNames.forEach((item) => {
            let table_item = utils.sheet_to_json(workbook.Sheets[item])

            table_item.forEach(function (upload_table_item, i) {
              console.log('upload_table_item', upload_table_item.应用)
              self.tableData.forEach(function (table_item, j) {
                if (
                  upload_table_item.应用 === table_item.appName &&
                  upload_table_item.厂商.toUpperCase() ==
                    table_item.appFactory.toUpperCase()
                ) {
                  table_item.getEcpm = Number(upload_table_item.变现ecpm)
                  if (table_item.costEcpm != 0) {
                    let point = table_item.getEcpm / table_item.costEcpm
                    table_item.expactRoi = (point * 100).toFixed(0) + '%'
                  }
                }
              })
            })
            // this.table_Data.push(utils.sheet_to_json(workbook.Sheets[item]))
          })
          // 该算法仅针对表头无合并的情况
          if (this.table_Data.length > 0) {
            // 获取excel中第一个表格数据tableData[0][0]，并且将表头提取出来
            for (const key in this.table_Data[0][0]) {
              this.tableHead.push(key)
            }
          }
          console.log('table_Data', this.table_Data)
          // 重写数据
        } catch (e) {
          console.log('error:' + e)``
          return false
        }
      }
      fileReader.readAsBinaryString(file[0].raw)
    },

    //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
    dateFormat(time, type) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      if (type === 2) {
        return year + '-' + month + '-' + day + '-' + hours
      } else if (type === 1) {
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
      } else {
        let temp = '00'
        if (minutes > 30) {
          temp = 30
        }
        return year + '-' + month + '-' + day + ' ' + hours + ':' + temp
      }
    },
  },
  async created() {
    try {
      let self = this

      //磁力罗盘 数据合并
      this.appCodeList = await axios.get(
        'http://admin-api.guangjiubusiness.com/flow/app/GetAppList'
      )
      let aList = await axios.get('/roi/ropan/ropan.json', {})
      let mergeRopan = []
      aList = aList.data.filter((item, index) => {
        if (index > 0) {
          item.forEach(function (ele, i) {
            mergeRopan.push(ele)
          })
        }
        return item && index != 0
      })

      //神策合并
      let sList = await axios.get('/roi/sensor/sensor.json', {})

      //过滤【账户=0】【消耗=0】的数据
      mergeRopan.forEach(function (ele, i) {
        let split = ele.ucUserName.split('-')
        let appName = split[0].replace('软件', '')
        if (ele.accountBalance > 0 && ele.adDspCost > 0) {
          let item = Object.assign(ele, {
            contactId: appName + '-' + split[1],
          })
          self.ropanFilterData.push(item)
        }
      })
      console.log(
        '罗盘过滤账户后的值共',
        self.ropanFilterData.length + '条',
        JSON.stringify(self.ropanFilterData)
      )

      //神策 过滤 账户为空,品牌为空 的数据
      sList.data.forEach(function (ele, i) {
        if (ele.by_values[1] && ele.by_values[2]) {
          //查询app名称
          //过滤【账户=0】【消耗=0】的数据
          let code_appname_array = ele.by_values[0].split('_')
          self.appCodeList.data.data.forEach(function (childItem, i) {
            // let queryIndex = code_appname_array[0]
            if (code_appname_array[0] === childItem.appCode) {
              let item = Object.assign(ele, {
                contactId: childItem.appName + '-' + ele.by_values[1],
              })
              self.sensorList.push(item)
            }
          })
        }
      })
      console.log(
        '神策过滤 账户为空,品牌为空 的数据共',
        self.sensorList.length + '条',
        JSON.stringify(self.sensorList)
      )

      //神策 过滤 账户为空,品牌为空 的数据
      self.sensorList.forEach(function (father, i) {
        //神策 过滤 账户为空,品牌为空 的数据
        self.ropanFilterData.forEach(function (child, i) {
          let childBrand = child.ucUserName.split('-')[3]

          if (
            father.contactId === child.contactId &&
            father.by_values[2].toUpperCase() === childBrand.toUpperCase()
          ) {
            self.tableData.push({
              appCode: father.by_values[0].split('_')[0],
              date: self.dateFormat(Date.now(), 3),
              appName: father.contactId.split('-')[0],
              appFactory: childBrand,
              accountName: father.contactId.split('-')[1],
              ksCost: child.adDspCost,
              ksOpen: Number(child.adItemImpression),
              sensorOpen: Number(father.values[0]),
              ksEcpm: Number(child.click1kCost.toFixed(2)),
              openChange: Number(
                (father.values[0] / child.adItemImpression).toFixed(2)
              ),
              costEcpm: Number(
                (
                  child.click1kCost /
                  (father.values[0] / child.adItemImpression)
                ).toFixed(2)
              ),
              getEcpm: '',
              expactRoi: '',
            })
          }
        })
      })
      //合并 表格数据
      // 1. 得到 app + 账户
      let obj = []
      var fisrtFilter = self.tableData.reduce((curr, next) => {
        /*判断对象中是否已经有该属性  没有的话 push 到 curr数组*/
        obj[next.appName + next.appFactory]
          ? ''
          : (obj[next.appName + next.appFactory] = curr.push(next))
        return curr
      }, [])

      console.log('【1】保留相同appName下，不同厂商的数据', fisrtFilter)

      // 2.追加数据。相同appName+appFactory 子账户数据
      let secondFilter = []
      fisrtFilter.forEach((itemParent) => {
        let tempArray = []
        let totalKsCost = 0
        let totalKsOpen = 0
        let totalKsEcpm = 0
        let totalSensorOpen = 0
        let totalOpenChange = 0
        let totalCostEcpm = 0

        self.tableData.forEach((itemChild) => {
          if (
            itemParent.appName === itemChild.appName &&
            itemParent.appFactory === itemChild.appFactory
          ) {
            //处理账户名称【accountName】
            itemParent.accountName =
              itemParent.accountName + ',' + itemChild.accountName
            let arr = itemParent.accountName.split(',')
            let newArr = [...new Set(arr)]
            itemParent.accountName = newArr.join(',')
            //汇总快手消耗【ksCost】
            totalKsCost += itemChild.ksCost
            ;(itemParent.ksCost = Number(totalKsCost.toFixed(2))),
              //汇总快手曝光【ksOpen】
              (totalKsOpen += itemChild.ksOpen)
            itemParent.ksOpen = totalKsOpen

            //汇总快手ecpm【ksEcpm】
            totalKsEcpm += itemChild.ksEcpm
            itemParent.ksEcpm = Number(totalKsEcpm.toFixed(2))
            //汇总神策曝光【sensorOpen】
            totalSensorOpen += itemChild.sensorOpen
            itemParent.sensorOpen = Number(totalSensorOpen.toFixed(2))

            //汇总曝光转化率【openChange】
            totalOpenChange += itemChild.openChange
            itemParent.openChange = Number(totalOpenChange.toFixed(2))
            //汇总回本ecpm【costEcpm】
            totalCostEcpm += itemChild.costEcpm
            itemParent.costEcpm = Number(totalCostEcpm.toFixed(2))

            tempArray.push({
              date: itemParent.date,
              appName: itemParent.appName,
              appFactory: itemParent.appFactory,
              accountName: itemChild.accountName,
              ksCost: itemChild.ksCost,
              ksOpen: itemChild.ksOpen,
              sensorOpen: itemChild.sensorOpen,
              ksEcpm: itemChild.ksEcpm,
              openChange: itemChild.openChange,
              costEcpm: itemChild.costEcpm,
              getEcpm: itemChild.getEcpm,
              expactRoi: itemChild.expactRoi,
            })
          }
        })
        secondFilter.push(
          Object.assign({}, itemParent, { children: tempArray })
        )
      })
      self.tableData = secondFilter
      console.log('【2】追加数据', secondFilter)
    } catch (error) {
      console.error(error)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.export {
  margin: 20px 140px;
  display: flex;
  justify-content: flex-end;
}
.table-parent {
}
.table {
  width: 100%;
  height: 100%;
  min-width: 100%;
}
</style>
