<template>
  <div
    id="uaz__standtime"
    class="uaz__standtime uaz__container uaz__content uaz__total-height"
    style="height: 100%"
  >
    <div
      class="uaz__panel-content uaz__model-list time-stands__panel scroll_table_container"
    >
      <!--<div v-if="loading">Loading ...</div>!-->
      <div class="uaz__col-xs-12 uaz__product-model-group">
        <h4 class="uaz__margin--none uaz__margin_left">
          {{ $t('selectModel') }}
        </h4>
      </div>
      <div class="uaz__clearfix" style="padding: 14px 0; clear: both">
        <el-row>
          <el-col :span="8">
            <label class="time-stands__form-title">
              {{ $t('model').toUpperCase() }}
            </label>
            <Select
              popper-class="standtime_submenu_select_option"
              :disabled="
                vinThrough &&
                vinThrough.productModel_id &&
                vinThrough.showInLaborTime
                  ? true
                  : false
              "
              :data="this.$i18n.locale == 'ru' ? models : models_en"
              :width="'72%'"
              :placeholder="$t('notSelected')"
              :selectedValue="productModelId"
              :handleChange="id => handleSelect('productModelId', id)"
            />
          </el-col>
          <el-col :span="10">
            <label
              class="time-stands__form-title time-stands__form-title--special ng-binding"
            >
              {{ $t('modification') }}
            </label>
            <SelectFilterable
              popper-class="standtime_submenu_select_option two"
              :data="modifications"
              :disabled="
                vinThrough &&
                vinThrough.productModel_id &&
                vinThrough.showInLaborTime
                  ? true
                  : false
              "
              :width="'72%'"
              :selectedValue="productModificationId"
              :handleChange="id => handleSelect('productModificationId', id)"
              :handleClearModification="handleClearModification"
              :placeholder="$t('notSelected')"
            />
          </el-col>
        </el-row>
      </div>
      <div
        class="uaz__col-xs-12 uaz__product-model-group no-print"
        style="clear: both"
      >
        <h4 class="uaz__margin--none ng-binding uaz__margin_left">
          {{ $t('selectGroup') }}
        </h4>
      </div>
      <div
        class="no-print"
        style="padding: 14px 0; clear: both; overflow: hidden"
      >
        <el-row>
          <el-col :span="8">
            <label class="time-stands__form-title">{{ $t('group') }}</label>
            <Select
              popper-class="standtime_submenu_select_option2"
              :data="this.$i18n.locale == 'ru' ? groups : groups_en"
              :width="'72%'"
              :selectedValue="groupId"
              :disabled="disabledGroup"
              :placeholder="$t('notSelected')"
              :handleChange="id => handleSelect('groupId', id)"
            />
          </el-col>
          <el-col :span="10" style="margin-right:-1.6%;">
            <label
              class="time-stands__form-title time-stands__form-title--special ng-binding"
            >
              {{ $t('subgroup') }}
            </label>
            <Select
              popper-class="standtime_submenu_select_option2 two"
              :data="this.$i18n.locale == 'ru' ? subgroups : subgroups_en"
              :width="'72%'"
              :selectedValue="subgroupId"
              :disabled="disabledSubgroup"
              :placeholder="$t('notSelected')"
              :handleChange="id => handleSelect('subgroupId', id)"
            />
          </el-col>
          <el-col :span="6">
            <Button
              :text="$t('search').toUpperCase()"
              :handleClick="handleSearch"
            />
          </el-col>
        </el-row>
      </div>
      <div class="uaz__col-xs-12 uaz__product-model-group no-print">
        <h4 class="uaz__margin--none ng-binding uaz__margin_left">
          {{ $t('selectTime') }}
        </h4>
      </div>
      <div style="padding: 14px 0; clear: both; overflow: hidden">
        <el-row class="el_row_standtime">
          <el-col :span="17">
            <TableTranferUaz
              ref="tableTranferUazRef"
              @selectElements="handleSelected"
              :selectedItems="selected"
              :data="times"
            />
          </el-col>
          <el-col :span="7">
            <Button
              :text="$t('reset').toUpperCase()"
              :handleClick="handleClear"
              :color="'#138496'"
            />
            <div style="height: 24px"></div>
            <Button
              :text="$t('search').toUpperCase()"
              :handleClick="handleTimesSearch"
            />
          </el-col>
        </el-row>
      </div>
      <div
        v-if="this.data && this.data.length > 0"
        class="no-print"
        style="padding: 1px 0; clear: both; overflow: hidden"
      >
        <h3
          ng-show="vm.results.length"
          style="padding-left: 5px"
          class="no-print ng-binding"
        >
          {{ $t('searchResult') }}
        </h3>
        <TableSwitch :refreshSwitchers="tableKey" :year="year" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/UI/Button.vue'
