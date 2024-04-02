<template>
  <div class="uaz_parts_container">
    <div class="uaz_parts_left_part">
      <div class="uaz_parts_block_header_contianer">
        <div class="uaz_parts_block_header">
          {{ $t('model').toUpperCase() }}
        </div>
        <div class="uaz_parts_block_header">
          {{ $t('production').toUpperCase() }}
        </div>
      </div>
      <div
        :key="Gkey"
        class="scroll_table_container scroll_table_container_main"
        v-for="(group, Gkey) in groups"
      >
        <div class="uaz_parts_left_part_category_name">
          {{
            this.$i18n.locale == 'ru'
              ? group.productModel_group
              : group.productModel_group_en
          }}
        </div>
        <div class="uaz_parts_left_part_model_list_container">
          <template v-if="group.models">
            <div
              :key="key2"
              @click="selectModel(model.productModel_id, group.id)"
              :class="[
                'uaz_parts_left_part_model_list_row ',
                { row_active: selectedModel == model.productModel_id }
              ]"
              v-for="(model, key2) in group.models"
            >
              <div
                class="uaz_parts_left_part_model uaz_parts_left_part_model_left"
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="getLabelInfo(model.greenRoundType)"
                  placement="right"
                  popper-class="uaz__tooltip uaz__tooltip-right"
                >
                  <div
                    :class="[
                      {
                        'uaz__fullness-green': model.greenRoundType !== 'none'
                      },
                      {
                        'uaz__fullness-green--semi':
                          model.greenRoundType == 'half'
                      }
                    ]"
                  ></div>
                </el-tooltip>
                {{
                  this.$i18n.locale == 'ru'
                    ? model.productModel_name.toUpperCase()
                    : model.productModel_name_en.toUpperCase()
                }}
                <!-- {{ model.productModel_name }} -->
              </div>
              <div
                v-if="model.years"
                class="uaz_parts_left_part_model uaz_parts_left_part_model_right"
              >
                {{ model.years[0] }} >>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="uaz_parts_middle_part">
      <div class="uaz_parts_block_header_contianer">
        <div class="uaz_parts_block_header">
          {{ $t('yearIssue').toUpperCase() }}
        </div>
      </div>
      <template
        v-if="
          selectedGroup !== 'undefined' &&
            selectedModel !== 'undefined' &&
            groups[selectedGroup].models[selectedModel]
        "
      >
        <div
          :key="Ykey"
          v-for="(year, Ykey) in groups[selectedGroup].models[selectedModel]
            .years"
          @click="selectYear(Ykey)"
          :class="[
            'uaz_parts_middle_part_year ',
            { row_active: selectedYear == Ykey }
          ]"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('illustrations50')"
            placement="bottom"
            popper-class="uaz__tooltip uaz__tooltip-bottom"
          >
            <div
              v-if="
                inArray(
                  year,
                  groups[selectedGroup].models[selectedModel].greenRoundYears
                )
              "
              class="uaz__fullness-green uaz__fullness-green-year"
            ></div>
            <div v-else class="uaz_parts_availability_marker"></div>
          </el-tooltip>
          {{ year }}
        </div>
      </template>
    </div>
    <div class="uaz_parts_right_part">
      <!-- <div v-if="isScrolling" @click="scrollTo('top')" class="uaz__ngsb-thumb-btn-up"></div>
    <div v-if="isScrolling"  @click="scrollTo('bottom')" class="uaz__ngsb-thumb-btn-down"></div> -->
      <div class="uaz_parts_block_header_contianer">
        <div class="uaz_parts_block_header__modification">
          {{ $t('modification').toUpperCase() }}
        </div>
        <div class="uaz_parts_block_header__comment">
          {{ $t('comment').toUpperCase() }}
        </div>
      </div>
      <div class="scroll_table_container" id="modification_list">
        <div
          @click="selectModification(modification.productModification_id)"
          @dblclick="showContent(modification)"
          :key="Mkey"
          v-for="(modification, Mkey) in modifications"
          :class="[
            'uaz_parts_right_block_content_row ',
            {
              row_active:
                selectedModification == modification.productModification_id
            }
          ]"
        >
          <div class="uaz_parts_right_block_content__modification">
            {{ formatModificationName(modification.productModification_name) }}
          </div>
          <div class="uaz_parts_right_block_content__comment">
            {{
              this.$i18n.locale == 'ru'
                ? modification.comment
                : modification.comment_en
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
const axios = require('axios')
import { Request } from '@/services/axios.service'
import { errorMixin } from '@/plugins/error.plugin'
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  name: 'Choose_modification',
  props: {
    section: String
  },
  data() {
    return {
      selectedModel: 'undefined',
      selectedGroup: 'undefined',
      selectedYear: 'undefined',
      selectedModification: 'undefined',
      isScrolling: false,
      groups: {},
      modifications: {}
    }
  },
  components: {},
  mounted: function() {
    this.getGroups()
    //   this.lookforScroll();
    window.addEventListener('resize', this.lookforScroll)
    if (this.$route.query.productModelId) {
      this.selectModel(this.$route.query.productModelId, 0)
      this.selectModification(this.$route.query.productModification_id)
    }
  },
  methods: {
    formatModificationName: function(val) {
      return modificationNameFormatter(val)
    },
    scrollTo: function(direction) {
      var target = document.getElementById('modification_list')
      var coords = direction === 'top' ? 0 : target.scrollHeight
      target.scrollTo(0, coords)
    },
    lookforScroll: function() {
      /*var target = document.getElementById('modification_list');
      if(target.scrollHeight > target.clientHeight){
        this.isScrolling = true;
      }
      else{
        this.isScrolling = false;
      }*/
    },
    showContent: function(modification) {
      const {
        productModel_id: productModelId,
        productModification_id: productModificationId,
        showInParts
      } = modification
      if (this.section) {
        this.$store.commit(
          'filters/SET_YEAR',
          this.groups[this.selectedGroup].models[this.selectedModel].years[
            this.selectedYear
          ]
        )
      }
      if (this.section == 'parts') {
        this.$router.push(
          '/parts/models-' +
            productModelId +
            '/modification-' +
            productModificationId +
            '/'
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
      if (this.section == 'diagnostic') {
        this.$router.push(
          '/diagnostic/models-' +
            productModelId +
            '/modification-' +
            productModificationId +
            '/'
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
      if (this.section == 'flowchart') {
        //       this.$router.push('/flowcharts/search/flowcharts-list/');
        if (showInParts) {
          this.$router.push(
            '/flowcharts/models-' +
              productModelId +
              '/modification-' +
              productModificationId +
              '/'
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        } else {
          this.$store.commit('modification/SET_FULL_STATE', modification)
          this.$router.push('/flowcharts/search/flowcharts-list/')
          this.$store.commit('section/SET_PAGE_LEVEL', 1)
        }
      }
      if (this.section == 'emaps') {
        this.$router.push(
          '/emaps/models-' +
            productModelId +
            '/modification-' +
            productModificationId +
            '/'
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
    },
    getLabelInfo: function(text) {
      return text == 'half'
        ? this.$t('illustrationsNotAll')
        : this.$t('illustrations50')
    },
    getGroups: function() {
      Request.get('/productmodel', {
        params: {
          section: this.section
        }
      })
        .then(response => {
          let data = response.data.data
          data.map((el, index) => {
            for (const [key, value] of Object.entries(el.models)) {
              data[index].models[key].years = data[index].models[
                key
              ].years.sort((a, b) => b - a)
            }
          })
          this.groups = data
        })
        .catch(function(error) {
          console.log(error)
          //   errorMixin.methods.showError('warn',error.response.data.message);
        })
      //Object.entries(localStorage).forEach(([ key, value, filters ]) => {
      //    console.log(`${key} => ${value}`,'77777');
      //})
    },
    selectModel: function(id, groupKey) {
      this.selectedModel = id
      this.selectedGroup = groupKey
      this.selectedYear = 'undefined'
      this.selectedModification = 'undefined'
      Request.get('/productmodification', {
        params: {
          productModel_id: this.selectedModel,
          section: this.section,
          showInDealer: 1,
          time: Date.now()
        }
      })
        .then(response => {
          this.modifications = response.data.data
        })
        .catch(function(error) {
          errorMixin.methods.showError('warn', error.response.data.message)
        })
    },
    selectYear: function(id) {
      this.selectedYear = id
      this.selectedModification = 'undefined'
      if (
        this.selectedGroup !== 'undefined' &&
        this.selectedModel !== 'undefined' &&
        this.selectedYear !== 'undefined'
      ) {
        Request.get('/productmodification', {
          params: {
            productModel_id: this.selectedModel,
            section: this.section,
            year: this.groups[this.selectedGroup].models[this.selectedModel]
              .years[this.selectedYear],
            showInDealer: 1,
            time: Date.now()
          }
        })
          .then(response => {
            this.modifications = response.data.data
          })
          .catch(function(error) {
            errorMixin.methods.showError('warn', error.response.data.message)
          })
      }
    },
    selectModification: function(id) {
      this.selectedModification = id
    },
    inArray: function(needle, haystack) {
      return haystack.includes(needle)
    }
  }
}
</script>
<style>
.uaz_content_container {
  width: 100%;
}
.uaz_parts_left_part {
  flex-grow: 5;
  margin-right: 10px;
  height: 100%;
  background: #cfdbd9;
  width: 25%;
  width: 465px;
}
.uaz_parts_middle_part {
  flex-grow: 1;
  margin-right: 10px;
  height: 100%;
  width: 136px;
  width: 150px;
  background: #cfdbd9;
}
.uaz_parts_right_part {
  flex-grow: 10;
  height: 100%;
  background: #cfdbd9;
  width: 46%;
  width: calc(100% - 717px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.scroll_table_container_main {
  height: initial !important;
}
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}
.uaz_parts_block_header_contianer .uaz_parts_block_header__modification,
.uaz_parts_block_header_contianer .uaz_parts_block_header__comment {
  padding: 2px 4px 3px;
}
.uaz_parts_right_block_content_row {
  display: flex;
  justify-content: flex-start;
  background-color: #cfdbd9;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  border-top: 1px solid #fff;
}
.uaz_parts_right_block_content_row:last-child {
  border-bottom: 1px solid #fff;
}
.uaz_parts_block_header {
  flex-grow: 1;
  padding: 2px 4px 3px;
  width: 50%;
}
.uaz_parts_block_header__comment {
  flex-grow: 3;
  padding: 4px;
  width: 56%;
}
.uaz_parts_block_header__modification {
  flex-grow: 1;
  padding: 4px;
  width: 20%;
}
.uaz_parts_right_block_content__modification {
  flex-grow: 1;
  padding: 4px;
  border-right: 1px solid #fff; /* Parts : right block vertical line in the middle of table */
  width: 20%;
}
.uaz_parts_right_block_content__comment {
  flex-grow: 3;
  padding: 4px;
  width: 56%;
}
.uaz_parts_left_part_category_name {
  background-color: #7fa099;
  border-bottom: 1px solid #fff;
  color: white;
  padding: 2px 5px;
  text-transform: uppercase;
}
.uaz_parts_left_part_model_list_row {
  display: flex;
  cursor: pointer;
  min-height: 17px;
  line-height: 17px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
  box-sizing: border-box;
}
.uaz_parts_left_part_model_left {
  border-right: 1px solid #fff;
}
.uaz_parts_left_part_model {
  flex-grow: 1;
  padding: 1px 8px;
  width: 50%;
}
.uaz_parts_left_part_model_list_row.row_active,
.uaz_parts_right_block_content_row.row_active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
}
.uaz_parts_middle_part_year.row_active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
  box-sizing: border-box;
  height: 20px;
}
.uaz_parts_middle_part_year {
  width: 100%;
  display: block;
  height: 21px;
  line-height: 18px;
  padding: 1px 0px 1px 1px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
}
.uaz_parts_availability_marker {
  width: 18px;
  display: inline-block;
}
.uaz_parts_content_groups_table_cell__number {
  margin: 0px 0px 0px 2px;
  width: 0px;
  display: inline-block;
  vertical-align: middle;
}
.uaz_parts_content_groups_table_cell__number_right {
  line-height: normal;
  padding-right: 5px;
}
.uaz_parts_content_groups_table_cell__left {
  display: -webkit-inline-box;
}
.uaz_parts_content_groups_table_left {
  border-right: 2px solid #fff;
  display: -webkit-inline-box;
}

.uaz_parts_container {
  position: relative;
}
.uaz__ngsb-thumb-btn-down,
.uaz__ngsb-thumb-btn-up {
  position: absolute;
  right: 0px;
  width: 20px;
  border-radius: 2px;
  background-color: #7fa099;
  height: 19px;
  cursor: default;
  border-bottom: 1px solid white;
}
.uaz__ngsb-thumb-btn-down:after,
.uaz__ngsb-thumb-btn-up:after {
  position: absolute;
  left: 3px;
  top: 2px;
  content: '^';
  font-family: cursive;
  font-size: 20px;
  height: 20px;
  color: #013e2c !important;
}
.uaz__ngsb-thumb-btn-down {
  bottom: 0;
}
.uaz__ngsb-thumb-btn-down:after {
  top: 1px;
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.uaz__fullness-green {
  background-color: green;
}
.uaz__fullness-empty,
.uaz__fullness-green {
  z-index: 0;
  width: 10px;
  height: 10px;
  border: 1px solid #000 !important;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
}
.uaz__fullness-green--semi {
  background: linear-gradient(to right, green 50%, #fff 50%);
}
.uaz__fullness-green-year {
  margin: 0 0 1px 8px;
}
.uaz_parts_middle_part_year,
.uaz_parts_right_block_content__modification,
.uaz_parts_right_block_content__comment {
  cursor: pointer;
}
</style>
