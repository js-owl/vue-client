<template
  ><!--ТК: XTT236021--><!--10001--><!--ТК: Modifications-->
  <div class="flowcharts_wrapper column_width">
    <div class="parts_table_wrapper scroll_table">
      <Table
        class="table_column_top table_auto_body"
        :data="flowchartsData"
        :columns="columns"
        height="100%"
      />
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
import Table from '@/components/common/UI/Table_flowchart.vue'
import Search from './search.vue'
export default {
  props: {
    searchFilter: String
  },
  data() {
    return {
      searchValue: this.$route.query.query,
      section: '',
      flowchartsData: [],
      searchVinInfo: {},
      showModal: false,
      paginate: {
        pageSize: 2,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          prop: 'flowChart_code',
          label: this.$t('code').toUpperCase(),
          width: 50
        },
        {
          prop: 'flowChart_name',
          label: this.$t('flowchartName').toUpperCase()
        },
        { prop: 'modifications', label: this.$t('modifications'), width: 350 }
      ]
    }
  },
  computed: {},
  mounted() {
    this.getFlowcharts()
  },
  components: {
    ModalContent,
    Pagination,
    Search,
    Table
  },
  methods: {
    getFlowcharts: function() {
      let params = {
        filter: this.searchValue,
        getmods4part: 'true',
        groupbymodel: 'true',
        isPublish: '1',
        page: this.paginate.currentPage
      }
      Request.get('/flowchart/', {
        params
      })
        .then(response => {
          this.flowchartsData = response.data.data

          this.paginate.total = response.data.total
          this.paginate.pageSize = response.data.per_page
          this.paginate.currentPage = response.data.page
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    handleCurrentChange(val) {
      this.getFlowcharts()
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
  text-transform: uppercase;
}
.parts_table_wrapper {
  height: 100%;
  overflow-y: hidden;
  background: #cfdbd9;
  display: flex;
  flex-wrap: wrap;
}
.el-pagination {
  background: #cfdbd9;
}
</style>
