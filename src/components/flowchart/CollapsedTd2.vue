<!--Parts-carousel-icon TK-->
<template>
  <div class="detail-collapse-tr flowchart_table scroll_table">
    <el-table
      :cell-class-name="uazbodycell"
      :header-cell-class-name="uazheadercell"
      :row-class-name="uazbodyrow"
      :header-row-class-name="uazheaderrow"
      :data="list"
      :empty-text="notFound"
      style="width: 100%"
      @cell-dblclick="cellClick"
    >
      <el-table-column
        prop="flowChart_code"
        :label="$t('code').toUpperCase()"
        width="50"
      />
      <el-table-column
        :prop="
          this.$i18n.locale == 'ru' ? 'flowChart_name' : 'flowChart_name_en'
        "
        :label="$t('title').toUpperCase()"
      />

      <el-table-column
        prop="parts"
        :label="$t('applicability').toUpperCase()"
        width="300"
      >
        <template #default="scope">
          <div
            class="diagnostic-structure__title--toggle"
            :class="{ active: active[scope.$index] }"
            @click="collapseClick(scope.$index)"
            v-if="scope.row.parts.length > 0"
          >
            <ul v-if="active[scope.$index]">
              <li v-for="item in scope.row.parts" :key="item.part_id">
                <span v-if="active[scope.$index]">
                  {{
                    this.$i18n.locale == 'ru' ? item.part_name : item.part_name
                  }}
                </span>
              </li>
            </ul>
            <span v-else>
              {{
                scope.row.parts[0].part_name_en
                  ? this.$i18n.locale == 'ru'
                    ? scope.row.parts[0].part_name
                    : scope.row.parts[0].part_name_en
                  : scope.row.parts[0].part_name
              }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'

export default {
  data() {
    return {
      list: [],
      active: {},
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row',
      notFound: this.$t('notFound')
    }
  },
  props: ['partGroupId', 'year', 'productModelId', 'productModificationId'],
  methods: {
    collapseClick(index) {
      this.active[index] = !this.active[index]
    },
    cellClick(elem) {
      this.$router.push(
        `/flowcharts/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/flowchart-${elem.flowChart_id}`
      )
      this.$emit('update:modelValue', false)
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
    },
    load() {
      Request.get('/flowchart', {
        params: {
          isPublish: 1,
          page: 1,
          partGroupId: this.partGroupId,
          productModelId: this.productModelId,
          productModificationId: this.productModificationId,
          section: 'flowcharts',
          type: 'all',
          year: this.year,
          time: new Date().getTime()
        }
      })
        .then(response => {
          this.list = response.data.data
        })
        .catch(function(error) {
          console.log('error', error.response.data.message)
        })
    }
  },
  async mounted() {
    await this.load()
  },
  watch: {
    partGroupId: async function(newValue, oldValue) {
      await this.load()
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
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
}
.el-table {
  background-color: #cfdbd9;
  --el-table-row-hover-background-color: inherit;
}
.el-table tr {
  background-color: inherit;
  cursor: pointer;
}
.detail-collapse-tr .el-table__body,
.detail-collapse-tr .el-table__footer,
.detail-collapse-tr .el-table__header {
  table-layout: auto;
  border-collapse: separate;
  text-transform: uppercase;
}
.el-table td.el-table__cell {
  border: var(--el-table-border);
}
.el-table td.el-table__cell:first-child,
.el-table th.el-table__cell:first-child {
  width: 10%;
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
.diagnostic-structure__title--toggle {
  display: flex;
}
.detail-collapse-tr {
  margin: 10px;
}
.detail-collapse-tr .diagnostic-structure__title--toggle:after {
  content: '';
  display: -ms-flexbox;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0;
  border-color: #000 transparent transparent;
  -ms-flex-item-align: center;
  align-self: start;
  margin: 6px 0 0 4px;
  cursor: pointer;
}
.diagnostic-structure__title--toggle > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detail-collapse-tr .diagnostic-structure__title--toggle.active:after {
  border-width: 0 4px 4px;
  border-color: transparent transparent #000;
}
.detail-collapse-tr .el-table .el-table__cell {
  vertical-align: top;
}
.flowchart__link_yet {
  font-size: 10px;
  text-decoration: underline;
  cursor: pointer;
}
.flowchart-detail .el-dialog__header {
  padding-bottom: 0px;
}
.detail-collapse-tr .el-table tbody tr:hover {
  background-color: #fff;
}
.detail-collapse-tr .el-table tbody tr:hover > td {
  border-top: 1px solid #013e2c;
  border-bottom: 1px solid #013e2c;
  border-left: none;
  border-right: none;
}
.detail-collapse-tr .el-table tbody tr:hover > td:first-child {
  border-left: 1px solid #013e2c;
}
.detail-collapse-tr .el-table tbody tr:hover > td:last-child {
  border-right: 1px solid #013e2c;
}
</style>
