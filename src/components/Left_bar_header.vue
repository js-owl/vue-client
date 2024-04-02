<template>
  <div class="icon_left_bar_wrapper">
    <div class="illustration_header_left_bar_part">
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('supportDesk')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="showSupportModal"
          class="illustration_header_icon icon_letter uaz__light-icon uaz__icons-illustrations"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('print')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="print"
          :class="[
            'illustration_header_icon icon_print uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !isFlowchartPage }
          ]"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('goToCart')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="showIllustration"
          class="illustration_header_icon icon_cart uaz__light-icon uaz__icons-illustrations uaz__on"
        ></div>
      </el-tooltip>
      <div id="download-pdf"></div>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('flowcharts')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="showFlowchart(isIllustrationPage)"
          :class="[
            'illustration_header_icon icon_card uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !isIllustrationPage }
          ]"
        ></div>
      </el-tooltip>
    </div>
  </div>
  <ModalContent v-model="showModal" />
  <FlowchartGroupDetail
    :open="modalOpen"
    :cancelClick="handleCancel"
    :productModelId="productModelId"
    :productModificationId="productModificationId"
    :year="year"
    :partGroupId="partGroupId"
  />
</template>
<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Support.vue'
import FlowchartGroupDetail from '@/components/flowchart/FlowchartGroupDetail.vue'
export default {
  props: {},
  data() {
    return {
      showModal: false,
      isIllustrationPage: false,
      isFlowchartPage: false,
      modalOpen: false,
      partGroupId: 0,
      productModificationId: 0,
      productModelId: 10,
      year: 2020
    }
  },
  computed: {},
  mounted: function() {
    this.isIllustrationPage = this.$route.params.flowchartId ? true : false
    this.isFlowchartPage = this.$route.params.illustrationId ? true : false
  },
  methods: {
    showIllustration: function(e) {
      e.target.classList.toggle('uaz__on')
    },
    print: function(e) {
      if (this.isFlowchartPage) {
        Request.get(
          'flowchart/html/' + this.$route.params.flowchartId + '?lang=ru',
          {}
        ).then(response => {
          var myWindow = window.open('', '', 'height=400,width=600')
          let str =
            '<script type="text/javascript">window.onload = function(){window.print();window.close();}<\/script>'
          myWindow.document.write(str)
          myWindow.document.write(response.data)
          myWindow.document.close()
        })
      }
    },
    showFlowchart: function(isIllustrationPage) {
      if (isIllustrationPage) {
        this.productModelId = this.$route.query.productModelId
        this.productModificationId = this.$route.query.productModification_id
        this.partGroupId = this.$route.params.illustrationId
        this.modalOpen = true
      }
    },
    showSupportModal: function() {
      this.showModal = true
    },
    handleCancel() {
      this.modalOpen = false
    }
  },
  components: {
    ModalContent,
    FlowchartGroupDetail
  },
  watch: {
    isIllustrationPage(newValue, oldValue) {
      if (newValue) {
        this.isIllustrationPage = newValue
      }
    },
    isFlowchartPage(newValue, oldValue) {
      if (newValue) {
        this.isFlowchartPage = newValue
      }
    },
    $route(to, from) {
      this.isIllustrationPage = this.$route.params.illustrationId ? true : false
      this.isFlowchartPage = this.$route.params.flowchartId ? true : false
    }
  }
}
</script>
<style>
.icon_left_bar_wrapper {
  display: flex;
  justify-content: flex-end;
  width: auto;
}
.illustration_header_left_bar_part {
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: auto;
  height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: flex-end;
}
.uaz__light-icon {
  cursor: pointer;
  display: block;
  width: 25px;
  height: 25px;
  padding: 1px;
  background-color: #013e2c;
  border-radius: 3px;
  right: -28px;
  top: 0px;
  margin: 1px 2px;
}
.illustration_header_zoom_icon.uaz__icons-preview.uaz__light-icon.uaz__icons-preview.item {
  background-color: #fff;
}
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-illustrations {
  right: 1px;
}
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-off,
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-on {
  right: 4px;
}
.illustration_header .uaz__light-icon {
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 18px;
  padding: 1px;
  /*background-color: #fff;*/
  border-radius: 0px;
  right: -10px;
  top: 0px;
}
.uaz_button_background_white .uaz__light-icon {
  right: 0px;
  top: -1px;
}

.icon_letter,
.uaz__on.icon_letter {
  background: url('../assets/icons.png') -133px -30px;
}
.icon_print,
.uaz__on.icon_print {
  background: url('../assets/icons.png') -31px -4px;
}
.icon_cart,
.uaz__on.icon_cart {
  background: url('../assets/icons.png') -38px -56px;
}
.icon_card,
.uaz__on.icon_card {
  background: url('../assets/icons.png') -167px -4px;
}
.uaz__icons-pdf {
  background: url('../assets/icons.png') -147px -84px;
}

.uaz__on.icon_letter {
  background-position: -106px -162px;
}
.uaz__on.icon_print {
  background-position: -4px -136px;
}
.uaz__on.icon_cart {
  background-position: -201px -30px;
}
.uaz__on.icon_card {
  background-position: -140px -136px;
}

.illustration_header_row {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #013e2c;
}
.el-popper__arrow:after {
  top: -5px;
  left: 50%;
  margin-left: -6px;
  border-bottom: 6px solid #cfdbd9;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  height: 0;
  position: absolute;
  width: 0;
}
.illustration_header_icon:focus-visible {
  outline: none;
}
</style>
