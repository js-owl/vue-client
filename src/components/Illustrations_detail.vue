<template>
  <div class="illustration_wrapper">
    <div class="illustration_header g3">
      <div class="illustration_header_row">
        <div class="green_space"></div>

        <div class="uaz_button_background_white">
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('increase')"
            placement="right"
            popper-class="uaz__tooltip uaz__tooltip-right"
          >
            <div
              id="uaz__increase-img"
              @click="zoomIn"
              class="uaz__light-icon uaz__icons-increase ng-isolate-scope"
            >
              <img src="../assets/increase-img.svg" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('decrease')"
            placement="right"
            popper-class="uaz__tooltip uaz__tooltip-right"
          >
            <div
              id="uaz__decrease-img"
              @click="zoomOut"
              class="uaz__light-icon uaz__icons-decrease"
            >
              <img src="../assets/decrease-img.svg" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('fullscreen')"
            placement="right"
            popper-class="uaz__tooltip uaz__tooltip-right"
          >
            <div
              class="uaz__light-icon uaz__icons-fullscreen"
              @click="fullScreen"
              id="uaz__full-screen"
            >
              <img src="../assets/full-screen.svg" />
            </div>
          </el-tooltip>
        </div>
        <div class="illustration_header_riht_part" @click="showVinModal">
          {{ $t('modification') }}:
          {{ formatName(modification.productModification_name) }}
        </div>
        <!-- LUX PREMIUM AT EG -->
      </div>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('illustrationsOfGroup')"
        placement="bottom"
        popper-class="uaz__tooltip uaz__tooltip-bottom"
      >
        <div
          @click="CarouselButton"
          class="illustration_header_zoom_icon uaz__light-icon uaz__icons-illustrations"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="getTooltip"
        placement="bottom"
        popper-class="uaz__tooltip uaz__tooltip-bottom"
      >
        <div
          @click="changeSize"
          class="illustration_header_zoom_icon uaz__light-icon uaz__icons-resize-off"
        ></div>
      </el-tooltip>
    </div>
    <div class="illustration_panel_zoomed" style="width:100%;height: 100%;">
      <div id="mainViewContainer" style="width:100%;height: 100%;">
        <embed
          id="mainView"
          style="width:100%;height: 100%;"
          type="image/svg+xml"
          :src="
            `/storage/img/svg/illustration_${$route.params.illustrationId}.svg`
          "
          class="thumbViewClass"
        />
      </div>
      <div @click="fullScreen" v-if="isFullScreen">
        <el-tooltip
          class="item"
          effect="light"
          :content="$t('close').toUpperCase()"
          placement="bottom"
          popper-class="uaz__tooltip uaz__tooltip-bottom"
        >
          <div class="uaz__fullscreen-close">x</div>
        </el-tooltip>
      </div>
      <div id="thumbViewContainer">
        <svg id="scopeContainer" class="thumbViewClass">
          <g>
            <rect
              id="scope"
              fill="red"
              fill-opacity="0.1"
              stroke="red"
              stroke-width="2px"
              x="0"
              y="0"
              width="0"
              height="0"
            />
            <line
              id="line1"
              stroke="red"
              stroke-width="2px"
              x1="0"
              y1="0"
              x2="0"
              y2="0"
            />
            <line
              id="line2"
              stroke="red"
              stroke-width="2px"
              x1="0"
              y1="0"
              x2="0"
              y2="0"
            />
          </g>
        </svg>
        <!--   <embed id="thumbView" type="image/svg+xml" :src="`/storage/img/svg/illustration_${$route.params.illustrationId}.svg`" class="thumbViewClass"/> 
   <embed id="thumbView" type="image/svg+xml" :src="`/svg.svg`" class="thumbViewClass"/> -->
      </div>
    </div>
  </div>
  <ModalContent v-if="showModal" v-model="showModal" :vin-info="vinInfo" />
</template>

