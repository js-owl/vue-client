<template>
  <!--uaz_parts_right_block_content_contianer -->
  <div class="collapse-tr">
    <el-table
      class="table_download"
      :cell-class-name="uazbodycell"
      :header-cell-class-name="uazheadercell"
      :row-class-name="uazbodyrow"
      :header-row-class-name="uazheaderrow"
      :data="list"
      style="width: 100%"
      @cell-dblclick="handleDBClick"
    >
      <el-table-column
        prop="flowChart_code"
        :label="$t('code').toUpperCase()"
        width="50"
      />
      <el-table-column
        prop="flowChart_name"
        :label="$t('title').toUpperCase()"
      />

      <el-table-column
        prop="modifications"
        :label="$t('applicability').toUpperCase()"
        width="150"
      >
        <template #default="scope">
          <div
            class="diagnostic-structure__title--toggle"
            :class="{ active: active[scope.$index] }"
            @click="collapseClick(scope.$index)"
            v-if="scope.row.modifications.length > 0"
          >
            <ul v-if="active[scope.$index]">
              <li
                v-for="item in scope.row.modifications"
                :key="item.productModification_id"
              >
                <span v-if="active[scope.$index]">{{
                  item.productModification_name
                }}</span>
              </li>
            </ul>
            <span v-else>{{
              scope.row.modifications[0].productModification_name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="flowChart_time"
        :label="$t('nch').toUpperCase()"
        width="100"
      />
    </el-table>
  </div>
  <div @click="appedData()" class="flowchart__link_yet" v-show="nextPageUrl">
    {{ $t('loadNext') }}
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
export default {
  data() {
    return {
      data: [],
      nextPageUrl: '/flowchart',
      active: {},
      year: 2020,
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row'
    }
  },
  props: ['productModelId', 'productModificationId'],
  computed: {
    list: function() {
      let list = this.data
      return list
    }
  },
  methods: {
    collapseClick(index) {
      this.active[index] = !this.active[index]
    },
    async appedData() {
      await this.load()
    },
    handleDBClick(elem) {
      this.$router.push(
        `/flowcharts/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/flowchart-${elem.flowChart_id}`
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
    },
    load() {
      if (this.nextPageUrl) {
        Request.get(this.nextPageUrl, {
          params: {
            time: new Date().getTime(),
            productModelId: this.productModelId,
            productModificationId: this.productModificationId
          }
        })
          .then(response => {
            if (this.nextPageUrl) {
              this.data.push(...response.data.data)
            } else {
              this.data = response.data.data
            }

            this.nextPageUrl = response.data.next_page_url
          })
          .catch(function(error) {
            console.log('error', error.response.data.message)
          })
      }
    }
  },
  async mounted() {
    await this.load()
  },
  updated() {
    console.log('updated')
  }
}
</script>
<style>
.uaz-header-cell {
  font-size: 10px;
  font-family: Arial;
  color: #fff;
  text-transform: uppercase;
  line-height: 17px !important;
  background-color: #013e2c !important;
  padding: 0 !important;
}
.uaz-header-row {
}
.uaz-body-row {
  /*  background-color: #cfdbd9 !important;*/
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
  --el-table-row-hover-background-color: inherit;
}
.el-table tr {
  background-color: inherit;
  cursor: pointer;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  border-collapse: collapse;
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
.diagnostic-structure__title--toggle {
  display: flex;
}
.collapse-tr .diagnostic-structure__title--toggle:after {
  content: '';
  display: -ms-flexbox;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0;
  border-color: #000 transparent transparent;
  -ms-flex-item-align: center;
  align-self: start;
  margin: 6px 0 0 4px;
  cursor: pointer;
}
.diagnostic-structure__title--toggle > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.collapse-tr .diagnostic-structure__title--toggle.active:after {
  border-width: 0 4px 4px;
  border-color: transparent transparent #000;
}
.collapse-tr .el-table .el-table__cell {
  vertical-align: top;
}
.flowchart__link_yet {
  font-size: 10px;
  text-decoration: underline;
  cursor: pointer;
}
.table_download {
  height: 100%;
}
.collapse-tr {
  height: 95%;
}
</style>
