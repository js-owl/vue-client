<template>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="modelValue.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span
        class="toggle-background"
        :class="backgroundStyles"
      />
      <span
        class="toggle-indicator"
        :style="indicatorStyles" 
      />
    </span>
</template>
<script>
export default {
  props: {
    modelValue:{
      type: Boolean,
      required: true
    }
  },
  computed: {
    backgroundStyles() {
      return {
        'gold-mid': this.modelValue,
        'gray-lighter': !this.modelValue
      };
    },
    indicatorStyles() {
      return { transform: this.modelValue ? 'translateX(14px)' : 'translateX(0)' };
    }
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};
</script>
<style scoped>
.gold-mid{
  background-color: #013e2c;
}

.gray-lighter{
  background-color: #c2c2c2;
}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 18px;
  margin-right: 15px;
  position: relative;
  top:5px;
  border-radius: 9999px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color .4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 9999px;
  box-shadow:  0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform .4s ease;
}
</style>