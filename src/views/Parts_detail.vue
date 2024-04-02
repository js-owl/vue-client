<template>
  <SectionDetail
    @changeGroup="changeGroup($event)"
    :groups="groups"
    :illustrations="illustrations"
  >
    <template v-slot:illustration>
      <illustration-panel
        :illustrations="illustrations"
        :onIllustrationsDblclick="handleDblclick"
      />
    </template>
    <template v-slot:table>
      <SectionDetailTable
        :data="illustrations"
        :illustrationID="illustrationID"
        :onDblclick="handleDblclick"
      />
    </template>
  </SectionDetail>
</template>

<script>
import { mapState } from 'vuex'
import { Request } from '@/services/axios.service'
import SectionDetail from '@/components/SectionDetail.vue'
import illustrationPanel from '@/components/Illustrations_panel.vue'
import SectionDetailTable from '@/components/SectionDetailTable.vue'
import { ElLoading } from 'element-plus'
export default {
  name: 'Parts_detail',
  data() {
    return {
      groups: [],
      illustrations: [],
      illustrationID: 0
    }
  },
  components: {
    SectionDetail,
    SectionDetailTable,
    'illustration-panel': illustrationPanel
  },
  mounted: function() {
    this.getGroups()
    this.getIllustration()
  },
  methods: {
    handleDblclick(partId) {
      this.$router.push(
        '/parts/illustration/detail/' +
          partId +
          '/' +
          '?productModification_id=' +
          this.productModification.productModification_id +
          '&productModelId=' +
          this.productModification.productModel_id
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
    },
    // handleIllustrationsDblclick(partId) {
    //   this.$router.push(
    //     '/parts/illustration/detail/' +
    //       partId +
    //       '/' +
    //       '?productModification_id=' +
    //       this.productModification.productModification_id +
    //       '&productModelId=' +
    //       this.productModification.productModel_id
    //   )
    //   this.$store.commit('section/SET_PAGE_LEVEL', 2)
    // },
    getGroups: function() {
      let modificationnID = this.getParamFromURL('modification')
      Request.get(
        'partgroup/index/?productModification_id=' + modificationnID,
        {}
      )
        .then(response => {
          this.groups = response.data.data
        })
        .catch(function(error) {})
    },
    changeGroup(id) {
      this.getIllustrationByID(id)
    },
    getIllustration: function() {
      Request.get(
        'partgroup/illustration/?productModification_id=' +
          this.productModificationId,
        {}
      )
        .then(response => {
          this.illustrations = response.data.data
        })
        .catch(function(error) {})
    },
    getIllustrationByID: function(id) {
      let modificationnID = this.getParamFromURL('modification')
      let modelsID = this.getParamFromURL('models')
      Request.get('partgroup/illustration/' + id, {
        params: {
          productModification_id: modificationnID,
          productModel_id: modelsID,
          section: 'parts'
        }
      })
        .then(response => {
          this.illustrations = response.data.data
        })
        .catch(function(error) {})
    },
    //TODO make it global
    getParamFromURL: function(param) {
      let urlArr = this.$router.currentRoute._value.path.split('/')
      let modification = 0
      urlArr.forEach(elem => {
        if (elem.startsWith(param)) {
          modification = elem.split('-')[1]
        }
      })
      return modification
    }
  },
  watch: {
    needToRefresh: async function(newValue, oldValue) {
      if (newValue) {
        this.getIllustration()
      }
    }
  },
  computed: {
    ...mapState({
      productModification: state => {
        return state.modification
      },
      productModificationId: state => state.modification.productModification_id,
      needToRefresh: state => state.vinThrough.timeUpdate
    })
  }
}
</script>
<style></style>
