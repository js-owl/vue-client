<template>
  <div class="diagnostic-algorithm__info" 
  v-if="panelDiagnostic.testing.currentComponent != 'Result'
  && panelDiagnostic.testing.currentComponent != 'List'
  && panelDiagnostic.testing.currentComponent != 'Report'">
    <PopoverDesc :data="data.descriptionPrinciple" />
    <PopoverTools :data="data && data.tools ? data.tools : []" />
    <PopoverEl :data="data && data.links ? data.links.el : []" />
    <PopoverFl :data="data && data.links ? data.links.fl : []" />
    <div
      class="diagnostic-algorithm__info-item diagnostic-algorithm__info-item--finish"
    >
      <div
        @click="handleReset()"
        class="diagnostic-algorithm__info-title"
      >
        <i class="fas fa-times"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import PopoverEl from "@/components/diagnostic/InstrumentPanel/PopoverEl.vue";
import PopoverFl from "@/components/diagnostic/InstrumentPanel/PopoverFl.vue";
import PopoverTools from "@/components/diagnostic/InstrumentPanel/PopoverTools.vue";
import PopoverDesc from "@/components/diagnostic/InstrumentPanel/PopoverDesc.vue";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
export default {
  data() {
  },
  components: {
    PopoverEl,
    PopoverFl,
    PopoverTools,
    PopoverDesc
  },
  props: ["data", "openAlert"],
  computed: {
    ...mapGetters({
      panelDiagnostic: "diagnostic/getDiagnosticData",
   }),
  },
  methods: {
    handleReset: function () {
      this.openAlert();
      console.log("handleReset");
    },
  },
  mounted() {
    console.log('Popover ', this.data);
  },
  updated: function () {
    console.log("InstrumentPanel updated", this.data);
  },  
};
</script>

<style scoped>
.diagnostic-algorithm__info {
  position: absolute;
  right: 16px;
  top: 20px;
}
.diagnostic-algorithm__info-item {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
}
.diagnostic-structure__right-side .uaz__panel-content {
  text-transform: none;
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
}
.diagnostic-algorithm__info-content > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.el-popover.el-popper {
  word-break: break-word;
}
</style>