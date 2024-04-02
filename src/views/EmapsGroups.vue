<template>
  <SectionDetail
    @changeGroup="changeGroup($event)"
    :groups="groups"
    :illustrations="illustrations"
  >
    <template v-slot:illustration>
      <EmapsImageBlock :electricGroup="electricGroup" />
    </template>
    <template v-slot:table>
      <EmapCollapseTd
        v-if="productModelId"
        :elGroup_id="elGroup_id"
        :productModelId="productModelId"
        :productModificationId="productModificationId"
        :year="year"
        :handleCellClick="handleCellClick"
      />
    </template>
  </SectionDetail>
</template>

<script>
import { Request } from '@/services/axios.service'
import SectionDetail from '@/components/SectionDetail.vue'
import EmapsImageBlock from '@/components/emap/EmapsImageBlock.vue'
import EmapCollapseTd from '@/components/emap/EmapCollapseTd.vue'

export default {
  name: 'EmapsGroups',
  async mounted() {
    const { productModelId, productModificationId } = this.$route.params
    this.productModelId = productModelId
    this.productModificationId = productModificationId
    await this.loadGroups()
    console.log(this.$route.params)
  },

  data() {
    return {
      productModelId: 0,
      elGroup_id: null,
      productModificationId: 0,
      groups: [],
      illustrations: [],
      modalOpen: false,
      partGroupId: 0,
      year: 2019,
      electricGroup: null
    }
  },
  components: {
    SectionDetail,
    EmapsImageBlock,
    EmapCollapseTd
  },

  methods: {
    handleDblclick(id) {
      this.modalOpen = true
      this.partGroupId = id
    },
    changeGroup(id) {
      this.elGroup_id = id
    },
    handleCancel() {
      this.modalOpen = false
    },
    handleCellClick(electricGroup) {
      this.electricGroup = electricGroup
    },
    loadGroups(index) {
      Request.get(`/elgroup/list/`, {
        params: {
          productModel_id: this.productModelId,
          productModification_id: this.productModificationId,
          section: 'emaps',
          year: this.year
        }
      })
        .then(response => {
          const data = response.data.data
          this.groups = data.map(i => ({
            partGroup_group: null,
            partGroup_name: i.elGroup_name,
            partGroup_name_en: i.elGroup_name_en,
            partGroup_id: i.elGroup_id
          }))
          let groups2 = []
          this.groups.forEach(item => {
            groups2.push(item.partGroup_name)
          })
          console.log(groups2)
          this.$store.commit('filters/SET_GROUP_EMAPS', groups2)
        })
        .catch(function(error) {
          console.log('error', error.response.data.message)
        })
    }
  }
}
</script>
<style></style>
