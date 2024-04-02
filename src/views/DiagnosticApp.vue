<template>
  <div class="uaz_parts_container">
    <div class="uaz_parts_left_part">
      <div class="uaz_parts_block_header_contianer">
        <div class="uaz_parts_block_header">
          <span class="direction-left">
            {{ $t('structure').toUpperCase() }}
          </span>
          <span class="direction-right" @click="showVinModal">
            {{ $t('modification') }}: {{ productModificationName }}
          </span>
          <!--, {{ productModelName }}-->
        </div>
      </div>
      <div class="scroll_table_container">
        <div class="uaz_parts_left_part_model_list_container">
          <DiagnosticTree
            :defectType="defectType"
            :setProp="setProp"
            :productModificationId="productModificationId"
          />
        </div>
      </div>
    </div>

    <div class="uaz_parts_right_part">
      <DiagnosticHistory
        v-if="currentComponent === 'History'"
        :setProp="setProp"
      />
      <DiagnosticPreview
        v-if="currentComponent === 'Preview'"
        :defectId="defectId"
        :startSession="handleStart"
      />
      <DiagnosticDefects
        v-if="currentComponent === 'Defects'"
        :defectType="defectType"
        :structureFlowChartId="structureFlowChartId"
        :productModificationId="productModificationId"
        :setProp="setProp"
      />
      <DiagnosticReport
        v-if="currentComponent === 'Report'"
        :defectInterviewId="defectInterviewId"
        :goToBack="goToBack"
      />
      <DiagnosticDescription
        v-if="currentComponent === 'Description'"
        :structureFlowChartId="structureFlowChartId"
      />
      <DiagnosticSession
        v-if="currentComponent === 'Session'"
        :defectId="defectId"
        :defectType="defectType"
        :setParentProp="setProp"
        :defectInterviewId="defectInterviewId"
        :openAlert="openAlert"
        :alertOpen="alertOpen"
      />
      <ModalContent v-if="showModal" v-model="showModal" :vin-info="vinInfo" />
    </div>
  </div>
  <teleport to="#header-middle">
    <div style="display: flex;">
      <Button
        :text="$t('history').toUpperCase()"
        :handleClick="
          () => setProp({ meta: 'currentComponent', data: 'History' })
        "
      />
      <Button
        style="margin-left: 10px"
        :text="$t('reset').toUpperCase()"
        :handleClick="openAlert"
      />
    </div>
  </teleport>
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
import { modificationNameFormatter } from '@/components/utils/helpers'
import DiagnosticReport from '@/components/diagnostic/DiagnosticReport.vue'
import DiagnosticTree from '@/components/diagnostic/DiagnosticTree.vue'
import DiagnosticDefects from '@/components/diagnostic/DiagnosticDefects.vue'
import DiagnosticPreview from '@/components/diagnostic/DiagnosticPreview.vue'
import DiagnosticSession from '@/components/diagnostic/DiagnosticSession.vue'
import DiagnosticHistory from '@/components/diagnostic/DiagnosticHistory.vue'
import DiagnosticDescription from '@/components/diagnostic/DiagnosticDescription.vue'
import AlertDialog from '@/components/diagnostic/AlertDialog.vue'
import Button from '@/components/common/UI/Button.vue'
import ModificationDialog from '@/components/diagnostic/ModificationDialog.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
export default {
  name: 'DiagnosticApp',
  components: {
    Button,
    AlertDialog,
    ModificationDialog,
    DiagnosticReport,
    DiagnosticTree,
    DiagnosticDefects,
    DiagnosticPreview,
    DiagnosticSession,
    DiagnosticHistory,
    DiagnosticDescription,
    ModalContent
  },
  data() {
    return {
      alertOpen: false,
      productModelName: '',
      modification: {},
      showModal: false,
      vinInfo: {}
    }
  },
  methods: {
    openAlert() {
      this.alertOpen = true
    },
    handleConfirm() {
      this.destroySession()
      this.handleCancel()
    },
    handleCancel() {
      this.alertOpen = false
    },
    showVinModal: function() {
      if (
        this.THROUGH_VIN &&
        (this.THROUGH_VIN.showInParts ||
          (this.THROUGH_VIN.alternative &&
            this.THROUGH_VIN.alternative.showInParts))
      ) {
        this.vinInfo = this.THROUGH_VIN
      } else {
        this.vinInfo = this.productModification
      }
      this.showModal = true
    },
    destroySession() {
      this.toClearTesting()
      this.toClearSession()
      this.$router.push('/diagnostic')
      this.$store.commit('section/SET_PAGE_LEVEL', 0)
    },
    goToBack() {
      this.setProp({ meta: 'currentComponent', data: 'History' })
    },
    async handleStart() {
      await this.toClearTesting()
      await this.createInterview()
      this.setProp({ meta: 'currentComponent', data: 'Session' })
    },
    createInterview() {
      let formData = new FormData()

      formData.append('defect_id', this.defectId)
      formData.append('modification', this.productModificationId)
      if (this.vinThrough && this.vinThrough.showInDiagnostic) {
        formData.append('vin', this.vinThrough.vin)
      }
      Request.post(`defectinterview/create`, formData)
        .then(response => {
          this.setProp({
            meta: 'defectInterviewId',
            data: response.data.data.defectInterview_id
          })
        })
        .catch(function(error) {
          console.log('DiagnosticApp', { err })
        })
    },
    load() {
      Request.get(`/productmodification/get/${this.productModificationId}`, {
        params: {}
      })
        .then(response => {
          this.modification = response.data
          this.productModelName = response.data.productModel_name
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    ...mapMutations({
      setProp: `diagnostic/${types.SET_PROP}`,
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    })
  },
  watch: {},
  computed: {
    ...mapState({
      defectId: state => state.diagnostic.defectId,
      defectInterviewId: state => state.diagnostic.defectInterviewId,
      defectType: state => state.diagnostic.defectType,
      currentComponent: state => state.diagnostic.currentComponent,
      structureFlowChartId: state => state.diagnostic.structureFlowChartId,
      productModification: state => state.modification,
      productModificationId: state => state.modification.productModification_id,
      productModificationName: state =>
        modificationNameFormatter(state.modification.productModification_name),
      vinThrough: state => state.vinThrough.THROUGH_VIN
    })
  },
  async mounted() {
    await this.load()
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>
<style scoped>
.uaz_parts_left_part,
.uaz_parts_right_part {
  height: 100%;
  /*overflow: auto;*/
  overflow-x: hidden;
}
.uaz_parts_left_part {
  width: 142px;
}
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}

.uaz_parts_block_header {
  flex-grow: 1;
  line-height: 18px;
  padding: 0;
  width: 50%;
  padding: 0px 5px;
}

.uaz_parts_container {
  position: relative;
}
.uaz_parts_block_header .direction-left {
  float: left;
}
.uaz_parts_block_header .direction-right {
  float: right;
  cursor: pointer;
}
.uaz_parts_block_header {
  line-height: 17px;
}
/*remove scroll*/
.uaz_parts_left_part {
  overflow-y: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
