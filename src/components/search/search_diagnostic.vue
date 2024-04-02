<template>
  <div class="parts_table_wrapper scroll_table diagnostic_column_width">
    <Table :data="diagnosticData" :columns="columns" height="100%" />
    <div style="width:50%"></div>
  </div>
  <Pagination :paginate="paginate" :currentChange="handleCurrentChange" />
</template>
<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
import Pagination from '@/components/common/UI/Pagination.vue'
import { errorMixin } from '@/plugins/error.plugin'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic'
import Table from '@/components/common/UI/Table_diagnostic.vue'
import Search from './search.vue'
export default {
  props: {
    searchFilter: String
  },
  data() {
    return {
      searchValue: this.$route.query.query,
      section: '',
      diagnosticData: [],
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
          width: 150
        },
        { prop: 'comment', label: `this.$t('comment').toUpperCase()` },
        {
          prop: 'productModification_modelYear',
          label: this.$t('yearIssue').toUpperCase(),
          width: 100
        },
        {
          prop: 'defect_code',
          label: $t('codeNumber').toUpperCase(),
          width: 100
        },
        {
          prop: 'defect_description',
          label: this.$t('defectDescription').toUpperCase()
        }
      ],
      testrow: [{ t1: '1' }, { t1: '1' }, { t1: '1' }, { t1: '1' }]
    }
  },
  computed: {},
  mounted() {
    this.getDiagnostics()
  },
  components: {
    ModalContent,
    Pagination,
    Search,
    Table
  },
  methods: {
    ...mapMutations({
      toClearSession: `diagnostic/${types.SET_CLEAR}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`
    }),
    getDiagnostics: function() {
      let params = {
        filter: this.searchValue,
        section: 'diagnostic',
        page: this.paginate.currentPage
      }
      Request.get('/diagnostic/list', {
        params
      })
        .then(response => {
          let res = []
          let firstKey = Object.keys(response.data)[0]
          console.log(firstKey, 'fkey')
          let myData = response.data[firstKey]
          console.log(myData)
          const keys = Object.keys(myData)
          keys.forEach(key => {
            console.log(`${key} : ${myData[key]}`)
            res.push(myData[key].info)
          })
          this.diagnosticData = res
          this.paginate.total = response.data.total
          this.paginate.pageSize = response.data.per_page
          this.paginate.currentPage = response.data.page
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    handleCurrentChange(val) {},

    goToIllustration: function() {
      console.log('fired')
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
      this.getDiagnostics()
    }
  }
}
</script>
<style scoped>
.parts_table_wrapper {
  height: 100%;
  overflow-y: hidden;
  background: #cfdbd9;
  display: flex;
  flex-wrap: wrap;
  text-transform: uppercase;
}
</style>
