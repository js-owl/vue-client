<template>
  <div
    class="uaz__panel-default uaz__groups-illustrations uaz__print-illustrations"
    style="height: calc(100% - 73px)"
  >
    <div class="uaz__panel-header-dark">
      <el-row>
        <el-col :span="12">
          <span class="uaz__uppercase">{{ $t('emapsImg') }}</span>
        </el-col>
        <el-col :span="12">
          <div
            style="text-transform: none"
            @click="showVinModal"
            class="text-right uaz__pointer"
          >
            {{ $t('modification') }}:
            {{ productModificationName }}
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      id="uaz__illustrations-img-scroll"
      class="uaz__panel-content uaz__groups"
    >
      <img
        v-if="electricGroup"
        class="uaz__group-img"
        style="max-height: 100%;width: -webkit-fill-available; margin: auto; display: block;"
        :src="`/storage/${electricGroup.electricGroup_image}`"
      />
      <div v-if="!electricGroup" class="uaz__text-center">
        {{ $t('selectGroup').toUpperCase() }}
      </div>
    </div>
  </div>
  <ModalContent v-if="showModal" v-model="showModal" :vin-info="vinInfo" />
</template>

<script>
import { mapState } from 'vuex'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  data() {
    return {
      showModal: false,
      vinInfo: {}
    }
  },
  props: ['electricGroup'],
  watch: {
    electricGroup: function(newValue, oldValue) {}
  },
  methods: {
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
    }
  },
  computed: {
    ...mapState('vinThrough', ['THROUGH_VIN']),
    ...mapState({
      productModification: state => {
        return state.modification
      }
    }),
    productModificationName: function() {
      return modificationNameFormatter(
        this.productModification.productModification_name
      )
    }
  },
  components: {
    ModalContent
  }
}
</script>
<style scoped>
.uaz__groups-illustrations {
  min-height: 140px;
  padding-top: 5px;
  height: 100% !important;
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
}
.uaz__panel-header-dark {
  position: relative;
  background-color: #013e2c;
  text-transform: uppercase;
  line-height: 17px;
  display: -ms-flexbox;
  display: flex;
  min-height: 17px;
  color: #fff;
}
.uaz__panel-content,
.uaz__panel-header {
  height: calc(100% - 21px);
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  /* Emaps : Illustrations - left block - bottom line bother */
  border-right: 0px solid #b8bdc0;
  border-bottom: 0px solid #b8bdc0;
  border-left: 0px solid #b8bdc0;
  text-transform: uppercase;
}
.text-right {
  text-align: right;
}
.el-row {
  width: 100%;
  padding: 0 5px !important;
  margin: 0 !important;
}
.uaz__text-center {
  text-align: center;
  margin-top: 10px;
}
</style>
