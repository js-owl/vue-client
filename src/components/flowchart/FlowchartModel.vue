<template>
  <el-row :gutter="20">
    <el-col :span="12" class="uaz__border-left">
      <img
        class="uaz__flowchart-img"
        src="http://dev.elis.uaz.ru/img/operation/operation_6309.jpg"
      />
      <p class="uaz__margin--none">{{ $t('imgCut')() }} 1</p>
    </el-col>
    <el-col :span="12" class="uaz__operation-item uaz__border-rigth">
      <div>
        <p v-for="item in data.children" :key="item.flowChartItem_id">
          1. {{ data.flowChartItem_name }}
          <strong>S=19</strong>
        </p>
        <p>
          <strong>{{ $t('moment') }} - 5 H·m</strong>
        </p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {},
  props: ['data'],
  methods: {},
  computed: {},
  mounted() {}
}
</script>
<style scoped>
.el-row {
  margin-right: 10px !important;
  border: 3px solid #b8bdc0;
  margin-bottom: 0px;
  margin-left: 0px !important;
  padding-bottom: 0px !important;
  border-top: none;
}
.uaz__border-rigth {
  border-left: 3px solid #b8bdc0;
  padding-left: 0px;
  padding-right: 0px;
}
.uaz__border-left {
  padding: 0px !important;
}
</style>
