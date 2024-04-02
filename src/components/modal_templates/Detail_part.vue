<template>
  <div>
    <Modal
      :open="id"
      :headModal="$t('partInfo').toUpperCase()"
      :confirmClick="handleConfirm"
      :cancelClick="handleCancel"
      :submitButtonName="$t('addToCart').toUpperCase()"
    >
      <div class="detail_part_modal_wrapper">
        <div class="detail_part_modal__image">
          <el-image
            v-if="data.part_code"
            :src="'/storage/img/part/IMAGE/' + data.part_code + '.jpg'"
            :preview-src-list="[
              '/storage/img/part/IMAGE/' + data.part_code + '.jpg'
            ]"
            :initial-index="0"
            lazy
            hide-on-click-modal
          >
            <template #error>
              <div class="image-slot">
                <img src="../../assets/not-found.png" />
              </div>
            </template>
          </el-image>
        </div>
        <div class="detail_part_modal__description">
          {{ data.part_code }}
          -
          {{ this.$i18n.locale == 'ru' ? data.part_name : data.part_name_en }}
          <br /><br />
          {{ $t('note') }}:
          {{
            data.part_description_en
              ? this.$i18n.locale == 'ru'
                ? data.part_description
                : data.part_description_en
              : data.part_description
          }}
        </div>
        <div class="detail_part_modal__table">
          {{ $t('sizeAndWeight') }}<br /><br />
          <div class="detail_part_modal__table__line">
            <span class="modal__table_left_part"> {{ $t('length') }}: </span>
            <span class="modal__table_right_part">{{ data.part_length }}</span>
          </div>
          <div class="detail_part_modal__table__line">
            <span class="modal__table_left_part"> {{ $t('width') }}: </span>
            <span class="modal__table_right_part">{{ data.part_width }}</span>
          </div>
          <div class="detail_part_modal__table__line">
            <span class="modal__table_left_part"> {{ $t('height') }}: </span>
            <span class="modal__table_right_part">{{ data.part_height }}</span>
          </div>
          <div class="detail_part_modal__table__line">
            <span class="modal__table_left_part">{{ $t('weight') }}:</span>
            <span class="modal__table_right_part">
              {{ data.part_netweight }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="uaz__panel-default"
        v-if="data.replacement && data.replacement.length"
      >
        <div class="uaz__panel-default__title">
          {{ $t('chainReplacements') }}
        </div>
        <div class="uaz__panel-header-light">
          <div class="uaz__panel-default__small">
            {{ $t('oldItem').toUpperCase() }}
          </div>
          <div class="uaz__panel-default__small">
            {{ $t('newItem').toUpperCase() }}
          </div>
          <div class="uaz__panel-default__small">
            {{ $t('dateReplacement').toUpperCase() }}
          </div>
          <div class="uaz__panel-default__big">
            {{ $t('name').toUpperCase() }}
          </div>
        </div>
        <div
          :key="key"
          v-for="(row, key) in data.replacement"
          class="uaz__panel-content"
        >
          <div class="uaz__panel-content__row">
            <div class="uaz__panel-default__small">{{ row.old_id }}</div>
            <div class="uaz__panel-default__small">{{ row.new_id }}</div>
            <div class="uaz__panel-default__small">
              {{ formatDate(row.date_close) }}
            </div>
            <div class="uaz__panel-default__big">{{ row.new_part_name }}</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Request } from '@/services/axios.service'
import Modal from '@/components/diagnostic/Modal.vue'
export default {
  props: {
    idForPopUp: Number,
    modelValue: Number
  },
  data() {
    return {
      id: this.modelValue ? true : false,
      data: {},
      alertOpen: true
    }
  },
  mounted() {
    this.getData(this.modelValue)
  },
  computed: {},
  methods: {
    getData: function(id) {
      Request.get('/part/get/' + id, {})
        .then(response => {
          this.data = response.data.data
        })
        .catch(function(error) {})
    },
    formatDate: function(val) {
      let res = val.substring(0, 10)
      res = res.split('-')
      res = res[2] + '.' + res[1] + '.' + res[0]
      return res
    },
    getPartGroup: function() {
      Request.get('/partgroup/index/' + id, {})
        .then(response => {
          this.data = response.data.data
        })
        .catch(function(error) {})
    },
    handleConfirm: function() {
      this.alertOpen = false
      this.$emit('update:modelValue', 0)
      this.id = 0
    },
    handleCancel: function() {
      this.alertOpen = false
      this.$emit('update:modelValue', 0)
      this.id = 0
    }
  },
  components: {
    Modal
  },
  watch: {
    modelValue(newVal, oldVal) {
      this.getData(newVal)
    }
  }
}
</script>
<style scoped>
.detail_part_modal__image {
  width: 190px;
  margin-right: auto;
}
.detail_part_modal__image img {
  width: 100%;
  height: auto;
  min-height: 85px;
  border: 1px solid #cfdbd9;
  border-radius: 3px;
}
.detail_part_modal_wrapper {
  display: flex;

  justify-content: space-between;
}
.detail_part_modal__description {
  flex: 1;
  margin-top: 15px;
}

.detail_part_modal__table {
  width: 150px;
  margin: 16px 40px 5px 23px;
}
span.modal__table_right_part {
  margin-top: 5px;
}

.detail_part_modal__table__line {
  border-bottom: 1px black dotted;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  font-size: 10px;
  font-weight: 600;
}
.modal__table_left_part {
  bottom: -5px;
  position: relative;
  z-index: 2;
  background-color: #fff;
  margin: 3px 0px;
}
.modal__table_right_part {
  bottom: -5px;
  position: relative;

  z-index: 2;
  background-color: #fff;
  margin: 3px 0px;
}
.uaz__panel-default {
  width: 660px;
  margin: 10px;
}
.uaz__panel-header-light {
  background-color: #cfdbd9;
  color: #000;
  display: flex;
  height: 17px;
  line-height: 17px;
  font-size: 10px;
}
.uaz__panel-header-light div {
  padding: 0 5px;
}
.uaz__panel-default__small {
  width: 20%;
}
.uaz__panel-default__big {
  width: 40%;
}
.uaz__panel-content__row {
  display: flex;
  height: 23px;
  line-height: 23px;
}
.uaz__panel-content__row div {
  padding: 0 5px;
}
.uaz__panel-default__title {
  margin-bottom: 3px;
}
</style>