import Select from '@/components/common/UI/Select.vue'
import Transfer from '@/components/standtime/Transfer.vue'
import TableSwitch from '@/components/standtime/TableSwitch.vue'
import TableTranferUaz from '@/components/standtime/TableTranferUaz.vue'
import SelectFilterable from '@/components/common/UI/SelectFilterable.vue'
import { Request } from '@/services/axios.service'
import { modificationNameFormatter } from '@/components/utils/helpers'
import { errorMixin } from '@/plugins/error.plugin'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/standtime'
const year = '2020'
export default {
  data() {
    return {
      year,
      tableKey: 0,
      loading: false,
      leftPartProps: {
        label: 'label'
      }
    }
  },
  components: {
    Select,
    Transfer,
    TableSwitch,
    TableTranferUaz,
    Button,
    SelectFilterable
  },
  props: [],
  methods: {
    handleClear() {
      if (this.vinThrough && this.vinThrough.productModel_id) {
        this.refresh()
        this.loadGroups()
        this.loadSubgroups()
        window.location.reload()
      } else {
        this.$refs.tableTranferUazRef.clear()
        this.toClear()
        this.loadModels()
      }
    },
    refresh: function() {
      this.toClear()
      if (this.vinThrough && this.vinThrough.showInLaborTime) {
        this.setProp({
          meta: 'productModelId',
          data: this.vinThrough.productModelLT_id
        })
        this.setProp({
          meta: 'productModificationId',
          data: this.vinThrough.productModification_id
        })
        this.loadModels()
        this.$store.commit('vinThrough/SET_REFRESH_STAND_TIME', false)
      }
    },
    handleClearModification() {
      this.setProp({ meta: 'productModificationId', data: '' })
    },
    handleResetTimes() {
      this.setProp({ meta: 'times', data: [] })
      this.setProp({ meta: 'selected', data: [] })
      this.setProp({ meta: 'selectedStandtimes', data: [] })
      this.setProp({ meta: 'data', data: [] })
    },
    handleTimesSearch() {
      if (this.timesList.length === 0 && !this.selected.length) {
        errorMixin.methods.showError('error', this.$t('selectTime'))
      } else {
        const data = this.selected
        this.setProp({ meta: 'data', data })
        this.tableKey++
      }
    },
    handleSearch: function() {
      if (!this.productModelId) {
        errorMixin.methods.showError('error', this.$t('selectModelOnly'))
      } else if (!this.productModificationId) {
        errorMixin.methods.showError('error', this.$t('selectModification'))
      } else if (!this.groupId) {
        errorMixin.methods.showError('error', this.$t('selectGroup'))
      } else if (!this.subgroupId) {
        errorMixin.methods.showError('error', this.$t('selectsubgroup'))
      } else {
        this.loadTimes()
      }
    },
    handleSelect: function(name, value) {
      this.setProp({ meta: name, data: value })
      this[name] = value
      if (name == 'productModelId') {
        this.handleClearModification()
      }
    },
    handleSelected(selectedItems, standtimesToChoose) {
      this.setProp({ meta: 'selected', data: selectedItems })
      if (standtimesToChoose) {
        this.setProp({ meta: 'times', data: standtimesToChoose })
      }
    },
    ...mapMutations({
      setProp: `standtime/${types.SET_PROP}`,
      toClear: `standtime/${types.SET_CLEAR}`
    }),
    ...mapActions({
      loadModifications: 'standtime/loadModifications',
      loadGroups: 'standtime/loadGroups',
      loadSubgroups: 'standtime/loadSubgroups',
      loadTimes: 'standtime/loadTimes',
      loadModels: 'standtime/loadModels',
      saveStandtime: 'standtime/saveStandtime'
    })
  },
  watch: {
    productModelId: async function(newValue, oldValue) {
      this.handleResetTimes()
      this.loading = true
      if (this.productModelId) {
        await this.loadModifications()
      } else {
        await this.loadModifications('clear')
      }
      this.loading = false
    },
    productModificationId: async function(newValue, oldValue) {
      this.handleResetTimes()
      this.setProp({ meta: 'groups', data: [] })
      this.setProp({ meta: 'groupId', data: '' })
      this.setProp({ meta: 'subgroups', data: [] })
      this.setProp({ meta: 'subgroupId', data: '' })
      if (this.productModificationId) {
        await this.loadGroups()
      }
    },
    groupId: async function(newValue, oldValue) {
      this.setProp({ meta: 'subgroups', data: [] })
      this.setProp({ meta: 'subgroupId', data: '' })
      if (this.groupId) {
        await this.loadSubgroups()
      }
    },
    needToRefresh: async function(newValue, oldValue) {
      if (newValue) {
        this.refresh()
      }
    }
  },
  computed: {
    disabledGroup: function(newValue, oldValue) {
      if (this.productModelId > 0 && this.productModificationId > 0) {
        return false
      }
      return true
    },
    disabledSubgroup: function(newValue, oldValue) {
      if (
        !!this.productModelId &&
        !!this.productModificationId &&
        !!this.groupId
      ) {
        return false
      }
      return true
    },
    ...mapGetters({
      modifications: 'standtime/getModifications',
      groups: 'standtime/getGroups',
      groups_en: 'standtime/getGroupsEn',
      subgroups: 'standtime/getSubGroups',
      subgroups_en: 'standtime/getSubGroupsEn',
      times: 'standtime/getTimes',
      models: 'standtime/getModels',
      models_en: 'standtime/getModelsEn'
    }),
    ...mapState({
      productModelId: state => state.standtime.productModelId,
      productModificationId: state => state.standtime.productModificationId,
      productModification: state => state.modification,
      groupId: state => state.standtime.groupId,
      subgroupId: state => state.standtime.subgroupId,
      timesList: state => state.standtime.times,
      selected: state => state.standtime.selected,
      selectedStandtimes: state => state.standtime.selectedStandtimes,
      data: state => state.standtime.data,
      needToRefresh: state => state.vinThrough.needToRefreshStandTime,
      vinThrough: state => state.vinThrough.THROUGH_VIN
    })
  },
  async mounted() {
    if (this.productModification.showInLaborTime && this.vinThrough) {
      this.$store.commit('vinThrough/SET_REFRESH_STAND_TIME', false)
      this.setProp({
        meta: 'productModelId',
        data: this.vinThrough.productModelLT_id
      })
      this.setProp({
        meta: 'productModificationId',
        data: this.vinThrough.productModification_id
      })
    }
    await this.loadModels()
    await this.loadModifications()
  }
}
</script>
<style>
.uaz__standtime {
}
.uaz__container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  font-size: 10px;
}
.uaz__content {
  padding: 0 5px;
}

