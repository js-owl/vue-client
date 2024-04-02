<template>
  <el-dialog
    v-model="centerDialogVisible"
    width="600px"
    center
    custom-class="uaz__modal uaz__modal-sm"
    @close="buttonClick"
  >
    <template #title>
      <div class="uaz__modal-header">
        <h4 class="uaz__modal-header-h2 uaz__text-center uaz__margin--none">
          <span>{{ head }}</span>
        </h4>
      </div>
    </template>
    <div
      class="uaz__modal-body uaz__modification-modal-info"
      id="uaz__modal-body"
      style="overflow: hidden"
    >
      <el-row>
        <el-col :span="8" class="title">{{ $t('model') }}:</el-col>
        <el-col :span="16" class="body">{{ data.productModel_name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="title"> {{ $t('modification') }}:</el-col>
        <el-col :span="16" class="body">{{ productModificationName() }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="title">{{ $t('engine') }}:</el-col>
        <el-col :span="16" class="body">{{ data.engine_type_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="title">{{ $t('engineCode') }}:</el-col>
        <el-col :span="16" class="body">{{ data.engine_type_code }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="title">{{ $t('availableIn') }}:</el-col>
        <el-col :span="16" class="body">
          <div v-if="data.showInParts">- {{ $t('parts').toUpperCase() }}</div>
          <div v-if="data.showInLaborTime">
            - {{ $t('standtime').toUpperCase() }}
          </div>
          <div v-if="data.showInFlowchart">
            - {{ $t('flowcharts').toUpperCase() }}
          </div>
          <div v-if="data.showInEmaps">- {{ $t('emaps').toUpperCase() }}</div>
          <div v-if="data.showInDiagnostic">
            - {{ $t('diagnostic').toUpperCase() }}
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="uaz__modal-footer uaz__modification-modal-footer ng-scope">
        <button
          @click="buttonClick"
          class="uaz__btn uaz__btn-default uaz__center"
        >
          OK
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from 'vue'
import { modificationNameFormatter } from '@/components/utils/helpers'

export default {
  data() {
    return {
      centerDialogVisible: ref(false)
    }
  },
  props: ['dialogOpen', 'buttonClick', 'data', 'head'],
  mounted() {
    this.centerDialogVisible = this.dialogOpen
  },
  updated: function() {
    this.centerDialogVisible = this.dialogOpen
  },
  methods: {
    productModificationName: function() {
      return modificationNameFormatter(this.data.productModification_name)
    }
  },
  beforeUpdated: function() {}
}
</script>
<style scoped>
.el-row {
  padding-bottom: 10px;
}
.title {
  color: #000;
}
.body {
  color: #000;
  font-weight: 100;
}
.uaz__modal {
  font-weight: 600;
  background-color: #fff;
  box-shadow: 0 0 10px #000;
  font-size: 10px;
}
.uaz__modal-header {
  position: relative;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
}
.uaz__modal-header-h2 {
  margin: 0;
  padding: 0;
}
.el-dialog {
  --el-dialog-padding-primary: 0;
}
.el-icon {
  padding-right: 5px;
  --el-color-info: white;
}
.uaz__modification-modal-info {
  padding: 25px;
}
.uaz__modification-modal-footer .uaz__btn {
  height: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.uaz__btn-default {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  background-color: #013e2c;
  font-weight: 700;
  font-size: 10px;
}
.diagnostic-notification__item .warning {
  color: red;
}
.diagnostic-notification__item .notice {
  color: #1e90ff;
}
.fa,
.far,
.fas {
  font-family: 'Font Awesome 5 Free';
}
.fa-exclamation-triangle:before {
  content: '\f071';
}
.fa,
.fab,
.fad,
.fal,
.far,
.fas {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}
.uaz__text-warning {
  color: orange;
}
.uaz__text-danger {
  color: #a94442;
}
.el-dialog__headerbtn .el-icon {
  padding: 3px;
}
</style>
