<template>
  <div
    v-if="partData && partData.parentTree && partData.parentTree[0]"
    class="illustration_wrapper_breadcrumbs"
  >
    <div class="illustration_breadcrumbs">
      {{
        this.$i18n.locale == 'ru'
          ? partData.parentTree[0].partGroup_name
          : partData.parentTree[0].partGroup_name_en
      }}
      /
      {{
        partData.partGroup_name_en
          ? this.$i18n.locale == 'ru'
            ? partData.partGroup_name
            : partData.partGroup_name_en
          : partData.partGroup_name
      }}
    </div>
  </div>
  <div
    :class="[
      'uaz_parts_container',
      { uaz_parts_container_carousel: (carouselStatus = !carouselStatus) }
    ]"
  >
    <div class="uaz_parts_content_left_part">
      <illustration-detail :selectedPart="selectedPart" />
    </div>
    <resizer />
    <div class="uaz_parts_content_right_part">
      <div class="illustration_right_table">
        <div class="uaz_parts_content_groups_table_heading_right">
          <div
            class="uaz_parts_content_table_heading_cell uaz_parts_content_table_detail_heading_position"
          >
            {{ $t('positionCut').toUpperCase() }}
          </div>
          <div
            class="uaz_parts_content_table_heading_cell uaz_parts_content_table_detail_heading_number"
          >
            {{ $t('detailNumber').toUpperCase() }}
          </div>
          <div
            class="uaz_parts_content_table_heading_cell uaz_parts_content_table_detail_heading_name padding_fix"
          >
            {{ $t('name').toUpperCase() }}
          </div>
          <div
            class="uaz_parts_content_table_heading_cell uaz_parts_content_table_detail_heading_notes"
          >
            <span class="margin_fix">{{ $t('note').toUpperCase() }}</span>
          </div>
          <div
            class="uaz_parts_content_table_heading_cell uaz_parts_content_table_detail_heading_quantity scroll_fix_1"
          >
            <span>{{ $t('countCut').toUpperCase() }}</span>
          </div>
        </div>
        <div class="loading_div">
          <div
            v-if="group_details.length"
            id="uaz_parts_content_groups_table_right_id_right"
            class="uaz_parts_content_groups_table_right uaz_parts_content_right_part_border scroll_table_container"
          >
            <div
              :id="'illustration_inline_' + row.part_id"
              @dblclick="showPopup(row.part_id)"
              @click="selectIllustrationInline(row.part_id, row.codes4pos[0])"
              :key="key"
              v-for="(row, key) in group_details"
              class="uaz_parts_content_groups_table_row"
            >
              <div
                class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_detail_heading_position"
              >
                {{ row.new_position }}
              </div>
              <div
                class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_detail_heading_number"
              >
                {{ row.part_code }}
              </div>
              <div
                class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_detail_heading_name"
              >
                {{
                  row.part_name_en
                    ? this.$i18n.locale == 'ru'
                      ? row.part_name
                      : row.part_name_en
                    : row.part_name
                }}
              </div>
              <div
                class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_detail_heading_notes"
              >
                {{
                  row.part_description_en
                    ? this.$i18n.locale == 'ru'
                      ? row.part_description
                      : row.part_description_en
                    : row.part_description
                }}
              </div>
              <div
                class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_detail_heading_quantity"
              >
                {{ row.quantity }}
              </div>
            </div>
          </div>
          <div v-if="!group_details.length" class="message_no_data">
            {{ $t('partsNo').toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="uaz_resizer_footer"></div>
  <div
    :class="[
      'uaz_parts_footer',
      { uaz_parts_footer_carousel: (carouselStatus = !carouselStatus) }
    ]"
    name="fade"
  >
    <illustrations-carousel v-if="carouselStatus" />
  </div>
  <ModalContent v-if="idForPopUp" v-model="idForPopUp" />
</template>

<script>
// @ is an alias to /src
const axios = require('axios')
import { Request } from '@/services/axios.service'
import Illustration_detail from '@/components/Illustrations_detail.vue'
import Illustrations_carousel from '@/components/Illustrations_carousel.vue'
import Resizer from '@/components/utils/resizeble_split_divs.vue'
import Modal from '@/components/diagnostic/Modal.vue'
import ModalContent from '@/components/modal_templates/Detail_part.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { ElLoading } from 'element-plus'
export default {
  name: 'Parts_illustration_detail',
  data() {
    return {
      group_details: {},
      selectedPart: '',
      selectedPartID: '',
      svgDocument: {},
      selectedPartOnSchemaId: 0,
      svgThumb: {},
      parts4display: {},
      newLeftWidth: 0,
      idForPopUp: 0,
      partData: {}
    }
  },
  components: {
    'illustration-detail': Illustration_detail,
    'illustrations-carousel': Illustrations_carousel,
    resizer: Resizer,
    Modal,
    ModalContent
  },
  mounted: function() {
    this.initResize()
    this.getDetails()
    this.loadSvg()
    // setTimeout(() => {
    //   this.svgDocument = document.getElementById('mainView').getSVGDocument()
    //   //this.svgThumb = document.getElementById('thumbView').getSVGDocument();
    //   // this.removeIds();
    //   this.addClickEvents()
    // }, 5000)
    this.getData()
  },
  computed: {
    ...mapGetters({
      carouselStatus: 'settings/getCarouselStatus'
    })
  },
  methods: {
    loadSvg() {
      let embed = document.getElementById('mainView')
      embed.onload = () => {
        this.svgDocument = embed.getSVGDocument()
        console.log('svgDocument', this.svgDocument)
      }
    },
    getData: function() {
      if (this.$route.params.illustrationId) {
        Request.get('/partgroup/get/' + this.$route.params.illustrationId, {})
          .then(response => {
            this.partData = response.data.data
          })
          .catch(function(error) {})
      }
    },
    getDetails: function(id) {
      if (this.$route.query.productModelId) {
        const loading = ElLoading.service({
          lock: true,
          background: '#cfdbd9',
          target: '.loading_div'
        })
        Request.get('/part', {
          params: {
            partTMPGroup_id: this.$route.params.illustrationId,
            productModification_id: this.$route.query.productModification_id,
            productModel_id: this.$route.query.productModelId,
            year: 2021
          }
        })
          .then(response => {
            let details = this.sortDetail(response.data.data)
            this.group_details = details
            this.creatingArrayForSvg(response.data.data)
            loading.close()
          })
          .catch(function(error) {
            console.log(error)

            //   errorMixin.methods.showError('warn',error.response.data.message);
          })
      }
    },
    sortDetail: function(arr) {
      //  let res = arr.filter(el => !el.isBlocked);
      let res = arr
      let arrPositions = []
      res.filter(element => {
        if (!arrPositions.includes(element.new_position)) {
          arrPositions.push(element.new_position)
        } else {
          element.new_position = ''
        }
      })
      return res
    },
    showPopup: function(id) {
      this.idForPopUp = id
    },

    selectIllustrationInline: function(partId, idOnSchhema) {
      var elInline = document.getElementById('illustration_inline_' + partId)
      var active = document.getElementsByClassName('illustration_inline_active')
      if (active[0]) {
        if ('illustration_inline_' + partId === active[0].id) {
          active[0].classList.remove('illustration_inline_active')
          this.highlightPart(idOnSchhema, false)
        } else {
          active[0].classList.remove('illustration_inline_active')
          elInline.classList.add('illustration_inline_active')
          this.highlightPart(idOnSchhema, true)
        }
      } else {
        elInline.classList.add('illustration_inline_active')
        this.highlightPart(idOnSchhema, true)
      }
    },

    getPartIdFromSchemaId: function(schemaID) {
      let idNeeded = 0
      this.group_details.forEach(element => {
        if (!idNeeded && element.part_code == schemaID) {
          idNeeded = element.part_id
        }
      })
      return idNeeded
    },

    highlightPart: function(partId, selected) {
      var elements = this.svgDocument.getElementById(partId)
        ? this.svgDocument.getElementById(partId).childNodes
        : []
      if (this.selectedPart) {
        this.clearPart(this.selectedPart)
      }
      for (var i = 0; i < elements.length; i++) {
        if ('text' !== elements[i].parentNode.nodeName) {
          if (!elements[i].style) {
            Object.defineProperty(elements[i], 'style', {
              value: {},
              writable: true, // запретить присвоение "user.name="
              configurable: true // запретить удаление "delete user.name"
            })
          }
          if (!selected) {
            elements[i].style.stroke = ''
            elements[i].style.strokeWidth = ''
          } else {
            if (elements[i].nodeName !== 'text') {
              elements[i].style.stroke = '#FBFF12'
              elements[i].style.strokeWidth = '0.25%'
              this.selectedPart = partId
            } else {
              elements[i].style.cursor = 'pointer'
            }
          }
        } else {
          elements[i].style.cursor = 'pointer'
        }
      }
    },
    removeIds: function() {
      let allG = this.svgThumb ? this.svgThumb.getElementsByTagName('g') : []
      for (var i = 0; i < allG.length; i++) {
        allG[i].removeAttribute('id')
      }
    },
    addClickEvents: function() {
      let allG = this.svgDocument
        ? this.svgDocument.getElementsByTagName('g')
        : []
      let switching
      for (var i = 0; i < allG.length; i++) {
        var childs = allG[i].childNodes
        if (
          allG[i].getAttribute('id') &&
          allG[i].getAttribute('id').length === 15
        ) {
          allG[i].style.cursor = 'pointer'
          this.hideElementsOnSVG(allG[i].getAttribute('id'))
          for (var j = 0; j < childs.length; j++) {
            var isDragging,
              startingPos = []
            childs[j].addEventListener('mousedown', evt => {
              isDragging = false
              startingPos = [evt.pageX, evt.pageY]
            })
            childs[j].addEventListener('mousemove', evt => {
              if (
                !(evt.pageX === startingPos[0] && evt.pageY === startingPos[1])
              ) {
                isDragging = true
              }
            })
            childs[j].addEventListener('mouseup', e => {
              if (!isDragging) {
                if (!switching) {
                  this.highlightPartOnSchema(e)
                }
                switching = true
                setTimeout(function() {
                  switching = false
                }, 100)
              }
              isDragging = false
              startingPos = []
            })
          }
        }
      }
    },
    highlightPartOnSchema: function(e) {
      if ('g' === e.target.parentNode.nodeName) {
        if (e.target.parentNode.id && e.target.parentNode.id.length === 15) {
          console.log(e.target.parentNode.id, 'fired')
          //если нажалит на схеме
          if (
            this.selectedPartOnSchemaId &&
            this.selectedPartOnSchemaId == e.target.parentNode.id
          ) {
            this.selectedPartOnSchemaId = 0
            this.highlightPart(e.target.parentNode.id, false)
            this.selectIllustrationInline(
              this.getPartIdFromSchemaId(e.target.parentNode.id),
              e.target.parentNode.id
            )
          } else {
            this.highlightPart(e.target.parentNode.id, true)
            this.selectIllustrationInline(
              this.getPartIdFromSchemaId(e.target.parentNode.id),
              e.target.parentNode.id
            )
            this.selectedPartOnSchemaId = e.target.parentNode.id
            var el = document.getElementById(
              'illustration_inline_' +
                this.getPartIdFromSchemaId(e.target.parentNode.id)
            )
            el.scrollIntoView({ block: 'center', behavior: 'smooth' })
          }
        }
      }
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
    },
    creatingArrayForSvg: function(parts) {
      for (var i = 0; i < parts.length; i++) {
        //if (parts[i].isBlocked != 1) {
        this.parts4display[parts[i].part_code] = true
        //  }
      }
    },
    hideElementsOnSVG: function(id) {
      console.log(id, 'hideElementsOnSVG')
      if (typeof this.parts4display[id] === 'undefined') {
        var el = this.svgDocument.getElementById(id)
        el.style.display = 'none'
      }
    },
    initResize: function() {
      // Query the element
      const resizer = document.getElementById('dragMe')
      const leftSide = resizer.previousElementSibling
      const rightSide = resizer.nextElementSibling

      // The current position of mouse
      let x = 0
      let y = 0

      // Width of left side
      let leftWidth = 0

      // Handle the mousedown event
      // that's triggered when user drags the resizer
      const mouseDownHandler = function(e) {
        // Get the current mouse position
        x = e.clientX
        y = e.clientY
        leftWidth = leftSide.getBoundingClientRect().width

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
      }
      const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - x
        const dy = e.clientY - y

        this.newLeftWidth =
          ((leftWidth + dx) * 100) /
          resizer.parentNode.getBoundingClientRect().width
        if (this.newLeftWidth > 24 && this.newLeftWidth < 62) {
          leftSide.style.width = `${this.newLeftWidth}%`
          document.body.style.cursor = 'pointer'
          leftSide.style.userSelect = 'none'
          leftSide.style.pointerEvents = 'none'

          rightSide.style.userSelect = 'none'
          rightSide.style.pointerEvents = 'none'
        }
      }
      const mouseUpHandler = function() {
        resizer.style.removeProperty('cursor')
        document.body.style.removeProperty('cursor')

        leftSide.style.removeProperty('user-select')
        leftSide.style.removeProperty('pointer-events')

        rightSide.style.removeProperty('user-select')
        rightSide.style.removeProperty('pointer-events')

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
        window.main.resize()
        window.main.reset()
      }
      // Attach the handler
      resizer.addEventListener('mousedown', mouseDownHandler)
    }
    /* showIllustrationCarousel:function(e){
      e.target.classList.toggle("carousel__on");
    },	*/
  },
  watch: {
    '$route.params.illustrationId': function(newVal, oldVal) {
      this.getDetails()
    }
  }
}
</script>
<style scoped>
.uaz_parts_content_left_part {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100%; /*длина левой колонки над каруселью*/
  overflow: hidden;
}
.uaz_parts_content_right_part {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  flex-direction: column;
  /*overflow-x: hidden; - убрали скрол у правого блока в листе с каруселью*/
  border: 0px;
}
/*Иллюстрация(карусель): правый блок-снизу границу увеличили */
.loading_div {
  height: 100%;
  overflow-x: hidden;
}
/*Запчасти,Иллюстрация: правый блок - пустой верхний див */
.uaz_parts_content_right_part .empty {
  height: 19px;
  background-color: #fff;
}
.uaz_parts_content_groups_table_heading {
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.uaz_parts_content_groups_table {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-transform: uppercase;
  background: #cfdbd9;
}
.uaz_parts_content_groups_table_cell {
  padding: 4px;
  cursor: pointer;
  line-height: 8px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
  box-sizing: border-box;
  width: 50%;
}
.uaz_parts_content_groups_table_cell_right {
  padding: 4px; /*Иллюстрация(карусель): правый блок*/
  cursor: pointer;
  background: #cfdbd9;
  box-sizing: border-box;
  border-right: 1px solid white; /*Иллюстрация: правый блок-линия справа у таблицы*/
}
.uaz_parts_content_groups_table_cell_right:last-child {
  border-right: 0px; /*Иллюстрация(карусель): правый блок-линия справа у таблицы*/
}
.uaz_parts_content_groups_table_cell__left {
  display: -webkit-inline-box;
}
.uaz_parts_content_groups_table_left {
  border-right: 2px solid #fff;
  display: -webkit-inline-box;
}

.uaz_parts_content_groups_table_heading span {
  margin-left: 5px;
}
.illustration_right_table .uaz_parts_content_groups_table_heading_right {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  height: 18px;
  line-height: 20px;
}
.uaz_parts_content_table_detail_heading_position {
  width: 10%;
  text-align: center;
}
.uaz_parts_content_table_detail_heading_number {
  width: 20%;
  text-align: center;
}
.uaz_parts_content_table_detail_heading_name {
  width: 30%;
  text-align: center;
}
.uaz_parts_content_table_detail_heading_notes {
  width: 30%;
  text-align: center;
}
.uaz_parts_content_table_detail_heading_quantity {
  width: 10%;
  text-align: center;
}
.uaz_parts_content_groups_table_row {
  display: flex;
  width: 100%;
  background: #cfdbd9;
  border-top: 1px solid #fff; /*Иллюстрация(карусель): правый блок*/
}
.uaz_parts_content_groups_table_row:last-child {
  border-bottom: 1px solid #fff; /*Иллюстрация(карусель): правый блок*/
}
.margin_fix {
  margin-left: 4px;
  padding-right: 22px;
}
.padding_fix {
  padding-right: 7px;
}
.uaz_parts_content_groups_table_cell__number {
  margin: 0px 27px 0px 2px;
  width: 0px;
  display: inline-block;
  vertical-align: middle;
}
.uaz_parts_content_groups_table_cell__number_right {
  line-height: normal;
  padding-right: 5px;
}

.illustration_inline_active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
}
.illustration_inline_active .uaz_parts_content_groups_table_cell_right {
  background: #fff !important;
}
.scroll_fix_1 {
  position: relative;
  left: -7px;
  white-space: nowrap;
  overflow: hidden;
}
.uaz_parts_content_table_detail_heading_name,
.uaz_parts_content_table_detail_heading_notes {
  text-align: left;
}

.uaz_parts_footer {
  left: 0;
  bottom: 0;
  height: 150px;
}
/*иллюстрация(карусель)ЗЧ:при выборе числа левого блока, со скроллом правого блока всё уходило вверх*/
.uaz_parts_footer_carousel {
  display: none;
}
.uaz_resizer_footer {
  height: 10px;
}
.uaz_parts_container {
  height: 70%;
  max-height: calc(100% - 177px);
  min-height: calc(100% - 177px);
}
.uaz_parts_container_carousel {
  height: 100%;
  max-height: none;
  /*padding-bottom: 15px;*/
}

/*правый блок Иллюстрации (отступ от карусели)*/
.illustration_right_table {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.uaz_parts_content_right_part_border {
  background: #cfdbd9;
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
.illustration_wrapper_breadcrumbs {
  height: 19px;
}
text {
  cursor: pointer;
  color: red;
}
</style>
