<template>
  <FlowchartDetail
    :flowchartId="flowchartId"
    :productModelId="productModelId"
    :productModificationId="productModificationId"
    :year="year"
  />
</template>

<script>
import FlowchartDetail from '@/components/flowchart/FlowchartDetail.vue'
export default {
  name: 'Flowcharts',
  data() {
    return {
      flowchartId: 0,
      productModelId: 0,
      productModificationId: 0,
      year: ''
    }
  },
  components: {
    FlowchartDetail
  },
  mounted: function() {
    const {
      flowchartId,
      productModelId,
      productModificationId,
      year
    } = this.$route.params
    this.flowchartId = flowchartId
    this.productModelId = productModelId
    this.productModificationId = productModificationId
    this.year = year
  }
}
</script>
<style></style>
