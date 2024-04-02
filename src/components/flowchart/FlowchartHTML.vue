<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <div class="uaz__text-danger" v-html="data.flowChartItem_name" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  props: ["data"],
  methods: {},
  computed: {},
  mounted() {},
};
</script>
<style>
.uaz__flowchart-title {
  font-size: 16px;
}
.uaz__text-danger {
  color: #a94442;
}
</style>