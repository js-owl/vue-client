<template>
  <el-table
    :data="data"
    style="width: 100%"
    :cell-class-name="uazbodycell"
    :header-cell-class-name="uazheadercell"
    :row-class-name="uazbodyrow"
    :header-row-class-name="uazheaderrow"
    @row-click="handleClick"
    :span-method="spanMethod"
  >
    <el-table-column prop="laborTime_name" :label="$t('name')" />
    <el-table-column
      prop="laborTime_norm"
      :label="$t('type').toUpperCase()"
      width="109"
      :formatter="formatter"
    />
    <el-table-column
      prop="laborTime_time"
      :label="$t('time').toUpperCase()"
      width="109"
    />
    <el-table-column
      prop="icon"
      :label="$t('flowchart').toUpperCase()"
      width="110"
    >
      <template #default="scope">
        <a
          :href="
            `/flowcharts/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/flowchart-${scope.row.flowChart_id}`
          "
          v-if="scope.row.flowChart_id"
          class="flowchart-icon-active"
        >
        </a>
        <span v-else class="flowchart-icon" />
      </template>
    </el-table-column>
    <el-table-column
      prop="icon"
      :label="$t('cancel').toUpperCase()"
      width="114"
    >
      <template #default="scope">
        <div style="text-align: center">
          <Switch
            class="flowchart_switch"
            :laborTimeId="scope.row.laborTime_id"
            :selectedValue="checkedList[scope.row.laborTime_id]"
            :onSwitch="onSwitch"
          />
        </div>
      </template>
    </el-table-column>
    <template #append>
      <div class="custom-footer">
        <h5>{{ $t('timeGeneral') }}: {{ getSum }}</h5>
      </div>
    </template>
  </el-table>
</template>

<script>
import Switch from '@/components/common/UI/Switch.vue'
import { mapState, mapMutations } from 'vuex'
import { types } from '@/store/modules/standtime'
export default {
  data() {
    return {
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row'
    }
  },
  components: {
    Switch
  },
  props: {
    year: {
      type: String
    },
    refreshSwitchers: {
      type: Number
    },
    spanMethod: {
      type: Function,
      default: function() {
        return { rowspan: 1, colspan: 1 }
      }
    }
  },
  methods: {
    handleClick(row, column) {},
    onSwitch: function(switchId, value) {
      const data = { ...this.checkedList, [switchId]: value }
      this.setProp({ meta: 'checkedList', data })
    },
    formatter(row, column) {
      if (row.laborTime_norm === '00' || row.laborTime_norm === '01') {
        return this.$t('minimal')
      } else {
        return this.$t('complex').toUpperCase()
      }
    },
    ...mapMutations({
      setProp: `standtime/${types.SET_PROP}`,
      setCheckList: `standtime/${types.SET_CHECKLIST}`
    })
  },
  computed: {
    getSum: function() {
      const sum =
        this.data.length > 0 &&
        this.data.reduce((acc, item) => {
          if (this.checkedList[item.laborTime_id]) {
            acc = acc + Number(item.laborTime_time)
          }
          return acc
        }, 0)

      return sum.toFixed(2)
    },
    ...mapState({
      data: state => state.standtime.data,
      selected: state => state.standtime.selected,
      checkedList: state => state.standtime.checkedList,
      productModelId: state => state.standtime.productModelId,
      productModificationId: state => state.standtime.productModificationId
    })
  },
  mounted() {
    this.setCheckList()
  },
  watch: {
    data: function(newValue, oldValue) {
      this.setCheckList()
    },
    refreshSwitchers: function(newValue, oldValue) {
      const data = { ...this.checkedList }
      Object.keys(data).forEach(function(element, key) {
        data[element] = true
      })
      this.setProp({ meta: 'checkedList', data })
    }
  }
}
</script>
<style>
.uaz-header-cell {
  font-size: 10px;
  font-family: Arial;
  color: #fff;
  text-transform: uppercase;
  line-height: 17px !important;
  background-color: #013e2c !important;
  padding: 0 !important;
}
.uaz-header-row {
  /* padding: 0 */
}
.uaz-body-row {
  /* border: 1px solid green */
}
.custom-footer {
  background-color: #013e2c;
  color: #fff;
  padding: 1px 10px;
  min-height: 17px;
  line-height: 3px;
  text-align: right;
  font-weight: bold;
}
.flowchart-icon {
  background-image: url(https://elis.uaz.ru/elis.uaz/img/icons.png);
  opacity: 0.4;
  background-position: -141px -137px;
  width: 25px;
  height: 20px;
  display: block;
  margin: 0 auto;
}
.flowchart-icon-active {
  background-image: url(https://elis.uaz.ru/elis.uaz/img/icons.png);
  background-position: -168px -5px;
  opacity: 1;
  width: 25px;
  height: 20px;
  margin: 0 auto;
  display: block;
}
.uaz-body-cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px !important;
  padding: 0 !important;
  font-weight: 600;
  font-size: 10px;
  /* border: 1px solid red; */
}
.el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #013e2c;
  color: #fff;
}
.el-table_1_column_1 {
  width: 861px;
}
.el-table_1_column_2 {
  width: 109px;
}
.el-table_1_column_3 {
  width: 109px;
}
.el-table_1_column_4 {
  width: 110px;
}
.el-table_1_column_5 {
  width: 114px;
}
.el-switch {
  --el-switch-height: 14px;
  --el-switch-button-size: 10px;
}
.flowchart_switch .el-switch__core {
  width: 26px !important;
}
</style>
