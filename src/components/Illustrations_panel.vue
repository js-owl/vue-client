<template>
  <div class="illustration_wrapper illustrations_wrapper">
    <div class="illustration_header">
      <div class="illustration_header_left_part">
        {{ $t('illustrations').toUpperCase() }}
      </div>
      <div
        class="illustration_header_riht_part"
        v-if="modification"
        @click="showVinModal"
      >
        {{ $t('modification') }}:
        {{ formatName(modification.productModification_name) }}
      </div>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('preview')"
        placement="bottom"
        popper-class="uaz__tooltip uaz__tooltip-bottom"
      >
        <div
          @click="zoomElement"
          class="illustration_header_zoom_icon uaz__icons-preview uaz__light-icon uaz__icons-preview"
        ></div>
      </el-tooltip>
    </div>
    <div
      v-if="!isZoomed && modificationID"
      class="uaz_parts_content_groups_table_right"
    >
      <!--uaz_parts_right_block_content_contianer -->
      <div class="illustration_panel_body illustration_panel_body_border">
        <div
          :id="'illustration_' + key"
          :key="key"
          @dblclick="selectIllustrationDetail(illustration.partGroup_id)"
          @click="selectIllustration(key, illustration.partGroup_id)"
          v-for="(illustration, key) in illustrations"
          :class="[
            'illustration_element ',
            { illustration_active: selectedIllustration == key }
          ]"
        >
          <img
            class="uaz__group-img"
            :src="
              '/storage/img/partgroups/partgroup_' +
                illustration.partGroup_id +
                '.png'
            "
          />
          <span class="uaz__illustration-number">
            {{ illustration.partGroup_group }}
            -
            {{ illustration.partGroup_subgroup }}
            -
            {{ formatTointeger(illustration.partGroup_imageGroup) }}
            -
            {{ illustration.partGroup_imageID }}
          </span>
        </div>
      </div>
    </div>
    <div v-show="isZoomed" class="illustration_panel_zoomed">
      <img class="uaz__group-img" id="zoomPic" />
    </div>
  </div>
  <ModalContent v-if="showModal" v-model="showModal" :vin-info="vinInfo" />
</template>
<script>
import { Request } from '@/services/axios.service'
import { mapState } from 'vuex'
import { errorMixin } from '@/plugins/error.plugin'
import { modificationNameFormatter } from '@/components/utils/helpers'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
export default {
  data() {
    return {
      selectedIllustration: 'undefined',
      selectedIllustrationPartId: 'undefined',
      zoomedId: 'undefined',
      isZoomed: false,
      showModal: false,
      vinInfo: {},
      modificationID: 0,
      modification: {}

      //illustrations:{}
    }
  },
  props: ['onIllustrationsDblclick', 'illustrations'],
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
  mounted: function() {
    this.modificationID = this.getModicationFromURL()
    this.getModidification()
  },
  methods: {
    formatTointeger: function(val) {
      return parseInt(val)
    },
    getModidification: function(id) {
      return Request.get('/productmodification/get/' + this.modificationID, {})
        .then(response => {
          this.modification = response.data
        })
        .catch(function(error) {})
    },
    //TODO make it global
    getModicationFromURL: function() {
      let urlArr = this.$router.currentRoute._value.path.split('/')
      let modification = 0
      urlArr.forEach(elem => {
        if (elem.startsWith('modification')) {
          modification = elem.split('-')[1]
        }
      })
      return modification
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
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
    selectIllustration: function(id, partId) {
      this.selectedIllustration = id
      this.selectedIllustrationPartId = partId
      var el = document.getElementById('illustration_inline_' + id)
      var active = document.getElementsByClassName('illustration_inline_active')
      var active2 = document.querySelectorAll('.illustration_active')
      var zoomedPic = document.getElementById('zoomPic')
      zoomedPic.src = '/storage/img/partgroups/partgroup_' + partId + '.png'
      active2.forEach(item => {
        item.classList.remove('illustration_active')
      })
      if (active[0]) {
        active[0].classList.remove('illustration_inline_active')
      }

      el.classList.add('illustration_inline_active')
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    },
    selectIllustrationDetail: function(partId) {
      this.onIllustrationsDblclick(partId)
    },
    zoomElement: function() {
      if (this.selectedIllustration !== 'undefined' && !this.isZoomed) {
        this.isZoomed = true
        this.zoomedId = this.selectedIllustration
      } else {
        if (this.selectedIllustration == 'undefined') {
          errorMixin.methods.showError('warn', this.$t('selectIllustartion'))
        }
        this.isZoomed = false
      }
    }
  },
  components: {
    ModalContent
  }
}
</script>
<style scoped>
.illustrations_wrapper {
  height: 100%;
  margin-top: 10px;
  /*variant3*/
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
.illustration_header {
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  height: 17px;
  line-height: 17px;
  display: flex;
}
.illustration_header.g3 {
  width: 100%;
}
.illustration_header_left_part {
  margin-left: 5px;
}
.illustration_header_riht_part {
  margin-left: auto;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);

  /*  overflow-y: scroll;
    height: 100%; */
  width: 100%;
}
.illustration_panel_body_border {
  padding: 5px;
}
.illustration_element {
  position: relative;
  flex: 1 0 218px;
  border: 1px solid #013e2c;
  box-sizing: border-box;
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
  background: url('../assets/icons.png') -4px -5px;
}
.uaz__light-icon {
  position: relative;
  cursor: pointer;
  width: 17px;
  height: 17px;
  padding: 1px;
  background-color: #013e2c;
  border-radius: 3px;
  right: -28px;
  top: 0px;
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
  border-radius: 0px;
  right: -12px;
  top: 0px;
}
.uaz_button_background_white .uaz__light-icon {
  right: 0px;
  top: -1px;
}

.illustration_active {
  border: 3px solid #013e2c;
}

.uaz_parts_content_groups_table_right,
.illustration_panel_zoomed {
  overflow-y: auto;
  height: 100%;
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar,
.illustration_panel_zoomed::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar-track,
.illustration_panel_zoomed::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar-thumb,
.illustration_panel_zoomed::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}
</style>
