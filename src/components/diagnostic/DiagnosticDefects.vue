<template>
  <Table
    class="diagnostic_defects"
    :data="data"
    :columns="columns"
    :handleRowClick="handleRowClick"
    height="100%"
  />
  <AlertDialog
    :open="alertOpen"
    :bodyModal="$t('sureDiagnostic')"
    :headModal="$t('confirmDiagnostic').toUpperCase()"
    :confirmClick="handleConfirm"
    :cancelClick="handleCancel"
  />
</template>

<script>
import { Request } from '@/services/axios.service'
import Table from '@/components/common/UI/Table.vue'
import AlertDialog from '@/components/diagnostic/AlertDialog.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
export default {
  name: 'DiagnosticDefects',
  components: {
    Table,
    AlertDialog
  },
  data() {
    return {
      data: [],
      alertOpen: false,
      tempRow: {}
    }
  },
  props: [
    'defectType',
    'structureFlowChartId',
    'productModificationId',
    'setProp'
  ],
  computed: {
    columns() {
      return [
        {
          prop: 'defect_code',
          label: this.$t('code').toUpperCase(),
          width: 100,
          formatter: this.formatter
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'defect_description'
              : 'defect_description',
          label: this.$t('description').toUpperCase()
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'defect_descriptionError'
              : 'defect_descriptionError',
          label: '',
          html: true
        }
      ]
    },
    ...mapState({
      defectId: state => state.diagnostic.defectId
    })
  },
  methods: {
    ...mapMutations({
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    }),
    formatter(row, column) {
      if (row.defect_type === 'defectbycode') {
        return row.defect_code
      } else {
        return String(row.defect_id).padStart(5, '0')
      }
    },
    async handleRowClick(row, column) {
      if (this.defectId) {
        this.tempRow = row
        this.openAlert()
      } else {
        this.setProp({ meta: 'defectId', data: row.defect_id })
        this.setProp({ meta: 'currentComponent', data: 'Preview' })
      }
    },
    load() {
      Request.get(`diagnostic/`, {
        params: {
          productModification_id: this.productModificationId,
          request_target: this.defectType,
          structureFlowChart_id: this.structureFlowChartId
        }
      })
        .then(response => {
          this.data = response.data && response.data.data
        })
        .catch(function(error) {
          console.log('DiagnosticPreview', error.response.data.message)
        })
    },
    openAlert() {
      this.alertOpen = true
    },
    handleConfirm() {
      this.setProp({ meta: 'defectId', data: this.tempRow.defect_id })
      this.setProp({ meta: 'currentComponent', data: 'Preview' })
      this.alertOpen = false
    },
    handleCancel() {
      this.alertOpen = false
    },
    destroySession() {
      this.toClearTesting()
      this.toClearSession()
    }
  },
  async mounted() {
    await this.load()
  },
  watch: {
    structureFlowChartId: async function(newValue, oldValue) {
      await this.load()
    },
    defectType: function(newValue, oldValue) {
      // TODO make better
      this.data = []
      if (newValue === 'defectbyfeature') {
        this.columns[0].label = this.$t('number').toUpperCase()
        this.columns[1].label = this.$t('defectByFeature').toUpperCase()
      } else {
        this.columns[0].label = this.$t('code').toUpperCase()
        this.columns[1].label = this.$t('description').toUpperCase()
      }
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>

<style>
.diagnostic_defects .has-gutter .el-table__cell:nth-child(2) div {
  margin-left: 14%;
}
.diagnostic_defects
  .el-table__body
  .uaz-body-cell.el-table__cell:first-child
  div {
  text-align: center;
}

/*Диагностике: скролл только для Таблица: КОД и ОПИСАНИЕ 
не должно быть скролла в других вкладках*/
.diagnostic_defects .is-scrolling-none {
  overflow-y: auto;
  height: 100%;
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.diagnostic_defects .is-scrolling-none::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.diagnostic_defects .is-scrolling-none::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.diagnostic_defects .is-scrolling-none::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}
</style>
