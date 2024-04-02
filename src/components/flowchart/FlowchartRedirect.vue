<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <div>
        <div>
          <div class="uaz__instruction">
            <div class="uaz__row">
              <div>
                {{ $t('referInstructions') }} -
                {{
                  this.$i18n.locale == 'ru'
                    ? data.flowChartItem_name_en
                    : data.flowChartItem_name_en
                }}
                <span> ({{ data.flowChart_code_ref }})</span>
              </div>
            </div>

            <div class="uaz__row uaz__instruction-btn">
              <div>
                <button
                  class="uaz__btn uaz__btn-sm uaz__flowchart-inline-btn"
                  @click="handleClick"
                  :class="{ 'uaz__flowchart__btn__inline-active': showInside }"
                >
                  <span v-if="showInside">{{ $t('collapse') }} ×</span>
                  <span v-else>{{ $t('expand') }}</span>
                </button>
                <a
                  class="uaz__btn uaz__btn-sm uaz__flowchart-inline-btn uaz__flowchart-inline-btn1"
                  :href="
                    `/flowcharts/detail/model-${productModelId}/modification-${productModificationId}/year-${year}/flowchart-${data.flowChart_ref}`
                  "
                  target="_self"
                  :class="{
                    'uaz__flowchart-inline__btn1-inactive': showInside
                  }"
                >
                  {{ $t('flowchartOpenHere') }}
                </a>

                <a
                  class="uaz__btn uaz__btn-sm uaz__flowchart-inline-btn uaz__flowchart-inline-btn2"
                  :href="
                    `/flowcharts/detail/model-${productModelId}/modification-${productModificationId}/year-${year}/flowchart-${data.flowChart_ref}`
                  "
                  target="_blank"
                  :class="{
                    'uaz__flowchart-inline__btn2-inactive': showInside
                  }"
                >
                  {{ $t('flowchartOpenNew') }}
                </a>
              </div>
              <div>
                <flowchart-detail
                  :view="'inside'"
                  :key="data.flowChart_ref"
                  v-if="showInside"
                  :flowchartId="data.flowChart_ref"
                  :productModelId="productModelId"
                  :productModificationId="productModificationId"
                  :year="year"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      showInside: false
    }
  },
  components: {},
  props: ['data', 'year', 'productModelId', 'productModificationId'],
  methods: {
    handleClick() {
      this.showInside = !this.showInside
    }
  },
  computed: {},
  mounted() {},
  updated: function() {}
}
</script>
<style scoped>
.uaz__instruction-btn {
  padding-top: 10px;
}
.uaz__btn-sm {
  padding: 5px;
  background-color: #cfdbd9;
  color: #013e2c;
}
.uaz__btn {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  text-decoration: none;
  font-weight: 600;
}
.uaz__flowchart-inline-btn {
  float: left;
  position: relative;
  margin-right: 15px;
}
.uaz__flowchart-inline__btn1-inactive {
  margin-left: 85px;
}
.uaz__flowchart-inline__btn2-inactive {
}
.el-row {
  margin-bottom: 20px;
}
.uaz__flowchart__btn__inline-active {
  border: 2px solid #013e2c;
  border-bottom: none;
  border-radius: 0;
  margin-bottom: 0px;
  position: absolute;
  background-color: white;
}
</style>
