<template>
  <div>
    <div style="padding-left: 5px;">
      <el-transfer
        v-model="value"
        style="display: inline-block; width: 97%"
        :data="list"
        @change="handleChange"
      >
        <template #default="{ option }">
          <span>{{ option.label }}</span>
        </template>
      </el-transfer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      list: [],
      value: []
    }
  },
  props: ['data', 'handleSelected'],
  mounted: function() {
    this.list = this.data
    this.value = this.selected
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      this.handleSelected(value)
    }
  },
  watch: {
    data: function(newValue, oldValue) {
      this.list = this.data
    }
  },
  computed: {
    ...mapState({
      selected: state => state.standtime.selected
    })
  }
}
</script>

<style>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.el-transfer-panel__header,
.el-checkbox__input {
  display: none;
}
.el-transfer__button {
  background-color: #013e2c;
  border: 1px solid #013e2c;
  padding: 0;
  margin: 0;
  min-height: 0px;
}
.el-button.is-disabled {
  background-color: #013e2c;
  border: 1px solid #013e2c;
}
button.el-button.el-button--primary.is-disabled.el-transfer__button {
  cursor: pointer !important;
}
.el-transfer-panel__item {
  padding: 0;
  height: auto;
  line-height: 20px;
}
.el-checkbox__label {
  padding: 0;
  white-space: normal;
}
.el-transfer-panel {
  border-radius: inherit;
  background-color: #cfdbd9;
  border: 1px solid #b8bdc0;
  width: 45%;
}
.el-transfer__buttons {
  position: relative;
  width: 5%;
  padding: 0;
}
.el-transfer__buttons .el-button {
  position: absolute;
  left: 0;
  right: 0;
}
.el-transfer__button:first-child {
  top: 0px;
  width: 21px; /*НВ: кнопка > */
  height: 20px; /*НВ: кнопка > */
}
.el-transfer__button:nth-child(2) {
  top: -26px;
  width: 21px; /*НВ: кнопка < */
  height: 20px; /*НВ: кнопка < */
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  background-color: #fff;
  color: #000;
  border: 1px solid #000 !important; /*НВ:обводка акт.яч в табл.*/
}
.el-transfer-panel__item:hover {
  color: #000;
}
.el-transfer-panel__item.el-checkbox .el-checkbox__label {
  border-bottom: 1px solid #fff;
  white-space: normal;
  line-height: 16px;
  color: #000;
  font-size: 10px;
  padding-left: 3px;
}
.el-checkbox {
  margin: 0;
}
.el-transfer-panel__empty {
  display: none;
}
.el-transfer__buttons > button {
  display: block;
  margin: 0 auto 10px auto !important;
}
.uaz__content {
  padding: 0 !important;
}

/*НВ: bold text for 2 tables */
.el-transfer-panel__list label {
  font-weight: 600;
}
/*НВ: скролл для 2 таблиц */
.el-transfer-panel__list {
  overflow-y: auto;
  height: 100%;
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.el-transfer-panel__list::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.el-transfer-panel__list::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.el-transfer-panel__list::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}
</style>
