<template>
  <div>
    <Modal
      width="600px"
      :open="modelValue"
      :headModal="$t('searchResult').toUpperCase()"
      :confirmClick="handleConfirm"
      :cancelClick="handleCancel"
      submitButtonName="OK"
    >
      <div class="vin-modal-wrapper">
        <div style="text-align: center">{{ text }}</div>
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
    text: String
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
    },
    handleCancel: function() {
      this.$emit('update:modelValue', false)
      this.id = 0
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
  width: 160px;
}
.vin-modal-additional-block {
  display: flex;
  align-content: space-around;
  align-items: center;
  padding-bottom: 10px;
}
.vin-modal-options {
  text-transform: uppercase;
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
