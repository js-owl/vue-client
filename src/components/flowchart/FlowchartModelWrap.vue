<template>
  <FlowchartModelTitle />
  <el-row :gutter="20" v-for="(item, index) in data" :key="index">
    <el-col :span="12" class="uaz__border-left">
      <img
        class="uaz__flowchart-img"
        :src="`/storage/${item.operation_image}`"
      />
      <p class="uaz__margin--none">{{ $t('imgCut') }} {{ index + 1 }}</p>
    </el-col>
    <el-col :span="12" class="uaz__operation-item uaz__border-rigth">
      <div>
        <div
          v-for="(item2, index2) in item.children"
          :key="item2.flowChartItem_id"
        >
          <span class="padding-left">
            {{ currentIndex(index, index2) }}.
            {{
              this.$i18n.locale == 'ru'
                ? item2.flowChartItem_name
                : item2.flowChartItem_name_en
            }}
          </span>
          <p v-for="tool in item2.tools" :key="tool.tool_name">
            <strong class="padding-left">{{ tool.tool_name }}</strong>
          </p>
          <p v-if="item2.operation_torque">
            <strong class="padding-left">
              {{ $t('moment') }}- {{ item2.operation_torque }} Н·м
            </strong>
          </p>
          <div class="uaz__flowchart-section"></div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import FlowchartModel from '@/components/flowchart/FlowchartModel.vue'
import FlowchartModelTitle from '@/components/flowchart/FlowchartModelTitle.vue'

export default {
  data() {
    return {}
  },
  components: {
    FlowchartModel,
    FlowchartModelTitle
  },
  props: ['data'],
  methods: {
    currentIndex: function(imagesIndex, recordIndex) {
      let index = 1
      let len = 0
      for (let i = 0; i < imagesIndex; i = i + 1) {
        len = len + this.data[i].children.length
        index = index + len
      }
      return index + recordIndex
    }
  },
  computed: {},
  mounted() {}
}
</script>
<style scoped>
.padding-left {
  padding-left: 10px;
}
.el-row {
  margin-right: 10px !important;
  border: 2px solid #b8bdc0;
  margin-bottom: 0px;
  margin-left: 0px !important;
  padding-bottom: 0px !important;
  border-top: none;
}
.el-col {
  padding: 0 !important;
}
.uaz__border-rigth {
  border-left: 2px solid #b8bdc0;
  padding-left: 0px;
  padding-right: 0px;
}
.uaz__border-left {
  padding: 0px !important;
}
.uaz__flowchart-section {
  border-top: 1px solid #cfdbd9;
  margin: 25px 0;
  position: relative;
  width: 100%;
  left: 0px;
}
</style>
