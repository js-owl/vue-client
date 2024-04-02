<template>
  <button @click="handleClick" class="btn-default" :style="{ backgroundColor: color ? color : '#013e2c' }">{{ text }}</button>
</template>

<script>
export default {
  name: "Button",
  props: ["handleClick", "text", "color"],
  mounted() {
  }
};
</script>

<style scoped>
.btn-default {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  font-weight: 700;
  font-size: 10px;
  float: left;
}
</style>
