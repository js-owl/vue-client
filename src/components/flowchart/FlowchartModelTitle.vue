<template>
  <el-row :gutter="20" class="uaz__panel-header-light">
    <el-col :span="12">
      <div class="flowchart__model__title-label">
        {{ $t('image').toUpperCase() }}
      </div>
    </el-col>
    <el-col :span="12">
      <div class="flowchart__model__title-label">
        {{ $t('operationDescription').toUpperCase() }}
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
  props: [],
  methods: {},
  computed: {},
  mounted() {}
}
</script>
<style scoped>
.flowchart__model__title-label {
  padding: 3px 0px 3px 5px;
}
.uaz__panel-header-light {
  background-color: #cfdbd9;
  color: #000;
}
.uaz__panel-operation .uaz__panel-header-light {
  color: #013e2c !important;
}
.el-row {
  margin-left: 0px !important;
  margin-right: 10px !important;
  border: none !important;
}
.el-col {
  padding-left: 0px !important;
  color: #013e2c !important;
}
</style>
