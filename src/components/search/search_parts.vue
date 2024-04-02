<template>
  <div class="parts_table_wrapper">
    <div class="ul">
      <!--Table: Bolt--><!--Table: Left-->
      <div class="li">{{ $t('modification') }}</div>
      <div class="li">{{ $t('comment') }}</div>
      <div class="li">{{ $t('yearIssue') }}</div>
      <div class="li">{{ $t('partCode') }}</div>
      <div class="li">{{ $t('partName') }}</div>
      <div class="li">{{ $t('illustration') }}</div>
      <div class="li"></div>
    </div>
    <div class="ul_background"></div>

    <div class="parts_search_table">
     <div class="scroll_table_container">
      <div class="parts_search_table_section scroll_table_container">
        <div
          :key="index"
          class="parts_table_model_section"
          v-for="(row, index) in partsData"
        >
          <div class="parts_table_model_heading">
            {{
              this.$i18n.locale == 'ru'
                ? partsData[index][getFirstKey(partsData[index])].info
                    .productModel_name
                : partsData[index][getFirstKey(partsData[index])].info
                    .productModel_name_en
            }}
          </div>
          <div class="parts_table_row_last">
            <div
              :key="index1"
              class="parts_table_row"
              v-for="(row1, index1) in partsData[index]"
            >
              <div class="parts_table_row__short_part">
                <div class="parts_table_cell modification">
                  <span @click="partSearch(row1.info.productModification_id)">
                    {{ formatName(row1.info.productModification_name) }}
                  </span>
                </div>
                <div class="parts_table_cell">
                  {{
                    this.$i18n.locale == 'ru'
                      ? row1.info.comment
                      : row1.info.comment_en
                  }}
                </div>
                <div class="parts_table_cell cell_year">
                  {{ row1.info.productModification_modelYear }}
                </div>
                <div class="parts_table_big_cell">
                  <template
                    :key="index2"
                    v-for="(row2, index2) in row[index1].items"
                  >
                    <div v-if="index2 < 2" class="parts_table_big_cell_subrow">
                      <div class="parts_table_cell right-td">
                        {{ row2.p_c }}
                      </div>
                      <div class="parts_table_cell center-td">
                        {{ row2.p_n }}
                      </div>
                      <div class="parts_table_cell g5 left-td">
                        <span
                          @click="
                            goToIllustration(
                              row[index1].info.productModel_id,
                              row[index1].info.productModification_id,
                              row2.i
                            )
                          "
                        >
                          {{ row2.g }}-{{ row2.sg }}-{{ row2.ig }}-{{ row2.ii }}
                        </span>
                      </div>
                    </div>
                  </template>
                </div>
                <span
                  v-if="row[index1].items.length > 2"
                  class="parts_table_row__short_part_checkbox"
                  @click="collapseIt(index1)"
                ></span>
              </div>

              <div
                :class="
                  'parts_table_big_cell_collapse parts_table_big_cell_collapse_' +
                    index1
                "
              >
                <template
                  :key="index2"
                  v-for="(row2, index2) in row[index1].items"
                >
                  <div
                    v-if="index2 >= 2"
                    class="parts_table_big_cell_subrow__collapsed"
                  >
                    <div class="collapse_row">
                      <div
                        class="parts_table_cell parts_table_cell__empty"
                      ></div>
                      <div
                        class="parts_table_cell parts_table_cell__empty"
                      ></div>
                      <div
                        class="parts_table_cell parts_table_cell__empty cell_year"
                      ></div>
                      <div class="parts_table_cell right-td2">
                        {{ row2.p_c }}
                      </div>
                      <div class="parts_table_cell center-td2">
                        {{ row2.p_n }}
                      </div>
                      <div class="parts_table_cell left-td2">
                        <span
                          @click="
                            goToIllustration(
                              row[index1].info.productModel_id,
                              row[index1].info.productModification_id,
                              row2.i
                            )
                          "
                          >{{ row2.g }}-{{ row2.sg }}-{{ row2.ig }}-{{
                            row2.ii
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
     <Pagination :paginate="paginate" :currentChange="handleCurrentChange" />
    </div>
  </div>
  <ModalContent
    v-if="searchVinInfo"
    v-model="showModal"
    :redirect-after-confim="redirectLink"
    :vin-info="searchVinInfo"
  />
</template>
<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import Pagination from '@/components/common/UI/Pagination.vue'
import { errorMixin } from '@/plugins/error.plugin'
import { mapState } from 'vuex'
import Search from './search.vue'
export default {
  props: {
    searchFilter: String
  },
  data() {
    return {
      searchValue: this.$route.query.query,
      section: '',
      redirectLink: '',
      partsData: {},
      searchVinInfo: {},
      showModal: false,
      paginate: {
        pageSize: 2,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapState({
      productModelId: state => state.modification.productModel_id,
      productModificationId: state => state.modification.productModification_id,
      vinThrough: state => state.vinThrough.THROUGH_VIN
    })
  },
  mounted() {
    this.getSection()
    this.getParts()
  },
  components: {
    ModalContent,
    Pagination,
    Search
  },
  methods: {
    getParts: function() {
      let params = {
        filter: this.searchValue,
        section: this.section,
        page: this.paginate.currentPage
      }
      if (
        this.vinThrough &&
        this.vinThrough.showInParts &&
        this.productModificationId
      ) {
        params.productModification_id = this.productModificationId
      } else {
        if (
          this.vinThrough &&
          this.vinThrough.alternative &&
          this.vinThrough.alternative.showInParts &&
          this.vinThrough.alternative.productModification_id
        ) {
          params.productModification_id = this.vinThrough.alternative.productModification_id
        }
      }
      Request.get('/part/search', {
        params
      })
        .then(response => {
          if (Object.keys(response.data.data).length) {
            this.partsData = response.data.data
            console.log(typeof response.data.data)

            this.paginate.total = response.data.total
            this.paginate.pageSize = response.data.per_page
            this.paginate.currentPage = response.data.page
          } else {
            errorMixin.methods.showError('warn', this.$t('notFoundAll'))
          }
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    handleCurrentChange(val) {
      this.getParts()
    },
    collapseIt: function(id) {
      var divToCollapse = document.getElementsByClassName(
        'parts_table_big_cell_collapse_' + id
      )[0]
      if (divToCollapse.style.display == 'block') {
        divToCollapse.style.display = 'none'
      } else {
        divToCollapse.style.display = 'block'
      }
    },
    partSearch: function(id) {
      Request.get('/productmodification/get/' + id, {
        params: {}
      })
        .then(response => {
          this.searchVinInfo = response.data
          this.redirectLink =
            '/parts/models-' +
            response.data.productModel_id +
            '/modification-' +
            response.data.productModification_id +
            '/'
          this.showModal = true
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    getSection: function() {
      this.section = this.$router.currentRoute._value.path.split('/')[1]
    },
    goToIllustration: function(modelId, modifId, IllId) {
      this.$router.push(
        '/parts/illustration/detail/' +
          IllId +
          '/?productModification_id=' +
          modifId +
          '&productModelId=' +
          modelId
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
    },
    getFirstKey: function(val) {
      return Object.keys(val)[0]
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    }
  },
  watch: {
    '$route.query.query': function(newValue, oldValue) {
      this.searchValue = newValue
      this.getParts()
    }
  }
}
</script>
<style scoped>
.parts_table_row__short_part {
  display: flex;
}
.parts_table_big_cell_subrow {
  display: flex;
}
.parts_table_big_cell_subrow__collapsed {
  display: block;
}
.parts_table_big_cell_collapse {
  display: none;
}
.collapse_row {
  display: flex;
}
.parts_table_cell__empty {
  width: 15%;
}
.parts_table_cell span {
  vertical-align: middle;
}
.parts_table_row__short_part_checkbox {
  width: 12px;
  height: 17px;
  background: url('../../assets/down_chevron.png') 0 5px no-repeat;
  background-size: 12px;
  padding: 10px;
  cursor: pointer;
}
.parts_table_row {
  border-top: 1px solid #fff;
}
.parts_table_model_section {
  background-color: #cfdbd9;
}
.parts_table_row_last {
  border-bottom: 1px solid #fff;
}
.parts_table_big_cell {
  width: 55%;
}
.parts_table_model_heading {
  /*when search Bolt */
  padding: 2px 5px 2px 5px;
  border-top: 0px solid #fff;
  border-bottom: 1px solid #fff;
  background-color: #5e7772;
  color: #fff;
  padding-bottom: 1px;
}
.ul_background {
  height: 1px;
}
.parts_table_cell {
  padding: 1px 5px;
  width: 16%;
}
.ul {
  display: flex;
  width: 100%;
}
.li {
  text-transform: uppercase;
  width: 15.8%;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px !important;
  font: 10px/17px Arial, sans-serif;
  font-weight: bold;
}
.li:nth-child(1),
.li:nth-child(2) {
  width: 16%;
}
.li:nth-child(3),
.cell_year {
  width: 11% !important;
}
.li:nth-child(4) {
  width: 15.95%;
}
.li:nth-child(5) {
  width: 30.25%;
}
.li:nth-child(6) {
  width: 8.8%;
}
.li:nth-child(7) {
  width: 2%;
}

.right-td {
  width: 29% !important;
}
.center-td {
  width: 55% !important;
}
.left-td {
  width: 16% !important;
}
.center-td2 {
  width: 30%;
}
.left-td2 {
  width: 9%;
  padding-left: 7px;
}
.modification,
.left-td,
.left-td2 {
  color: #00008b;
  cursor: pointer;
}
.modification:hover,
.left-td:hover,
.left-td2:hover {
  text-decoration: underline;
}

.parts_table_wrapper {
  background: #cfdbd9;
}
/* Table: Bolt */
.parts_table_wrapper,
.parts_search_table,
.parts_search_table_section {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}
.parts_search_table_section {
  border-bottom: 1px solid #fff;
  overflow: auto;
}
</style>