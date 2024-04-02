<template>
  <el-table
    class="emaps_table scroll_table table_auto_body table_highlight"
    :cell-class-name="uazbodycell"
    :header-cell-class-name="uazheadercell"
    :row-class-name="uazbodyrow"
    :header-row-class-name="uazheaderrow"
    :data="list"
    :empty-text="notFound"
    style="width: 100%"
    @cell-click="hundleCellClick"
    @cell-dblclick="handleDBClick"
    v-loading="loading"
    highlight-current-row
  >
    <el-table-column :prop="prop" :label="$t('title').toUpperCase()" />
    <el-table-column
      prop="modifications"
      :label="$t('applicability').toUpperCase()"
      width="200"
      ><!-- Emaps -->
      <template #default="scope">
        <div
          :class="{
            active: active[scope.$index],
            'emap-structure__title--toggle': scope.row.modifications.length > 1
          }"
          @click="collapseClick(scope.$index)"
          v-if="scope.row.modifications.length > 0"
        >
          <ul v-if="active[scope.$index]">
            <li
              v-for="item in scope.row.modifications"
              :key="item.productModification_id"
            >
              <span v-if="active[scope.$index]">
                {{
                  `${item.productModel_name} ${item.productModification_name}-${item.revStart}`
                }}
              </span>
            </li>
          </ul>
          <span v-else>{{
            `${scope.row.modifications[0].productModel_name} ${scope.row.modifications[0].productModification_name}-${scope.row.modifications[0].revStart}`
          }}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ref } from 'vue'
import { Request } from '@/services/axios.service'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/standtime'
export default {
  name: 'EmapCollapseTd',
  data() {
    return {
      list: [],
      active: {},
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row',
      notFound: this.$t('notFound'),
      loading: ref(true),
      name_en: ''
    }
  },
  props: [
    'year',
    'productModelId',
    'productModificationId',
    'elGroup_id',
    'handleCellClick'
  ],
  methods: {
    collapseClick(index) {
      this.active[index] = !this.active[index]
    },
    hundleCellClick(row, column, cell, event) {
      if (column.property === 'electricGroup_name') {
        this.handleCellClick(row)
      }
    },
    handleDBClick(elem) {
      console.log('handleDBClick', this.$store.state.emaps)
      this.$store.commit('emaps/SET_BREADCRUMBS', [])
      this.$router.push(
        `/emaps/illustration/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/illustration-${elem.electricGroup_id}`
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
      console.log('handleDBClick', this.$store.state.emaps)
    },
    load() {
      Request.get('/electricgroup', {
        params: {
          isDealer: 1,
          isPublish: 1,
          page: 1,
          limit: 10,
          productModel_id: this.productModelId,
          productModification_id: this.productModificationId,
          elGroup_id: this.elGroup_id,
          year: this.year,
          time: new Date().getTime()
        }
      })
        .then(response => {
          this.list = response.data.data
          this.name_en = this.list[0].electricGroup_name_en
          this.loading = false
        })
        .catch(function(error) {
          console.log('error', error.response.data.message)
        })
    }
  },
  computed: {
    ...mapMutations({
      setProp: `emaps/${types.SET_PROP}`
    }),
    prop() {
      return this.name_en
        ? this.$i18n.locale == 'ru'
          ? 'electricGroup_name'
          : 'electricGroup_name_en'
        : 'electricGroup_name'
    }
  },
  async mounted() {
    await this.load()
  },
  watch: {
    elGroup_id: function(newValue, oldValue) {
      this.load()
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>
<style scoped>
.emaps_table {
  display: flex;
  height: 100%;
  flex-direction: column;
  text-transform: uppercase;
}
.uaz-header-cell {
  font-size: 10px;
  font-family: Arial;
  color: #fff;
  text-transform: uppercase;
  line-height: 17px !important;
  background-color: #013e2c !important;
  padding: 0 !important;
}
.uaz-body-cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px !important;
  padding: 0 !important;
  font-weight: 600;
  font-size: 10px;
}
.el-table .cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px;
  padding: 0px 6px;
  font-weight: 600;
  font-size: 10px;
  text-align: left;
  word-break: break-word;
}
.el-table th.el-table__cell > .cell {
  color: #fff;
}
.el-table {
  background-color: #cfdbd9;
  height: 100%;
  --el-table-row-hover-background-color: inherit;
}
.el-table tr {
  background-color: inherit;
  cursor: pointer;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: auto;
  border-collapse: separate;
}
.el-table td.el-table__cell {
  border: var(--el-table-border);
}
.el-table th.el-table__cell.is-leaf {
  border: none;
}
.el-table td.el-table__cell div > p {
  margin: 0;
}
.el-table tr td:first-child {
  text-align: center;
}
.el-table__empty-text {
  font-size: 10px;
  font-family: Arial;
  color: #000;
}
.el-table__row:hover {
  background: inherit;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: inherit;
}
.emap-structure__title--toggle {
  display: flex;
}
.emap-structure__title--toggle:after {
  content: '';
  display: -ms-flexbox;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0;
  border-color: #000 transparent transparent !important;
  -ms-flex-item-align: center;
  align-self: start;
  margin: 6px 0 0 4px;
  cursor: pointer;
}
.emap-structure__title--toggle > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.emap-structure__title--toggle.active:after {
  border-width: 0 4px 4px;
  border-color: transparent transparent #000 !important;
}
.el-table .el-table__cell {
  vertical-align: top;
}
.flowchart__link_yet {
  font-size: 10px;
  text-decoration: underline;
  cursor: pointer;
}

.flowchart-detail .el-dialog__header {
  padding-bottom: 0px;
}
.el-table tbody tr:hover {
  background-color: #fff;
}

.el-table tbody tr:hover > td {
  border-top: 1px solid #013e2c;
  border-bottom: 1px solid #013e2c;
  border-left: none;
  border-right: none;
}
.el-table tbody tr:hover > td:first-child {
  border-left: 1px solid #013e2c;
}
.el-table tbody tr:hover > td:last-child {
  border-right: 1px solid #013e2c;
}
</style>
