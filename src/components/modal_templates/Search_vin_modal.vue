<template
  ><!--Search in notFull VIN. Click modification - "model, modification, engine, available in chapters"-->
  <div>
    <Modal
      width="600px"
      :open="modelValue"
      :headModal="$t('modification')"
      :confirmClick="handleConfirm"
      :cancelClick="handleCancel"
      submitButtonName="OK"
    >
      <div class="vin-modal-wrapper">
        <div class="vin-modal-alternative-heading" v-if="vinInfo.alternative">
          {{ $t('modificationNotAvailable') }}
        </div>
        <div class="vin-modal-row" v-if="vinInfo.vin">
          <div class="vin-modal-label">VIN {{ $t('number') }}:</div>
          <div class="vin-modal-value">{{ vinInfo.vin }}</div>
        </div>
        <div class="vin-modal-row" v-if="vinInfo.productModel_name">
          <div class="vin-modal-label">{{ $t('model') }}:</div>
          <div class="vin-modal-value">{{ vinInfo.productModel_name }}</div>
        </div>
        <div class="vin-modal-row" v-if="vinInfo.productModification_name">
          <div class="vin-modal-label">{{ $t('modification') }}:</div>
          <div class="vin-modal-value">
            {{ formatName(vinInfo.productModification_name) }}
          </div>
        </div>
        <div class="vin-modal-row" v-if="vinInfo.engine_type_code">
          <div class="vin-modal-label">{{ $t('engine') }}:</div>
          <div class="vin-modal-value">{{ vinInfo.engine_type_code }}</div>
        </div>
        <div class="vin-modal-row" v-if="vinInfo.prod_year">
          <div class="vin-modal-label">{{ $t('dateManufacture') }}:</div>
          <div class="vin-modal-value">{{ formatDate(vinInfo.prod_year) }}</div>
        </div>
        <div class="vin-modal-row" v-if="vinInfo.color">
          <div class="vin-modal-label">{{ $t('color') }}:</div>
          <div class="vin-modal-value">{{ vinInfo.color }}</div>
        </div>
        <div class="vin-modal-additional-block" v-if="vinInfo.option">
          <div class="vin-modal-label">{{ $t('optionsAdditional') }}:</div>
          <div
            class="additional_things_wrapper vin-modal-value vin-modal-options"
          >
            <div :key="key" v-for="(option, key) in vinInfo.option">
              <template v-if="option.optionIncadea_type !== 1">
                <div>{{ option.optionIncadea_description }}</div>
              </template>
            </div>
          </div>
        </div>
        <div class="vin-modal-additional-block">
          <label class="vin-modal-label">{{ $t('availableIn') }}:</label>
          <div class="additional_things_wrapper vin-modal-value">
            <div
              class="modification-section-available"
              v-if="vinInfo.showInParts"
            >
              - {{ $t('parts').toUpperCase() }}
            </div>
            <div
              class="modification-section-available"
              v-if="vinInfo.showInLaborTime"
            >
              - {{ $t('standtime').toUpperCase() }}
            </div>
            <div
              class="modification-section-available"
              v-if="vinInfo.showInFlowchart"
            >
              - {{ $t('flowcharts').toUpperCase() }}
            </div>
            <div
              class="modification-section-available"
              v-if="vinInfo.showInEmaps"
            >
              - {{ $t('emaps').toUpperCase() }}
            </div>
            <div
              class="modification-section-available"
              v-if="vinInfo.showInDiagnostic"
            >
              - {{ $t('diagnostic').toUpperCase() }}
            </div>
            <div
              class="modification-section-available"
              v-if="
                !vinInfo.showInParts &&
                  !vinInfo.showInLaborTime &&
                  !vinInfo.showInFlowchart &&
                  !vinInfo.showInEmaps &&
                  !vinInfo.showInDiagnostic
              "
            >
              {{ $t('availableNo') }}
            </div>
          </div>
        </div>
        <div class="vin-modal-alternative-block" v-if="vinInfo.alternative">
          <div class="vin-modal-alternative-heading" v-if="vinInfo.alternative">
            {{ $t('alternative') }}:
          </div>
          <div
            class="vin-modal-row"
            v-if="vinInfo.alternative.productModification_name"
          >
            <div class="vin-modal-label">{{ $t('modification') }}:</div>
            <div class="vin-modal-value">
              {{ formatName(vinInfo.alternative.productModification_name) }}
            </div>
          </div>
          <div class="vin-modal-row" v-if="vinInfo.alternative.comment">
            <div class="vin-modal-label">{{ $t('equipmentCar') }}:</div>
            <div class="vin-modal-value">{{ vinInfo.alternative.comment }}</div>
          </div>
          <div class="alternative-disclaimer">
            <p><span style="color:red">*</span> {{ $t('noExactInfo') }}</p>
            <p><span style="color:red">**</span> {{ $t('alternativeMost') }}</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Request } from '@/services/axios.service'
import Modal from '@/components/diagnostic/Modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  props: {
    modelValue: Boolean,
    vinInfo: Object,
    redirectAfterConfim: String
  },
  data() {
    return {
      id: this.modelValue ? true : false
    }
  },
  mounted() {},
  computed: {},
  methods: {
    formatDate: function(val) {
      let res = val.substring(0, 10)
      res = res.split('-')
      res = res[2] + '.' + res[1] + '.' + res[0]
      return res
    },
    handleConfirm: function() {
      this.$emit('update:modelValue', false)
      this.id = 0
      if (this.redirectAfterConfim == 'reload') {
        window.location.reload()
      } else {
        if (this.redirectAfterConfim) {
          this.$router.push(this.redirectAfterConfim)
          this.$store.commit('section/SET_PAGE_LEVEL', 2)
        }
      }
    },
    handleCancel: function() {
      this.$emit('update:modelValue', false)
      this.id = 0
      if (this.redirectAfterConfim == 'reload') {
        window.location.reload()
      } else {
        if (this.redirectAfterConfim) {
          this.$router.push(this.redirectAfterConfim)
          this.$store.commit('section/SET_PAGE_LEVEL', 2)
        }
      }
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    }
  },
  components: {
    Modal
  },
  watch: {
    modelValue(newVal, oldVal) {
      //   this.getData(newVal);
    }
  }
}
</script>
<style scoped>
.vin-modal-wrapper {
  width: 600px;
  padding: 25px;
  font-size: 13px;
}
.vin-modal-value {
  font-weight: 100;
}
.vin-modal-row {
  display: flex;
  height: 30px;
}

.vin-modal-label {
  /*width: 160px;*/
  width: 30%; /*module window: XTT316300K1012226*/
  text-transform: none;
}
.vin-modal-additional-block {
  display: flex;
  align-content: space-around;
  align-items: center;
  padding-bottom: 10px;
  width: 100%; /*module window: XTT316300K1012226*/
}
.vin-modal-options {
  text-transform: uppercase;
  width: 70%; /*module window: XTT316300K1012226*/
}
.vin-modal-alternative-heading {
  font-size: 14px;
  text-align: center;
  padding: 0px 0 15px 0;
  font-weight: 600;
}
.alternative-disclaimer {
  font-style: italic;
  font-weight: 100;
  font-size: 13px;
}
</style>
