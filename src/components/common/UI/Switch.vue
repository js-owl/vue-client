<template>
  <el-switch
    v-model="value"
    active-color="#013e2c"
    @change="handleChange(laborTimeId)"
  />
</template>

<script >
export default {
  props: ["laborTimeId", "onSwitch", "selectedValue"],
  data() {
    return {
      value: this.selectedValue === undefined ? true : this.selectedValue,
    };
  },
  methods: {
    handleChange: function (laborTimeId) {
      this.onSwitch(laborTimeId, this.value);
    },
  },
  mounted() {
  },
  watch: {
    selectedValue: function (newValue, oldValue) {
      this.value = newValue;
    },
  }
};
</script>