<template>
  <el-select
    v-model="value"
    :options="options"
    :placeholder="placeholder"
    :style="`width: ${width}; vertical-align: middle`"
    clearable
    filterable
    :disabled="disabled"
    @change="onChange"
    :no-data-text="$t('noData')"
    @focus="onFocus"
    @blur="onBlur"
    @clear="onClear"
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
      focus: false
    }
  },
  props: [
    'data',
    'width',
    'handleChange',
    'handleClearModification',
    'selectedValue',
    'disabled'
  ],
  methods: {
    onChange: function(value) {
      this.handleChange(value)
    },
    onFocus: function() {
      this.focus = true
    },
    onBlur: function() {
      this.focus = false
    },
    onClear: function() {
      this.handleClearModification()
    }
  },
  mounted() {
    this.options = this.data
    this.value = this.selectedValue
  },
  watch: {
    data: function() {
      this.value = this.selectedValue ? this.selectedValue : ''
      this.options = this.data
    }
  },
  computed: {
    placeholder: function() {
      let label = this.$t('notSelected')
      if (this.focus) {
        label = this.$t('codeName')
      }
      return label
    }
  },
  updated() {}
}
</script>
<style scoped>
.el-select-v2__wrapper {
  padding: 0;
  border-radius: inherit;
  height: 20px;
  font-size: 10px;
  color: #013e2c;
}
.el-select-v2__placeholder.is-transparent,
.el-select-v2__caret {
  color: #013e2c;
}
.el-popper {
  border-radius: inherit;
}
.el-select-dropdown__option-item {
  height: 20px !important;
}

/*  v1 */
.el-select-dropdown__item {
  height: 20px;
  line-height: 20px;
}
.el-scrollbar__wrap {
  overflow: unset;
}
.el-scrollbar {
  overflow-y: scroll;
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
.el-input__inner::placeholder,
.el-select .el-input .el-select__caret {
  color: #013e2c;
}
</style>
