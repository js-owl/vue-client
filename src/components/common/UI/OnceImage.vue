<template>
  <div class="demo-image__preview">
    <el-image
      :src="url"
      :preview-src-list="srcList"
      :initial-index="0"
      lazy
      hide-on-click-modal
    >
    </el-image>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  data() {
    return {
      url: ref(this.src),
      srcList: ref([this.src])
    };
  },
  mounted() {},
  watch: {
    src(newValue, oldValue) {
      if (newValue) {
        this.url =  ref(newValue),
        this.srcList =  ref([newValue])        
      }
    },
  },
  updated: function () {
    console.log('OnceImage updated ')
  },  
  props: ["src"]  
};
</script>