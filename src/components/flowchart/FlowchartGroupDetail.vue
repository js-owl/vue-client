<template>
  <div class="flowchart-detail">
    <el-dialog
      v-model="visible"
      width="800px"
      center
      custom-class="uaz__modal uaz__modal-sm alert__dialog"
      @close="cancelClick"
    >
      <!--uaz_parts_right_block_content_contianer -->
      <!-- flowchart: remove scroll only for  popup table: CODE, NAME, APPLICABILITY -->

      <template #title>
        <div class="uaz__modal-header">
          <h4 class="uaz__modal-header-h2 uaz__text-center uaz__margin--none">
            <span>{{ $t('flowcharts').toUpperCase() }}</span>
          </h4>
        </div>
      </template>

      <!-- class="uaz_parts_right_block_content_contianer" -->
      <CollapsedTd2
        v-model="visible"
        :productModelId="productModelId"
        :productModificationId="productModificationId"
        :year="year"
        :partGroupId="partGroupId"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Request } from '@/services/axios.service'
import CollapsedTd2 from '@/components/flowchart/CollapsedTd2.vue'

export default {
  data() {
    return {
      visible: ref(this.open)
    }
  },
  components: {
    CollapsedTd2
  },
  props: [
    'open',
    'cancelClick',
    'partGroupId',
    'year',
    'productModelId',
    'productModificationId'
  ],
  async mounted() {
    this.visible = this.open
  },
  updated: function() {
    this.visible = this.open
  },
  beforeUpdated: function() {}
}
</script>
<style>
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
.alert__dialog .uaz__modification-modal-info {
  padding: 25px;
  text-align: center;
  color: #000;
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
.flowchart-detail .el-dialog__headerbtn .el-icon {
  margin-right: 5px;
}
/* flowchart: remove scroll when popup table: CODE, NAME, APPLICABILITY*/
.flowchart-detail .el-overlay-dialog {
  overflow-y: hidden;
  margin-top: -70px;
}

.flowchart-detail .uaz_parts_right_block_content_contianer {
  overflow-y: hidden;
  /*height: 600px;*/
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.flowchart-detail .uaz_parts_right_block_content_contianer::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.flowchart-detail
  .uaz_parts_right_block_content_contianer::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.flowchart-detail
  .uaz_parts_right_block_content_contianer::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}
.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition.el-table.uaz_parts_right_block_content_contianer {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.flowchart-detail .el-table__body-wrapper.is-scrolling-none {
  height: 545px;
}
</style>
