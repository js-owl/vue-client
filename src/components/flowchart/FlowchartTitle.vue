<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p class="uaz__flowchart-title">
        {{
          this.$i18n.locale == 'ru'
            ? data.flowChartItem_name
            : data.flowChartItem_name_en
        }}
      </p>
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
<style>
.uaz__flowchart-title {
  font-size: 16px;
}
</style>
