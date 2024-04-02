<template>
  <div
    class="vin-panel"
    v-if="
      vinInfo.productModel_name ||
        (vinInfo.alternative && vinInfo.alternative.productModel_name)
    "
  >
    <div class="vin-panel-title">{{ $t('modification') }}:</div>
    <div v-if="vinInfo.productModel_name" class="vin-panel-content">
      {{ vinInfo.productModel_name }}
      {{ formatModificationName(vinInfo.productModification_name) }}
      <span class="panel_content_header_help" @click="showVinModal">
        <i class="fas fa-exclamation"></i>
      </span>
      <span @click="resetVin"><i class="exclamation fas fa-times"></i></span>
    </div>
    <div v-else class="vin-panel-content">
      {{ vinInfo.make_code }} {{ vinInfo.model }}
      <span @click="showVinModal"><i class="fas fa-exclamation"></i></span>
      <span @click="resetVin"><i class="exclamation fas fa-times"></i></span>
    </div>
  </div>
  <ModalContent v-if="showModal" v-model="showModal" :vin-info="vinInfo" />
</template>
<script>
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import { mapState } from 'vuex'
export default {
  props: {},
  data() {
    return {
      vinInfo: {},
      showModal: false
    }
  },
  computed: {
    ...mapState('vinThrough', ['VIN_SATUS', 'THROUGH_VIN'])
  },
  components: {
    ModalContent
  },
  mounted() {
    this.checkVinInfo()
  },
  watch: {
    THROUGH_VIN: 'refrehVin'
  },
  methods: {
    formatModificationName: function(val) {
      return modificationNameFormatter(val)
    },
    refrehVin: function() {
      this.vinInfo = this.THROUGH_VIN
      this.$store.commit('vinThrough/SET_VIN_STATUS', 'updated')
    },
    checkVinInfo: function() {
      if (this.THROUGH_VIN) {
        this.vinInfo = this.THROUGH_VIN
      }
    },
    resetVin: function() {
      this.$store.commit('vinThrough/SET_VIN_STATUS', 'not set')
      this.$store.commit('vinThrough/SET_THROUGH_VIN', '')
      this.vinInfo = {}
      this.resetGlobalValues()
    },
    showVinModal: function() {
      this.showModal = true
    },
    resetGlobalValues: function() {
      this.$store.commit('model/RESET', '')
      this.$store.commit('standtime/SET_CLEAR_VIN', '')
      //this.$store.commit('modification/RESET');
    }
  }
}
</script>
<style scoped>
.vin-panel-title {
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 2px;
}
.vin-panel-content {
  font-size: 10px;
  font-weight: 100;
  white-space: nowrap;
  padding-top: 3px;
}
.vin-panel-content span {
  cursor: pointer;
}
.vin-panel {
  margin-bottom: 11px;
  margin-top: -12px;
}
.exclamation {
  padding: 0 3px;
}
.vin-panel-content .exclamation.fas.fa-times {
  padding: 0 3px;
  font-size: 13px;
  vertical-align: middle;
}
.panel_content_header_help i {
  background: #013e2c;
  border: 1px solid #013e2c;
  border-radius: 50%;
  padding: 0 2px 0 2px;
  transform: rotate(180deg);
  color: white;
  font-size: 8px;
  font-weight: bolder;
}
.panel_content_header_help i:before {
  content: '!' !important;
}
</style>
