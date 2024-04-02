<template>
  <div style="margin: 4px 0">
    <span
      @click="handleClick(answer)"
      class="btn-radio-like diagnostic-algorithm__option"
      :class="{ active: answer.linkText === value, disabled: isHistory }"
      >{{ answer.linkText }}</span
    >
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["answer", "value", "buttonClickHandler", "isHistory"],
  methods: {
    handleClick(answer) {
      if (!this.isHistory) {
        this.buttonClickHandler(answer);
      }
    },
  },
  mounted() {},
  updated: function () {},
  beforeUpdated: function () {},
};
</script>
<style>
.btn-radio-like {
  display: inline-block;
  padding: 4px 0 8px 28px;
  cursor: pointer;
}
.btn-radio-like {
  position: relative;
}
.btn-radio-like:after {
  top: 1px;
  left: 4px;
  width: 16px;
  height: 16px;
  background: #013e2c;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: 0.2s;
}
.btn-radio-like:before {
  border: 1px solid #cdd1da;
  background: #fff;
  top: -3px;
  left: 0;
  width: 22px;
  height: 22px;
}
.btn-radio-like:after,
.btn-radio-like:before {
  content: "";
  position: absolute;
  border-radius: 50%;
}
.btn-radio-like.active:after {
  opacity: 1;
}
.btn-radio-like.disabled {
  opacity: 0.5;
}
</style>