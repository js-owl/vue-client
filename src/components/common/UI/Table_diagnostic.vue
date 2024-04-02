<template>
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
    :span-method="spanMethod"
    :height="height ? height : null"
  >
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
        <div v-else-if="column.prop == 'productModification_name'">
          <span
            @click="
              goToModfication(
                scope.row.productModel_id,
                scope.row.productModification_id
              )
            "
            class="table_uaz_link"
            >{{ scope.row[column.prop] }}</span
          >
        </div>
        <div v-else-if="column.prop == 'defect_code'">
          <span
            @click="
              goToCode(
                scope.row.productModel_id,
                scope.row.productModification_id,
                scope.row.defect_id,
                scope.row.structureFlowChart_id
              )
            "
            class="table_uaz_link"
            >{{
              scope.row['defect_code']
                ? scope.row['defect_code']
                : addZeroes(scope.row['defect_id'])
            }}</span
          >
        </div>
        <div v-else-if="column.prop == 'defect_description'">
          <span
            @click="
              goToCode(
                scope.row.productModel_id,
                scope.row.productModification_id,
                scope.row.defect_id,
                scope.row.structureFlowChart_id
              )
            "
            class="table_uaz_link"
          >
            {{ scope.row[column.prop] }}</span
          >
        </div>
        <div v-else>{{ scope.row[column.prop] }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
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
  mounted() {},
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
    ...mapMutations({
      setProp: `emaps/breadcrumbs`,
      setPropDiagnostic: `diagnostic/SET_PROP`,
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    }),
    goToModfication: function(modelId, modificationId) {
      this.$router.push(
        '/diagnostic/models-' +
          modelId +
          '/modification-' +
          modificationId +
          '/',
        {}
      )
    },
    goToCode: function(
      modelId,
      modificationId,
      defect_id,
      structureFlowChart_id
    ) {
      this.toClearSession()
      this.toClearTesting()
      this.setPropDiagnostic({ meta: 'defectId', data: defect_id })
      this.setPropDiagnostic({
        meta: 'structureFlowChartId',
        data: structureFlowChart_id
      })
      this.setPropDiagnostic({ meta: 'currentComponent', data: 'Preview' })
      this.$store.commit('model/SET_ID', modelId)
      this.$router.push(
        '/diagnostic/models-' +
          modelId +
          '/modification-' +
          modificationId +
          '/',
        {}
      )
    },
    addZeroes: function(str) {
      return str.toString().padStart(5, '0')
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
  width: 104%;
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
.table_uaz_link {
  color: #00008b;
  cursor: pointer;
}
.table_uaz_link:hover {
  text-decoration: underline;
}
</style>
