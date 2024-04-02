<template>
  <div v-if="tool2.length > 0">
    <el-row :gutter="20">
      <el-col :span="24">
        <p class="uaz__flowchart-title">{{ $t('equipmentAndTool') }}</p>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="uaz__flowchart-tools">
      <FlowchartTools v-for="tool in tool2" :data="tool" :key="tool.tool_id" />
    </el-row>
  </div>
</template>

<script>
import FlowchartTools from '@/components/flowchart/FlowchartTools.vue'
import { Request } from '@/services/axios.service'
export default {
  data() {
    return {
      tool2: [],
      tool4: []
    }
  },
  components: {
    FlowchartTools
  },
  props: ['flowchartId'],
  methods: {
    load() {
      Request.get(`/flowchart/tool/${this.flowchartId}`, {
        params: {}
      })
        .then(response => {
          if (response.data.data && response.data.data[2]) {
            this.tool2 = response.data.data[2].filter(item => item.tool_image)
          }
          if (response.data.data && response.data.data[4]) {
            this.tool4 = response.data.data[4].filter(item => item.tool_image)
          }
        })
        .catch(function(error) {
          console.log('error', error.response.data.message)
        })
    }
  },
  computed: {},
  async mounted() {
    if (this.flowchartId > 0) {
      await this.load()
    }
  },
  watch: {
    flowchartId: async function(newValue, oldValue) {
      if (this.flowchartId > 0) {
        await this.load()
      }
    }
  },
  updated() {}
}
</script>
<style></style>
