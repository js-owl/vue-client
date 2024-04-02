<template>
  <el-col :span="6">
    <div class="uaz__flowchart-tools-left">
      <img class="uaz__flowchart-img" :src="`/storage/${data.tool_image}`" />
    </div>
  </el-col>
  <el-col :span="6">
    <span class="uaz__flowchart-tools-text">
      {{ this.$i18n.locale == 'ru' ? data.tool_name : data.tool_name_en }}
    </span>
    <div>
      <span class="uaz__flowchart-tools-text"></span>
    </div>
  </el-col>
</template>

<script>
export default {
  props: ['data']
}
</script>
<style>
.uaz__flowchart-tools-left {
  padding: 5px;
  border: 2px solid #b8bdc0;
}
.uaz__flowchart-img {
  width: 100%;
  height: auto;
}
.uaz__flowchart-title {
  font-size: 16px;
}
</style>
