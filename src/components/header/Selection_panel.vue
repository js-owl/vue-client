<template>
  <div
    v-if="section !== 'diagnostic'"
    :class="['select_bar_wrapper', { emaps_select: section == 'emaps' }]"
  >
    <div class="uaz__clearfix select_wrapper">
      <div class="col_select_title">
        <div class="select_title">{{ $t('model') }}</div>
        <!-- + {{$route.matched}}-->
        <el-select
          v-model="selectedModel"
          @change="selectModel"
          popper-class="standtime_submenu_select_option_header"
          :placeholder="$t('model')"
          filterable
          :no-data-text="$t('noData')"
        >
          <el-option
            v-for="item in models"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="select_header select_header_1">
        <div class="select_title">{{ $t('year') }}</div>
        <el-select
          v-model="selectedYear"
          popper-class="standtime_submenu_select_option_header select_option_header"
          placeholder="-"
          filterable
          :no-data-text="$t('noData')"
        >
          <el-option
            v-for="(item, index) in years"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
      </div>
      <div
        class="select_header select_header_2"
        v-if="
          ($route.params.productModificationId ||
            $route.query.productModification_id) &&
            !$route.params.flowchartId &&
            !$route.params.illustrationId
        "
      >
        <div class="select_title">{{ $t('group') }}</div>
        <el-select
          v-model="selectedGroup"
          popper-class="standtime_submenu_select_option_header select_option_header"
          placeholder="-"
          filterable
          :no-data-text="$t('noData')"
        >
          <el-option
            v-for="(item, key, index1) in groups"
            :key="index1"
            :label="item.partGroup_group"
            :value="item.partGroup_group"
            @click="selectIllustrationDetail(row.partGroup_id)"
          />
        </el-select>
      </div>
      <div
        class="select_header select_header_3"
        v-if="
          ($route.params.productModificationId ||
            $route.query.productModification_id) &&
            !$route.params.flowchartId &&
            !$route.params.illustrationId
        "
      >
        <div class="select_title">{{ $t('subgroup') }}</div>
        <el-select
          v-model="selectedSubgroup"
          popper-class="standtime_submenu_select_option_header select_option_header"
          placeholder="-"
          filterable
          :no-data-text="$t('noData')"
        >
          <el-option
            v-for="(item, key, index2) in subgroups"
            :key="index2"
            :label="item.partGroup_subgroup"
            :value="item.partGroup_subgroup"
            @click="selectIllustrationDetail(row.partGroup_id)"
          />
        </el-select>
      </div>
      <div
        class="select_header select_header_4"
        v-if="
          section != 'emaps' &&
            ($route.params.productModificationId ||
              $route.query.productModification_id) &&
            !$route.params.flowchartId
        "
      >
        <div class="select_title">{{ $t('illustrations') }}</div>
        <el-select
          v-model="selectedIllustration"
          popper-class="standtime_submenu_select_option_header select_option_header"
          placeholder="-"
          filterable
          :no-data-text="$t('noData')"
        >
          <el-option
            v-for="(item, key, index) in illustrations"
            :key="index"
            :label="
              item.partGroup_group +
                '-' +
                item.partGroup_subgroup +
                '-' +
                formatTointeger(item.partGroup_imageGroup) +
                '-' +
                item.partGroup_imageID
            "
            :value="
              item.partGroup_group +
                '-' +
                item.partGroup_subgroup +
                '-' +
                formatTointeger(item.partGroup_imageGroup) +
                '-' +
                item.partGroup_imageID
            "
            @click="selectIllustrationDetail(row.partGroup_id)"
          />
        </el-select>
      </div>
      <!--
      
        <div class="select_title">{{ $t('year') }}</div>
        <SelectFilterable
          popper-class="standtime_submenu_select_option_header"
          placeholder="-"
          :data="modifications"
          :width="'30%'"
          :selectedValue="productModificationId"
          :handleChange="(id) => handleSelect('productModificationId', id)"
          :handleClearModification="handleClearModification"
          :no-data-text="'2021'"
        />
      
    </div>

   --></div>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { Request } from '@/services/axios.service'