<script>
//import svgPanZoom, { zoomOut } from 'svg-pan-zoom'
import { Request } from '@/services/axios.service'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { modificationNameFormatter } from '@/components/utils/helpers'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
export default {
  props: ['selectedPart'],
  data() {
    return {
      widthButtonState: 'normal',
      isFullScreen: false,
      svgDocument: {},
      partData: {},
      showModal: false,
      modification: {},
      modificationID: 0,
      vinInfo: {},
      getTooltip: this.$t('resizeoff')
    }
  },
  computed: {
    ...mapGetters({
      carouselStatus: 'settings/getCarouselStatus'
    }),
    ...mapMutations({
      carouselStatusMutation: 'settings/SET_CAROUSEL_STATUS'
    }),
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
  mounted: function() {
    this.modificationID = this.$route.query.productModification_id
    this.getModidification()
    let embed = document.getElementById('mainView')
    if (embed) {
      embed.addEventListener('load', this.lastEventListener)
    }
    this.getData()
  },
  components: {
    ModalContent
  },
  methods: {
    getData: function() {
      if (this.$route.params.illustrationId) {
        Request.get('/partgroup/get/' + this.$route.params.illustrationId, {})
          .then(response => {
            this.partData = response.data.data
          })
          .catch(function(error) {})
      }
    },
    showIllustration: function(e) {
      e.target.classList.toggle('uaz__on')
    },
    getModidification: function(id) {
      return Request.get('/productmodification/get/' + this.modificationID, {})
        .then(response => {
          this.modification = response.data
        })
        .catch(function(error) {})
    },
    GetCarouselStatus: function() {
      this.$store.commit('settings/SET_CAROUSEL_STATUS', !this.carouselStatus)
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
        this.vinInfo = this.modification
      }
      this.showModal = true
    },
    CarouselButton: function(e) {
      if (this.selectedPart) {
        this.clearPart(this.selectedPart)
      }
      this.showIllustration(e)
      this.GetCarouselStatus()
      if (!this.carouselStatus) {
        this.$router.push(
          '/parts/illustration/detail' +
            '/' +
            this.$route.params.illustrationId +
            '/?productModification_id=' +
            this.$route.query.productModification_id +
            '&productModelId=' +
            this.$route.query.productModelId,
          {}
        )
        window.location.reload()
      }
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    },
    lastEventListener: function() {
      // Expose to window namespase for testing purposes
      /*  window.panZoomInstance = svgPanZoom('#mainView', {
          zoomEnabled: true,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          minZoom: 0.1
        });*/
      // Zoom out
      //  panZoomInstance.zoom(0.2);
      // panZoomInstance.reset();
      thumbnailViewer({ mainViewId: 'mainView', thumbViewId: 'mainView' })
      this.svgDocument = document.getElementById('mainView').getSVGDocument()
    },

    changeSize: function(e) {
      let leftBlock = document.getElementsByClassName(
        'uaz_parts_content_left_part'
      )[0]
      e.target.classList.toggle('uaz__icons-resize-off')
      e.target.classList.toggle('uaz__icons-resize-on')
      switch (this.widthButtonState) {
        case 'normal':
          this.widthButtonState = 'expanded'
          this.getTooltip = this.$t('resizeon')
          leftBlock.style.width = '68%'
          window.main.resize()
          window.main.reset()
          break
        case 'expanded':
          this.widthButtonState = 'normal'
          this.getTooltip = this.$t('resizeoff')
          leftBlock.style.width = '50%'
          window.main.resize()
          window.main.reset()
          break
      }
    },
    zoomIn: function() {
      window.main.zoomIn()
    },
    zoomOut: function() {
      window.main.zoomOut()
    },
    fullScreen: function() {
      let svgContent = document.getElementsByClassName(
        'illustration_panel_zoomed'
      )[0]
      let thumb = document.getElementById('thumbViewContainer')
      let container = document.getElementsByClassName(
        'uaz_parts_content_left_part'
      )[0]
      thumb.style.display = thumb.style.display == 'none' ? 'initial' : 'none'
      container.style.width = container.style.width == '100%' ? '50%' : '100%'
      svgContent.classList.toggle('fullscreen')
      this.isFullScreen = !this.isFullScreen
      window.main.resize()
      window.main.reset()
    },
    clearPart: function(partId) {
      var elements = this.svgDocument.getElementById(partId)
        ? this.svgDocument.getElementById(partId).childNodes
        : []
      for (var i = 0; i < elements.length; i++) {
        if ('text' !== elements[i].parentNode.nodeName) {
          elements[i].style.stroke = ''
          elements[i].style.strokeWidth = ''
        }
      }
      const active = document.querySelectorAll('.illustration_inline_active')
      active[0]?.classList.remove('illustration_inline_active')
    }
  }
}
</script>
<style scoped>
#svg-id {
  width: 100%;
  height: 100%;
}
.no_image_block {
  text-align: center;
  vertical-align: middle;
  height: 100%;
  width: 100%;
}
.illustration_header {
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 97%;
  height: 18px;
  line-height: 20px;
  display: flex;
  justify-content: flex-end;
}
.illustration_header.g3 {
  width: 100%;
}
.illustration_header_left_part {
  margin-left: 5px;
}
.illustration_header_riht_part {
  margin-left: auto;
  padding-right: 10px;
}
.illustration_header_zoom_icon {
  margin: 0 10px;
}
.uaz__illustration-number {
  position: absolute;
  right: 2px;
  bottom: 2px;
}
.illustration_element,
.illustration_header_zoom_icon {
  cursor: pointer;
}
.illustration_header_riht_part,
.uaz_parts_content_table_heading_cell {
  cursor: default;
}
.illustration_panel_body {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.illustration_element {
  position: relative;
  height: 150px;
  flex: 1 0 218px;
  max-width: 218px;
  margin: 5px 5px;
  border: 1px solid #013e2c;
  box-sizing: border-box;
}
@media (max-width: 1400px) {
  .illustration_element {
    flex: 1 0 200px;
  }
}
.uaz__group-img {
  padding: 5px;
  left: 0;
  max-width: 80%;
  max-height: calc(100% - 15px);
  display: block;
  margin: 0 auto;
}
.uaz__icons-preview {
  background: url('../assets/icons.png') -5px -5px;
}
.uaz__light-icon {
  cursor: pointer;
  width: 17px;
  height: 17px;
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
.illustration_header_zoom_icon.uaz__icons-preview.uaz__light-icon.uaz__icons-preview.item {
  background-color: #fff;
}
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-illustrations,
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-off,
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-on {
  right: -1px;
  margin: 0;
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

.illustration_active {
  border: 2px solid #013e2c;
}
.illustration_wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.uaz__icons-decrease img,
.uaz__icons-fullscreen img,
.uaz__icons-increase img {
  width: 100%;
  height: 100%;
}
.uaz__bg-btn {
  height: 17px;
  background-color: #fff;
  display: inline-block;
  padding: 0 1px;
  width: auto;
}
.uaz_button_background_white {
  display: flex;
  background: white;
  flex-direction: row;
}
.green_space {
  display: flex;
  background: #013e2c;
  width: 5px;
}
.uaz__icons-illustrations,
.uaz__on.uaz__icons-illustrations {
  background: url('../assets/icons.png') -202px -162px;
}
.uaz__icons-resize-off,
.uaz__icons-resize-on {
  background: url('../assets/icons.png') -86px -84px;
}
.uaz__icons-resize-off {
  background-position: -5px -189px;
}
.uaz__on.uaz__icons-illustrations {
  background-position: -59px -84px;
}
.illustration_header_row {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #013e2c;
}
.uaz_parts_content_left_part {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.illustration_panel_zoomed.fullscreen {
  position: fixed;
  z-index: 1000;
  min-width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: block;
  background: white;
}
.uaz__fullscreen-close {
  color: #013e2c;
  position: absolute;
  right: 30px;
  top: 0;
  cursor: pointer;
  font-size: 50px;
}
.illustration_panel_zoomed {
  position: relative;
  min-height: calc(
    100% - 177px
  ); /* illustration (carousel): left border of block go down */
}
/*
 .thumbViewClass {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 300px;
    height: 200px;
    margin: 3px;
    padding: 3px;
    overflow: hidden;
}
*/
#mainViewContainer {
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
}
#thumbView {
  z-index: 110;
  background: white;
}
#scopeContainer {
  /* z-index: 120;
  border: 1px solid black;**/
}
.illustration_breadcrumbs {
  text-transform: uppercase;
  color: #013e2c;
  display: inline-block;
  border-top: 1px solid #b8bdc0;
  border-right: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  padding: 3px 10px;
}
</style>
