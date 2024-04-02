<template>
  <el-input class="input_password" v-model="input" show-password />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    return {
      input: ref(''),
    }
  },
})
</script>
<style scoped>

</style>