<template>
  <el-select
    v-model="value"
    :options="options"
    :placeholder="placeholder"
    :style="`width: ${width}; vertical-align: middle`"
    :popper-class="customclass"
    :disabled="disabled"
    @change="onChange"
    :no-data-text="$t('noData')"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left; color: #000; font-size: 10px">{{
        item.label
      }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      options: ref([]),
      value: ref(''),
      customclass: 'custom-class'
    }
  },
  methods: {
    onChange: function(value) {
      this.handleChange(value)
    }
  },
  props: [
    'data',
    'width',
    'disabled',
    'placeholder',
    'handleChange',
    'selectedValue'
  ],
  mounted() {
    this.options = this.data
    this.value = this.selectedValue ? this.selectedValue : ''
  },
  watch: {
    data: function() {
      this.value = this.selectedValue ? this.selectedValue : ''
      this.options = this.data
    },
    selectedValue: function(newVal) {
      this.value = this.selectedValue ? this.selectedValue : ''
    }
  }
}
</script>
<style>
.el-select-dropdown__item {
  height: 20px;
  line-height: 20px;
  font-size: 10px;
}
.el-select,
.el-input__inner {
  padding-left: 10px;
  border-radius: inherit;
  height: 20px;
  font-size: 10px;
  color: #013e2c;
}

.el-select__caret,
.el-input__inner::placeholder {
  color: #013e2c;
}
.custom-class {
  overflow-y: hidden;
}
.custom-class .el-scrollbar {
  overflow-y: hidden;
}
.el-popper__arrow {
  display: none !important;
}
</style>
