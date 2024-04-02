<template
  ><!-- Parts : XTT236021-->
  <div class="parts_table_wrapper parts_table_vin scroll_table">
    <Table :data="modificationData" :columns="columns" height="100%" />
  </div>
  <Pagination :paginate="paginate" :currentChange="handleCurrentChange" />
</template>
<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import Pagination from '@/components/common/UI/Pagination.vue'
import { errorMixin } from '@/plugins/error.plugin'
import { mapState } from 'vuex'
import Table from '@/components/common/UI/Table_popup.vue'
import Search from './search.vue'
export default {
  props: {
    searchFilter: String
  },
  data() {
    return {
      searchValue: this.$route.query.query,
      section: '',
      modificationData: [],
      searchVinInfo: {},
      showModal: false,
      paginate: {
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          prop: 'productModification_name',
          label: this.$t('modification'),
          havePopUp: 'true'
        },
        { prop: 'comment', label: this.$t('comment').toUpperCase() },
        { prop: 'revStart', label: this.$t('yearIssue').toUpperCase() },

        { prop: '', label: this.$t('partCode').toUpperCase() },
        { prop: '', label: this.$t('partName').toUpperCase() },
        { prop: '', label: this.$t('illustration').toUpperCase() }
      ]
    }
  },
  computed: {},
  mounted() {
    this.getModfications()
  },
  components: {
    ModalContent,
    Pagination,
    Search,
    Table
  },
  methods: {
    getModfications: function() {
      let params = {
        filter: this.searchValue,
        section: 'parts',
        page: this.paginate.currentPage
      }
      Request.get('/productmodification/searchvin', {
        params
      })
        .then(response => {
          if (Object.keys(response.data.items).length) {
            this.modificationData = response.data.items

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
      this.getModfications()
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
.parts_table_row__short_part {
  display: flex;
}
.parts_table_big_cell_collapse {
  display: block;
}
.collapse_row {
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
.parts_table_wrapper {
  height: 100%;
  overflow-y: hidden;
  background: #cfdbd9;
  text-transform: uppercase; /*Parts : table-XTT236021-comment(uppercase) */
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
.parts_table_big_cell {
  width: 55%;
}
.ul_background {
  height: 19px;
}
.parts_table_cell {
  padding: 1px 5px;
  width: 16%;
}
.ul {
  display: flex;
  position: fixed;
  width: 100%;
  left: 50%;
  padding: 0px 14px 0 11px;
  transform: translateX(-50%);
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
.li_year,
.li_illustration {
  width: 11% !important;
}
.li_checkbox {
  width: 30%;
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
</style>
