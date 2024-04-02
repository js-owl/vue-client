<template>
  <div
    class="diagnostic-algorithm__info-item"
    :class="data && data.length > 0 ? '' : 'non-active'"
  >
    <el-popover
      v-if="data && data.length > 0"
      placement="bottom"
      popper-class="uaz-diagnostic-panel-popover"
    >
      <template #reference>
        <div>
          <el-tooltip
            class="diagnostic-algorithm__info-title"
            :content="$t('equipmentAndTool')"
            placement="bottom"
            popper-class="uaz-diagnostic-panel-tooltip"
          >
            <i class="fas fa-wrench"></i>
          </el-tooltip>
        </div>
      </template>
      <div class="diagnostic-algorithm__info-content">
        <el-row v-for="item in data" :key="item.tool_id">
          <el-col :span="8" v-if="!`/storage/null`">
            <img
              class="tools__img list-img"
              :src="`/storage/${item.tool_image}`"
            />
          </el-col>
          <el-col :span="16">
            {{ item.tool_name }}
          </el-col>
        </el-row>
      </div>
    </el-popover>
    <el-tooltip
      v-else
      class="diagnostic-algorithm__info-title"
      :content="$t('equipmentAndTool')"
      placement="bottom"
      popper-class="uaz-diagnostic-panel-tooltip"
    >
      <i class="fas fa-wrench"></i>
    </el-tooltip>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  data() {
    return {
      // elem: ref(false),
    }
  },
  props: ['data'],
  methods: {},
  mounted() {},
  updated: function() {}
}
</script>

<style>
.diagnostic-algorithm__info-item {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
}
.diagnostic-algorithm__info-title {
  font-size: 20px;
  color: #013e2c;
  cursor: pointer;
}
.diagnostic-algorithm__info-item.non-active .diagnostic-algorithm__info-title {
  color: #a6b2b0;
  cursor: auto;
}
.uaz-diagnostic-panel-tooltip {
  border: 1px solid #013e2c;
  background-color: #cfdbd9 !important;
  color: #013e2c !important;
  border-radius: 5px !important;
}
.uaz-diagnostic-panel-popover {
  height: 100px !important;
  overflow: auto !important;
  width: 400px !important;
  background-color: #fff !important;
  padding: 4px !important;
  border-radius: 2px !important;
  box-shadow: 0 0 10px #7fa099 !important;
}
.diagnostic-structure__link {
  color: #013e2c;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  text-decoration: none;
}
.diagnostic-structure__link:hover {
  color: #7fa099;
}
.diagnostic-algorithm__info-content {
  font-size: 10px;
  font-family: Arial;
  align-items: center;
  font-weight: 600;
}
.diagnostic-algorithm__info-content > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tools__img {
  width: 40px;
}
</style>
