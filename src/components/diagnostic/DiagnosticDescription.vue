<template>
  <div class="uaz_parts_block_header_contianer">
    <div class="uaz_parts_block_header__modification">
      {{ $t('descriptionPrinciple').toUpperCase() }}
    </div>
  </div>
  <div class="uaz__diagnostic-description" v-html="html" />
</template>

<script>
import { Request } from '@/services/axios.service'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
export default {
  components: {},
  data() {
    return {
      html: ''
    }
  },
  props: ['structureFlowChartId'],
  methods: {
    load() {
      Request.get(`descriptionprinciple/get/${this.structureFlowChartId}`, {
        params: {}
      })
        .then(response => {
          if (response.data) {
            this.html = response.data.descriptionPrinciple_description
          }
        })
        .catch(function(error) {
          console.log('DiagnosticDescription', error)
        })
    }
  },
  watch: {
    structureFlowChartId: function(newValue, oldValue) {
      this.load()
    }
  },
  mounted: async function() {
    await this.load()
  },
  computed: {},
  updated: async function() {},
  beforeUpdated: function() {}
}
</script>
<style scoped>
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}
.uaz_parts_block_header__modification {
  flex-grow: 1;
  padding: 4px;
  width: 25%;
}
.uaz__diagnostic-description {
  padding: 5px;
}
</style>
