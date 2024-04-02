<template>
  <div class="illustration_wrapper">
    <div class="illustration_header g3">
      <div class="illustration_header_row">
        <div class="illustration_header_left_part">
          {{
            illustrationName_en
              ? this.$i18n.locale == 'ru'
                ? illustrationName
                : illustrationName_en
              : illustrationName
          }}
        </div>

        <div class="uaz_button_background_white">
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('increase')"
            placement="top"
            popper-class="uaz__tooltip uaz__tooltip-top"
          >
            <div
              id="uaz__increase-img"
              @click="zoomIn"
              class="uaz__light-icon uaz__icons-increase ng-isolate-scope"
            >
              <img src="../../assets/increase-img.svg" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('decrease')"
            placement="top"
            popper-class="uaz__tooltip uaz__tooltip-top"
          >
            <div
              id="uaz__decrease-img"
              @click="zoomOut"
              class="uaz__light-icon uaz__icons-decrease"
            >
              <img src="../../assets/decrease-img.svg" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('fullscreen')"
            placement="top"
            popper-class="uaz__tooltip uaz__tooltip-top-right"
          >
            <div
              class="uaz__light-icon uaz__icons-fullscreen"
              @click="toggle"
              id="uaz__full-screen"
            >
              <img src="../../assets/full-screen.svg" />
            </div>
          </el-tooltip>
        </div>
        <div class="green_space"></div>
      </div>
    </div>

    <fullscreen :fullscreen="fullscreen" style="background-color: white">
      <div
        style="
          width: 100%;
          height: 1490px;
          overflow: hidden;
          position: relative;
        "
        @wheel="zoom"
        @mousedown="dragstart"
        @mousemove="drag"
        @mouseup="dragend"
        @mouseleave="dragend"
        @touchstart="dragstart"
        @touchmove="drag"
        @touchend="dragend"
        @touchcancel="dragend"
        @touchleave="dragend"
        ref="wrapper"
      >
        <div
          class="simple-svg-map__content"
          style="position: absolute"
          :style="{
            top: `${position.y}px`,
            left: `${position.x}px`,
            transform: `scale(${position.scale})`
          }"
        >
          <EmapsIllustration
            :illustrationId="illustrationId"
            :handleClick="handleClick"
          />
        </div>
      </div>
    </fullscreen>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import EmapsIllustration from '@/components/emap/EmapsIllustration.vue'
import { mapState } from 'vuex'

import axios from 'axios'
const config = {
  headers: { 'Access-Control-Allow-Origin': '*' }
}

export default {
  props: ['illustrationId', 'handleClick'],
  data() {
    return {
      position: {
        x: 0,
        y: 0,
        scale: 1
      },
      dragAndDrop: {
        dragStarted: false,
        dragStartX: 0,
        dragStartY: 0,
        diffX: 0,
        diffY: 0,
        mouseCursor: 'default'
      },
      preventMouseEvents: false,
      zoomDirect: 'decrease',
      fullscreen: false
    }
  },
  computed: {
    ...mapState({
      illustrationName: state => state.emaps.illustrationName
    })
  },
  mounted: function() {},
  components: {
    EmapsIllustration
  },
  methods: {
    setIllustrationName(name) {
      this.illustrationName = name
    },
    toggle() {
      this.fullscreen = !this.fullscreen
    },
    mouseover(region) {},
    mouseleave(region) {},
    getMapClientRect() {
      return this.refImage.getBoundingClientRect()
    },
    dragstart(event) {
      this.dragAndDrop.dragStartX = event.pageX || event.touches[0].pageX
      this.dragAndDrop.dragStartY = event.pageY || event.touches[0].pageY
      this.dragAndDrop.dragStarted = true
      this.$emit('dragstart', event)
    },
    drag(event) {
      if (this.dragAndDrop.dragStarted) {
        this.dragAndDrop.diffX =
          (event.pageX || event.touches[0].pageX) - this.dragAndDrop.dragStartX
        this.dragAndDrop.diffY =
          (event.pageY || event.touches[0].pageY) - this.dragAndDrop.dragStartY
        if (
          this.dragAndDrop.diffX > this.mouseChangeDiff ||
          this.dragAndDrop.diffX < -this.mouseChangeDiff ||
          this.dragAndDrop.diffY > this.mouseChangeDiff ||
          this.dragAndDrop.diffX < -this.mouseChangeDiff
        ) {
          this.preventMouseEvents = true
          this.dragAndDrop.mouseCursor = this.dragCursor
        }
        this.position.x += this.dragAndDrop.diffX
        this.position.y += this.dragAndDrop.diffY
        this.dragAndDrop.dragStartX = event.pageX || event.touches[0].pageX
        this.dragAndDrop.dragStartY = event.pageY || event.touches[0].pageY
        this.$emit('drag', event)
      }
    },
    dragend(event) {
      this.dragAndDrop.dragStarted = false
      this.dragAndDrop.mouseCursor = 'default'
      setTimeout(() => {
        this.preventMouseEvents = false
      }, 150)
      this.$emit('dragend', event)
    },
    zoomIn() {
      this.zoomDirect = 'increase'
      this.zoom()
    },
    zoomOut() {
      this.zoomDirect = 'decrease'
      this.zoom()
    },
    zoom(event) {
      let zoomOut = true
      if (event) {
        zoomOut = event.deltaY > 0 ? true : false
      } else {
        zoomOut = this.zoomDirect === 'decrease' ? true : false
      }

      const delta = zoomOut ? -0.5 : 0.5
      const newScale = this.position.scale + delta
      this.position.scale = newScale < 1 ? 0.5 : newScale
    }
  },

  updated: function() {}
}
</script>

<style scoped>
#svg-id {
  width: 100%;
  height: 100%;
}
.illustration_header {
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: flex-end;
}
.illustration_header_left_part {
  margin-left: 5px;
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
.illustration_header_riht_part,
.illustration_header_zoom_icon {
  cursor: pointer;
}
.illustration_panel_body {
  display: flex;
  flex-wrap: wrap;
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
  background: url('../../assets/icons.png') -5px -5px;
}
.uaz__light-icon {
  cursor: pointer;
  width: 17px;
  height: 17px;
  padding: 1px;
  background-color: #013e2c;
  border-radius: 3px;
  right: 0px;
  top: 1px;
  margin: 1px 2px;
}

.illustration_active {
  border: 3px solid #013e2c;
}
.illustration_wrapper {
  width: 100%;
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
  margin-left: auto;
}
.green_space {
  display: flex;
  background: #013e2c;
  width: 5px;
}
.uaz__icons-illustrations,
.uaz__on.uaz__icons-illustrations {
  background: url('../../assets/icons.png') -202px -162px;
}
.uaz__icons-resize-off,
.uaz__icons-resize-on {
  background: url('../../assets/icons.png') -86px -84px;
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
  /*Parts - Illustration: when increasing img - not all fit, so 100%*/
  width: 100% !important;
  height: 100% !important;
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
}
/*
.thumbViewClass {
  border: 1px solid black;
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
#thumbView {
  z-index: 110;
  background: white;
}

#scopeContainer {
  /* z-index: 120;*/
}

.emaps-links {
  position: absolute;
}
.simple-svg-map__content {
  bottom: 0;
  right: 0px;
  text-align: center;
  top: -150px;
}
</style>