export default {
  data() {
    return {
      models: [],
      years: [],
      selectedModel: '',
      groups: [],
      subgroups: [],
      illustrations: []
    }
  },
  props: ['onDblclick'],
  computed: {
    ...mapGetters({
      selectedYear: 'filters/getSelectedYear'
    }),
    ...mapGetters({
      selectedGroup: 'filters/getSelectedGroup'
    }),
    ...mapGetters({
      selectedSubgroup: 'filters/getSelectedSubgroup'
    }),
    ...mapGetters({
      selectedIllustration: 'filters/getSelectedImageID'
    }),
    ...mapState('section', ['section'])
  },
  mounted: function() {
    this.getModels()
    if (this.$route.params.productModificationId) {
      this.getGroups()
      this.getSubgroups()
      this.getIllustration()
    }
  },
  methods: {
    getModels: function() {
      Request.get('/productmodel', {
        params: {
          section: 'parts'
        }
      })
        .then(response => {
          let data = response.data.data
          let filteredData = []
          data.forEach((el, index) => {
            for (const [key, value] of Object.entries(el.models)) {
              filteredData.push({
                label:
                  this.$i18n.locale == 'ru'
                    ? value.productModel_name
                    : value.productModel_name_en,
                value: value.productModel_id,
                years: value.years
              })
            }
          })
          this.models = filteredData
        })
        .catch(function(error) {
          console.log(error)
          //   errorMixin.methods.showError('warn',error.response.data.message);
        })

      //Object.entries(localStorage).forEach(([ key, value ]) => {
      //  console.log(`${value}`,'9999999999');
      //})
    },
    getYears: function() {
      this.models.forEach((el, index) => {
        if (el.value == this.selectedModel) {
          this.years = el.years
        }
      })
    },
    selectModel: function() {},
    getGroups: function() {
      if (this.$route.params.productModificationId) {
        Request.get(
          'partgroup/index/?productModification_id=' +
            this.$route.params.productModificationId,
          {}
        )
          .then(response => {
            this.groups = response.data.data
          })
          .catch(function(error) {})
      }
    },
    getSubgroups: function() {
      if (this.$route.params.productModificationId) {
        Request.get(
          'partgroup/index/?productModification_id=' +
            this.$route.params.productModificationId,
          {}
        )
          .then(response => {
            this.subgroups = response.data.data
          })
          .catch(function(error) {})
      }
    },
    getIllustration: function() {
      Request.get(
        'partgroup/illustration/?productModification_id=' +
          this.$route.params.productModificationId,
        {}
      )
        .then(response => {
          this.illustrations = response.data.data
        })
        .catch(function(error) {})
    },
    formatTointeger: function(val) {
      return parseInt(val)
    },
    selectIllustrationDetail: function(id) {
      this.onDblclick(id)
    }
  },
  watch: {
    selectedModel: function(newVal, oldVal) {
      this.getYears()
    },
    '$route.params.productModificationId': function(newVal, oldVal) {
      this.getGroups()
      this.getSubgroups()
    },
    '$route.params.productModelId': function(newVal, oldVal) {
      if (newVal) {
        this.selectedModel = parseInt(newVal)
        this.getYears()
        this.getIllustration()
      }
    },
    '$i18n.locale': function(newVal, oldVal) {
      this.getModels()
    }
  }
}
</script>
<style scoped>
/*Parts near to Search: 2 select*/
.select_title {
  font-size: 10px;
  font-weight: 600;
}
.col_select_title {
  margin-right: 10px;
}
.select_bar_wrapper {
  display: flex;
}
.select_wrapper {
  display: flex;
  margin-top: 7px;
  position: relative;
}
.select_wrapper .el-select {
  padding-left: 0;
}
.uaz__subheader_standtime .select_wrapper {
  display: none;
}
.select_header .el-select {
  /*	width: 60px!important;*/
  margin-right: 10px;
}
.select_group .el-select {
  width: 50px !important;
}
.uaz_parts_groups_table_right
  .uaz_parts_content_groups_table_cell:nth-last-child {
  height: 22px;
}
.uaz_parts_content_groups_table_left
  .uaz_parts_content_groups_table_cell:last-child {
  border-bottom: 0;
}
</style>
