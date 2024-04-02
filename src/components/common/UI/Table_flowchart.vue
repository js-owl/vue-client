<template
  ><!--XTT236021--><!--10001--><!--TK(Table): Modification -->
  <el-table
    :data="data"
    :class="className"
    style="width: 100%"
    :cell-class-name="uazbodycell"
    :header-cell-class-name="uazheadercell"
    :row-class-name="uazbodyrow"
    :header-row-class-name="uazheaderrow"
    :empty-text="notFound"
    @row-click="handleRowClick"
    @sort-change="handleSort"
    @cell-dblclick="goToFlowchart"
    :span-method="spanMethod"
    :height="height ? height : null"
    ><!--@cell-dblclick="goToFlowchart"-->
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :label="column.label"
      :width="column.width"
      :prop="column.prop"
      :sortable="column.sortable"
    >
      <template #default="scope">
        <div v-if="column.html" v-html="scope.row[column.prop]" />
        <div v-else-if="!!column.formatter">
          {{ column.formatter(scope.row) }}
        </div>
        <!--$t('codeNumber').toUpperCase()-00161; Models wrap up list c modification -->
        <div v-else>
          <el-collapse v-if="column.prop == 'modifications'">
            <el-collapse-item
              :key="row.flowChart_id"
              v-for="(row, key) in scope.row[column.prop]"
              :title="scope.row[column.prop][key][0].productModel_name"
            >
              <div
                :key="index2"
                v-for="(row2, key2, index2) in scope.row[column.prop][key]"
              >
                <span
                  class="link_column"
                  @click="goToFlowchart2(row2, scope.row)"
                  >{{ formatName(row2.productModification_name) }}</span
                >
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-else>
            <span>{{ scope.row[column.prop] }}</span>
          </div>
        </div>
        <!--<div v-else>
          <div v-if="column.prop =='modifications'">
            <div :key="row.flowChart_id" v-for="(row,key,index) in scope.row[column.prop]">
              <div>{{scope.row[column.prop][key][0].productModel_name}}</div>
              <div :key="index2" v-for="(row2,key2,index2) in scope.row[column.prop][key]">
                <span @click="goToFlowchart2(row2,scope.row)">{{row2.productModification_name}}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <span>{{ scope.row[column.prop] }}</span>
          </div>
        </div>-->
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  data() {
    return {
      orders: [null],
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row',
      notFound: this.$t('notFound')
    }
  },
  props: [
    'data',
    'columns',
    'handleRowClick',
    'handleSort',
    'spanMethod',
    'className',
    'height'
  ],
  methods: {
    goToFlowchart: function(row, column, cell, event) {
      console.log(row, 'row')
      //this.$router.push('/flowcharts/detail/model-23/modification-18/year-2020/flowchart-3912');
    },
    goToFlowchart2: function(row, row2) {
      console.log(row, 'row')
      console.log(row2, 'row2')
      this.$router.push(
        '/flowcharts/detail/model-' +
          row.productModel_id +
          '/modification-' +
          row.productModification_id +
          '/year-' +
          row.revStart +
          '/flowchart-' +
          row2.flowChart_id +
          '/'
      )
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
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
}
.uaz-body-row {
  /*  background-color: #cfdbd9 !important;*/
}
.uaz-body-cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px !important;
  padding: 0 !important;
  font-weight: 600;
  font-size: 10px;
}
.el-table .cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px;
  padding: 0px 6px;
  font-weight: 600;
  font-size: 10px;
  text-align: left;
  word-break: break-word;
}
.el-table th.el-table__cell > .cell {
  color: #fff;
  width: 104%; /*Diagnostics : History - table - Date*/
}
.el-table {
  background-color: #cfdbd9;
  --el-table-row-hover-background-color: inherit;
}
.el-table tr {
  background-color: inherit;
  cursor: pointer;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  border-collapse: collapse;
}
.el-table td.el-table__cell {
  border: var(--el-table-border);
}
.el-table th.el-table__cell.is-leaf {
  border: none;
}
.el-table td.el-table__cell div > p {
  margin: 0;
}
.el-table tr td:first-child {
  text-align: center;
}
.el-table__empty-text {
  font-size: 10px;
  font-family: Arial;
  color: #000;
}
.el-table__row:hover {
  background: inherit;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: inherit;
}
.el-table__empty-block {
  align-items: start;
}
tr.uaz-header-row .cell {
  white-space: nowrap;
  word-break: break-all;
}
</style>
