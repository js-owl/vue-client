<template>
  <div class="flowcharts_wrapper link column_width">
    <div class="parts_table_wrapper scroll_table">
      <el-table
        class="none_scrolling table_column_top table_auto_body"
        :data="flowchartsDataList"
        :columns="columns"
        :class="className"
        style="width: 100%"
        :cell-class-name="uazbodycell"
        :header-cell-class-name="uazheadercell"
        :row-class-name="uazbodyrow"
        :header-row-class-name="uazheaderrow"
        :empty-text="notFound"
        @row-click="handleRowClick"
        @sort-change="handleSort"
        :span-method="spanMethod"
        :height="height ? height : null"
        ><!--@cell-dblclick="handleDBClick"-->
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :label="column.label"
          :width="column.width"
          :prop="column.prop"
          :sortable="column.sortable"
        >
          <template #default="scope">
            <div
              v-if="column.prop != 'modifications'"
              @click="handleDBClick(scope.row)"
            >
              {{ scope.row[column.prop] }}
            </div>
            <!-- @change="handleChange" -->
            <div v-else>
              <el-collapse
                :key="index"
                v-for="(modification, index) in scope.row[column.prop]"
              >
                <el-collapse-item
                  v-if="index === 0"
                  :title="formatName(modification.productModification_name)"
                >
                  <div
                    :key="modification.productModification_id"
                    v-for="(modification, index) in scope.row[column.prop]"
                  >
                    <div v-if="index > 0">
                      {{ formatName(modification.productModification_name) }}
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:50%"></div>
    </div>
    <Pagination :paginate="paginate" :currentChange="handleCurrentChange" />
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import Pagination from '@/components/common/UI/Pagination.vue'
import { errorMixin } from '@/plugins/error.plugin'
import { mapState } from 'vuex'
import Search from './search.vue'
// const handleChange = val => {}
export default {
  data() {
    return {
      nextPageUrl: '/flowchart',
      year: 2020,
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row',
      notFound: this.$t('notFound'),
      searchValue: this.$route.query.query,
      section: '',
      flowchartsDataList: [],
      paginate: {
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          prop: 'flowChart_code',
          label: this.$t('code').toUpperCase(),
          width: 50,
          havePopUp: 'true'
        },
        {
          prop: 'flowChart_name',
          // prop: this.c,
          // `${
          //   this.$i18n.locale == 'ru' ? 'flowChart_name' : 'flowChart_name_en'
          // }`,
          label: this.$t('title').toUpperCase()
        },
        {
          prop: 'modifications',
          label: this.$t('applicability').toUpperCase(),
          width: 250
        }
      ]
    }
  },
  computed: {
    ...mapState('vinThrough', ['THROUGH_VIN']),
    ...mapState({
      productModelId: state => state.modification.productModel_id,
      productModificationId: state => state.modification.productModification_id,
      productModification_modelYear: state =>
        state.modification.productModification_modelYear
    }),
    c() {
      // console.log('flowChart_name')
      return 'flowChart_name'
    }
  },
  mounted() {
    this.getFlowchartsList()
  },
  props: [
    'searchFilter',
    'data',
    'handleRowClick',
    'handleSort',
    'spanMethod',
    'className',
    'height',
    'productModel_id',
    'productModification_id'
  ],
  //props: ["searchFilter", "data", "handleRowClick", "handleSort", "spanMethod", "className", "height"],
  components: {
    ModalContent,
    Pagination,
    Search
  },
  methods: {
    getFlowchartsList: function() {
      let params = {
        isPublish: '1',
        productModel_id:
          this.THROUGH_VIN && this.THROUGH_VIN.showInFlowchart
            ? this.THROUGH_VIN.productModel_id
            : this.productModelId,
        productModification_id:
          this.THROUGH_VIN && this.THROUGH_VIN.showInFlowchart
            ? this.THROUGH_VIN.productModification_id
            : this.productModificationId,
        section: 'flowcharts',
        type: 'all',
        page: this.paginate.currentPage
      }
      Request.get('/flowchart/', { params })
        .then(response => {
          if (Object.keys(response.data.data).length) {
            this.flowchartsDataList = response.data.data
            response.data.PRODUCTMODIFICATION_NAME

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
    handleDBClick(elem) {
      this.$router.push(
        `/flowcharts/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.productModification_modelYear}/flowchart-${elem.flowChart_id}`
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
    },
    handleCurrentChange(val) {
      this.getFlowchartsList()
    },
    goToIllustration: function() {
      console.log('fired')
    },
    getFirstKey: function(val) {
      return Object.keys(val)[0]
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    }
  }
}
</script>
<style scoped>
.flowcharts_wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.parts_table_wrapper {
  height: 100%;
  overflow-y: hidden;
  background: #cfdbd9;
  display: flex;
  flex-wrap: wrap;
  text-transform: uppercase;
}
.el-pagination {
  background: #cfdbd9;
}
.flowchart__link_yet {
  font-size: 10px;
  text-decoration: underline;
  cursor: pointer;
}
.scroll_table .none_scrolling {
  overflow: hidden;
  height: 100%;
  display: flex; /* exception */
  flex-direction: column; /* exception */
}
</style>
