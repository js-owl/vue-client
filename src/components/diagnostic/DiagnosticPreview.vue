<template>
  <div class="uaz_parts_block_header_contianer">
    <div class="uaz_parts_block_header__modification">
      {{ $t('description').toUpperCase() }}
    </div>
  </div>
  <div class="scroll_table_container scroll_table_container">
    <el-row :gutter="20" class="table_diagnostic_description">
      <el-col :span="4">
        <div class="diagnostic-structure__pad_left">
          {{
            this.defectData.defect_type === 'defectbycode'
              ? this.$t('code')
              : this.$t('number')
          }}
          {{ $t('malfunctions') }}
        </div>

        <!--<div class="diagnostic-structure__pad_left" v-if="defectData = textState">{{codeText}}</div>-->
      </el-col>
      <el-col :span="20">
        <div class="diagnostic-structure__pad_right">{{ code }}</div>
        <Button
          :text="$t('diagnosticBegin').toUpperCase()"
          :handleClick="startSession"
        />
      </el-col>

      <el-col :span="4">
        <div class="diagnostic-structure__pad_left">
          {{ $t('defectDescription') }}
        </div>
      </el-col>
      <el-col :span="20">
        <div class="diagnostic-structure__pad_right">
          {{
            this.$i18n.locale == 'ru'
              ? defectData.defect_description
              : defectData.defect_description_en
          }}
        </div>
      </el-col>

      <el-col :span="4">
        <div class="diagnostic-structure__pad_left">{{ $t('structure') }}</div>
      </el-col>
      <el-col :span="20">
        <div class="diagnostic-structure__pad_right">
          {{ defectData.structureFlowChart_path }}
          {{
            this.$i18n.locale == 'ru'
              ? defectData.structureFlowChart_name
              : defectData.structureFlowChart_name_en
          }}
        </div>
      </el-col>
    </el-row>

    <CollapseTable :data="modifications" />
    <Table
      v-if="emaps.length > 0"
      :data="emaps"
      :columns="columns"
      :handleRowClick="handleRowClick"
    />

    <div v-if="defectData.defect_descriptionError">
      <div class="uaz_parts_block_header_contianer">
        <div class="uaz_parts_block_header__modification">
          {{ $t('errorDescription').toUpperCase() }}
        </div>
      </div>
      <div style="padding:10px;" v-html="defectData.defect_descriptionError" />
    </div>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import Table from '@/components/common/UI/Table.vue'
import Button from '@/components/common/UI/Button.vue'
import CollapseTable from './CollapseTable.vue'

export default {
  components: {
    CollapseTable,
    Table,
    Button
  },
  data() {
    return {
      modifications: [],
      defectData: {},
      emaps: []
    }
  },
  props: ['defectId', 'startSession'],
  methods: {
    handleRowClick(row, column) {},
    load() {
      Request.get(`diagnostic/getdefect/${this.defectId}`, {
        params: {
          time: Date.now()
        }
      })
        .then(response => {
          this.defectData = response.data
          this.emaps = response.data.emaps
          this.modifications = response.data.modifications
        })
        .catch(function(error) {
          console.log('DiagnosticPreview', error.response.data.message)
        })
    }
  },
  computed: {
    code() {
      if (!this.defectData.defect_type) {
        return ''
      }
      if (this.defectData.defect_type === 'defectbycode') {
        return this.defectData.defect_code
      } else {
        return String(this.defectData.defect_id).padStart(5, '0')
      }
    },
    columns() {
      return [
        { prop: 'electricGroup_name', label: this.$t('emaps').toUpperCase() }
      ]
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
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  text-align: left;
}
.uaz_parts_block_header__modification {
  flex-grow: 1;
  padding: 4px;
}
.diagnostic-structure__pad_left,
.diagnostic-structure__pad_right {
  padding: 5px;
  position: relative;
  text-align: left;
}
.diagnostic-structure__pad_right button {
  float: left;
}
/*Diagnostic : Description-> "Show All"-was 1/2 scroll and 1/2 table - set to normal */
.table_diagnostic_description {
  width: auto !important;
}
</style>
