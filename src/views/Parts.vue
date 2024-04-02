<template>
<Choose-modification section="parts" />
</template>

<script>
// @ is an alias to /src
const axios = require('axios');
import Choose_modification from '@/components/Choose_modification.vue'
import {Request} from "@/services/axios.service";
export default {
  name: 'Parts',
  data() {
      return {

      }
  },
  components: {
    "Choose-modification": Choose_modification,
  },
  mounted: function(){
    this.$store.commit('section/SET_SECTION','parts');
  },
  methods:{
  },
  computed:{

  }
}
</script>
<style>
</style>