<template>
  <el-table
    :cell-class-name="uazbodycell"
    :header-cell-class-name="uazheadercell"
    :row-class-name="uazbodyrow"
    :header-row-class-name="uazheaderrow"
    :data="list"
    style="width: 100%"
    @row-click="handleClick"
  >
    <el-table-column prop="comment" :label="$t('code')" :formatter="formatter">
      <template #header>
        <div
          class="diagnostic-structure__title--toggle"
          :class="{ active }"
          @click="headerClick()"
        >
          {{ $t('modifications').toUpperCase() }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="comment" label="">
      <template #default="scope">
        <div v-if="scope.$index < 3">
          {{
            this.$i18n.locale == 'ru' ? scope.row.comment : scope.row.comment_en
          }}
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div
    @click="headerClick()"
    class="diagnostic-details__modifications-show-button"
  >
    {{ this.active ? this.$t('showAll') : this.$t('hide') }}
  </div>
</template>

<script>
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  data() {
    return {
      active: true,
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row'
    }
  },
  props: ['data', 'handleClick'],
  computed: {
    list: function() {
      let list = []
      if (this.active) {
        list = this.data.filter(function(item, index) {
          if (index < 3) {
            return true
          }
          return false
        })
      } else {
        list = this.data
      }
      return list
    }
  },
  methods: {
    formatter(row, column) {
      if (/\d+/.test(row.productModification_name)) {
        return modificationNameFormatter(row.productModification_name)
      }
      return row.productModification_name
    },
    headerClick() {
      this.active = !this.active
    }
  }
}
</script>
<style>
.uaz-header-cell {
  font-size: 10px;
  font-family: Arial;
  color: #fff;
  text-transform: uppercase;
  line-height: 15px !important;
  background-color: #013e2c !important;
  padding: 0 !important;
}
.uaz-header-row {
}
.uaz-body-row {
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
  font-family: 'Arial';
  line-height: 17px;
  padding: 0px 5px;
  font-weight: 600;
  font-size: 10px;
}
.el-table th.el-table__cell > .cell {
  color: #fff;
}
.diagnostic-structure__title--toggle {
  display: flex;
}
.diagnostic-structure__title--toggle:after {
  content: '';
  display: -ms-flexbox;
  display: flex;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0;
  border-color: #fff transparent transparent;
  -ms-flex-item-align: center;
  align-self: center;
  margin: -2px 0 0 4px;
  cursor: pointer;
}
.diagnostic-structure__title--toggle.active:after {
  border-width: 0 4px 4px;
  border-color: transparent transparent #fff;
}
.diagnostic-details__modifications-show-button {
  display: inline-block;
  cursor: pointer;
  padding: 5px;
  color: #013e2c;
  text-decoration: none;
  font-size: 10px;
  font-family: Arial;
}
</style>
