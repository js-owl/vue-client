<template>
  <CollapseTd :productModelId="productModelId" :productModificationId="productModificationId"/>
</template>

<script>
import CollapseTd from "@/components/flowchart/CollapseTd.vue";
import { Request } from "@/services/axios.service";
export default {
  data() {
    return {
      productModelId: 0,
      productModificationId: 0,      
    };
  },
  components: {
    CollapseTd,
  },
  props: [],
  methods: {},
  watch: {},
  mounted() {
    const { productModelId, productModificationId } = this.$route.params;
    this.productModelId = productModelId;
    this.productModificationId = productModificationId;    
  },
};
</script>
<style>
</style>