.uaz__panel-content,
.uaz__panel-header {
  height: calc(100% - 21px);
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
}

.uaz__model-list,
.uaz__scroll-left-right {
  background-color: #cfdbd9;
}

.time-stands__panel {
  overflow-y: auto;
  height: 100%; /*НМ */
}
@media (max-height: 500px) {
  body {
    overflow-y: auto;
    height: 100%; /*НМ */
  }
}
@media (max-height: 500px) {
  .el-select-dropdown__wrap {
    max-height: 86px;
  }
}

.uaz__panel-content {
  text-transform: uppercase;
}

.uaz__product-model-group {
  border-bottom: 1px solid #fff;
  background-color: #7fa099;
  height: 17px;
  color: #fff;
  line-height: 16px;
}
.uaz,
.uaz__auth-elis,
h4 {
  font-weight: 600;
}
.uaz__margin--none,
.uaz__margin-none {
  /*margin-left: 5px !important;*/
  margin-top: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
}
.uaz__margin_left {
  margin-left: 5px !important;
}

.time-stands__form-title {
  float: left;
  width: 20%;
  line-height: 20px;
  margin-left: 5px;
  font-weight: 600;
}
.el-row {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  width: 1325px !important;
}
.el-transfer-panel__body {
  height: 190px;
}
.el-input__inner {
  padding-left: 6px;
}
.el-col-8 {
  flex: 0 0 17.333333%;
}
.el-col-10 {
  flex: 0 0 35.666667%;
}
.uaz__product-model-group_button {
}
.standtime_submenu_select_option,
.standtime_submenu_select_option2 {
  min-width: 152px !important;
}
.standtime_submenu_select_option.two,
.standtime_submenu_select_option2.two {
  min-width: 328px !important;
}
.el-select-dropdown__item {
  padding: 0 0px 0 10px;
}
.tree_wrapper {
  width: 900px;
  display: flex;
}

/*2 blocks*/
.el_row_standtime {
  align-items: flex-end;
  width: 100% !important;
}
.el_row_standtime .el-col-8 {
  flex: 0 0 33.3333333333% !important;
}
</style>
