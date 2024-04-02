<template>
  <div class="diagnostic_table_history">
    <div class="table_history">{{ $t('history') }}</div>
    <div class="diagnostic_table_history_indent"></div>
    <div class="diagnostic_history_table_pagination">
      <Table
        id="diagnostic_history"
        class="diagnostic_history scroll_table"
        :data="data"
        :columns="columns"
        :handleRowClick="handleRowClick"
        :handleSort="handleSort"
      />
      <Pagination :paginate="paginate" :currentChange="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import Table from '@/components/common/UI/Table.vue'
import Pagination from '@/components/common/UI/Pagination.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
export default {
  name: 'History',
  components: {
    Table,
    Pagination
  },
  props: ['setProp'],
  data() {
    return {}
  },
  methods: {
    formatter(row, column) {
      return [row.lname, row.fname].join(' ')
    },
    async handleRowClick(row, column) {
      await this.setProp({
        meta: 'defectInterviewId',
        data: row.defectInterview_id
      })
      await this.setProp({ meta: 'currentComponent', data: 'Report' })
    },
    handleSort({ column, prop, order }) {
      let sortingDirection = 'DESC'
      let sorting = ''
      if (prop === 'interview_created_at') {
        sorting = 'date'
      }
      if (prop === 'defectInterview_vin') {
        sorting = 'vin'
      }

      if (order === 'ascending') {
        sortingDirection = 'ASC'
      }

      const sortable = {
        sorting,
        sortingDirection
      }

      this.setSortable(sortable)
      this.loadHistory()
    },
    handleCurrentChange(val) {
      this.loadHistory()
    },
    ...mapMutations({
      setSortable: `diagnostic/${types.SET_HISTORY_SORTABLE}`
    }),
    ...mapActions({
      loadHistory: 'diagnostic/loadHistory'
    })
  },
  computed: {
    ...mapState({
      data: state => state.diagnostic.history.data,
      paginate: state => state.diagnostic.history.paginate
    }),
    columns() {
      return [
        {
          prop: 'lname',
          label: this.$t('user').toUpperCase(),
          formatter: this.formatter,
          width: 145
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'defect_description'
              : 'defect_description_en',
          label: this.$t('nameCD')
        },
        {
          prop: 'interview_created_at',
          label: this.$t('date'),
          sortable: 'custom',
          width: 110
        },
        {
          prop: 'defectInterview_vin',
          label: 'VIN',
          sortable: 'custom',
          width: 120
        },
        {
          prop: 'productModification_name',
          label: this.$t('modification'),
          width: 125
        }
      ]
    }
  },
  async mounted() {
    await this.loadHistory()
    console.log('columns', this.columns)
  },
  watch: {
    'this.$i18n.locale': function(newVal, oldVal) {
      console.log('newVal', newVal)
    }
  }
}
</script>
<style>
/*history*/
.diagnostic_table_history,
.diagnostic_history_table_pagination,
.diagnostic_history {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}
#diagnostic_history .has-gutter .el-table__cell {
  background-color: #5e7772 !important;
  line-height: 0px !important;
}

#diagnostic_history .el-table .cell {
  line-height: 0px !important;
}
.diagnostic_history .uaz-body-cell.el-table__cell:nth-child(3) div,
.diagnostic_history .uaz-body-cell.el-table__cell:nth-child(4) div,
.diagnostic_history .uaz-body-cell.el-table__cell:nth-child(5) div {
  white-space: nowrap; /*Diagnostic: history-table-Date*/
}
.diagnostic_history .has-gutter .el-table__cell:nth-child(2) div {
  margin-left: 0%;
}
.diagnostic_history
  .el-table__body
  .uaz-body-cell.el-table__cell:first-child
  div {
  text-align: left;
}
.table_history {
  text-transform: uppercase;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 17px;
}
.diagnostic_table_history_indent {
  background-color: #cfdbd9;
  padding: 1px 0 2px;
  border-left: 1px solid #ebeef5;
}
</style>
