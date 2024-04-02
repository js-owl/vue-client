<template>
  <div class="diagnostic_report_table">
    <div class="uaz_parts_block_header_contianer">
      <div class="uaz_parts_block_header__modification">
        {{ $t('viewResult').toUpperCase() }}
      </div>
    </div>

    <div class="diagnostic-structure__pad diagnostic-structure__pad_vin">
      <el-row :gutter="20">
        <el-col :span="4">
          <p style="padding-bottom: 30px;">
            <Button
              :text="$t('back').toUpperCase()"
              :handleClick="handleButtonClick"
            />
          </p>
        </el-col>
        <el-col :span="20"></el-col>
      </el-row>

      <el-row :gutter="20" class="el_row_label">
        <el-col :span="12">
          <label>{{ $t('user') }}:</label>
          {{ user }}
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>

      <el-row :gutter="20" class="el_row_label">
        <el-col :span="12">
          <label> {{ $t('modification') }}:</label>
          {{ productModificationName }}
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row
        v-if="data && data[0] && data[0].defectInterview_vin"
        :gutter="20"
        class="el_row_label"
      >
        <el-col :span="12">
          <label>VIN:</label>
          {{ data[0].defectInterview_vin }}
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </div>

    <Table
      class="diagnostic_report scroll_table"
      :data="data"
      :columns="columns"
      :spanMethod="spanMethod"
      :className="'report'"
    />
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import { modificationNameFormatter } from '@/components/utils/helpers'
import Table from '@/components/common/UI/Table.vue'
import Button from '@/components/common/UI/Button.vue'

export default {
  components: {
    Table,
    Button
  },
  props: ['defectInterviewId', 'goToBack'],
  data() {
    return {
      data: [],
      productModificationName: '',
      productModelName: '',
      user: ''
    }
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex < 2) {
          return { rowspan: 1, colspan: 1 }
        } else if (columnIndex === 2) {
          return { rowspan: 1, colspan: 4 }
        } else if (columnIndex === 6) {
          return { rowspan: 1, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
      if (rowIndex === this.data.length - 1) {
        if (columnIndex === 3) {
          return { rowspan: 1, colspan: 3 }
        } else if (columnIndex === 4 || columnIndex === 5) {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    formatterCode(row, column) {
      if (row.defect_type === 'defectbycode') {
        return row.defect_code
      } else {
        return String(row.defect_id).padStart(5, '0')
      }
    },
    formatter(row, column) {
      if (row.logDefect_stage === 'create') {
        return this.$t('testBegin')
      }
      if (row.logDefect_stage === 'complete') {
        return this.$t('result')
      }
      return row.logDefect_stage
    },
    handleButtonClick() {
      this.goToBack()
    },
    load() {
      Request.get(`/logdefect/`, {
        params: {
          defectInterview_id: this.defectInterviewId
        }
      })
        .then(response => {
          this.data = response.data.data
          if (this.data && this.data.length > 0) {
            //this.user = [this.data[0].lname, this.data[0].fname, this.data[0].mname].join(' ')
            //remove father name
            this.user = [this.data[0].lname, this.data[0].fname].join(' ')
            if (this.data[0].defect_type === 'defectbyfeature') {
              this.columns[0].label = this.$t('malfunctionNumber').toUpperCase()
            }

            this.productModelName = this.data[0].productModel_name
            this.productModificationName = modificationNameFormatter(
              this.data[0].productModification_name
            )
          }
        })
        .catch(function(error) {
          console.log('DiagnosticReport', error.response.data.message)
        })
    }
  },
  computed: {
    columns() {
      return [
        {
          prop: 'defect_code',
          label: this.$t('defectCode').toUpperCase(),
          formatter: this.formatterCode,
          width: 167
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'defect_description'
              : 'defect_description_en',
          label: this.$t('nameCD').toUpperCase(),
          width: 167
        },
        {
          prop: 'logDefect_stage',
          label: this.$t('step').toUpperCase(),
          formatter: this.formatter,
          width: 95
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'logDefect_action'
              : 'logDefect_action_en',
          label: this.$t('descriptionAction').toUpperCase(),
          width: 165
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'logDefect_question'
              : 'logDefect_question_en',
          label: this.$t('question'),
          width: 250
        },
        {
          prop:
            this.$i18n.locale == 'ru'
              ? 'logDefect_answer'
              : 'logDefect_answer_en',
          label: this.$t('response').toUpperCase(),
          width: 50
        },
        { prop: 'stage_created_at', label: this.$t('date'), width: 110 }
      ]
    }
  },
  watch: {
    defectInterviewId: function(newValue, oldValue) {
      this.load()
    }
  },
  async mounted() {
    await this.load()
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>
<style>
.diagnostic_report_table,
.diagnostic_report {
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.diagnostic-structure__pad {
  padding: 5px;
  position: relative;
}
.report .el-table__body tr:first-child td:first-child div.cell {
  display: none;
}
.report .el-table__body tr:first-child td:nth-child(2) div.cell {
  display: none;
}
.report .el-table__body tr td {
  border-right: 1px solid #cfdbd9;
}
.report .el-table__body tr td div.cell {
  font-weight: 100;
}
.report .el-table__body tr:last-child td div.cell {
  font-weight: 600;
}
.diagnostic_report .el-table__body,
.diagnostic_report .el-table__header {
  width: 100% !important;
}
.diagnostic_report .uaz-body-cell {
  vertical-align: top;
}
.diagnostic_report col:nth-child(1) {
  width: 15%;
}
.diagnostic_report col:nth-child(2) {
  width: 15%;
}
.diagnostic_report col:nth-child(3) {
  width: 10%;
}
.diagnostic_report col:nth-child(4) {
  width: 15%;
}
.diagnostic_report col:nth-child(5) {
  width: 15%;
}
.diagnostic_report col:nth-child(6) {
  width: 15%;
}
.diagnostic_report col:nth-child(7) {
  width: 15%;
}

.diagnostic-structure__pad_vin .el_row_label label {
  display: inline-block;
  width: 118px;
}
</style>
