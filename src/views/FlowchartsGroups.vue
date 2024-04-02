<template>
  <SectionDetail @changeGroup="changeGroup($event)" :groups="groups" :illustrations="illustrations">
    <template v-slot:illustration>
      <illustration-panel :illustrations="illustrations" :onIllustrationsDblclick="handleDblclick" />
    </template>
    <template v-slot:table>
      <SectionDetailTable :data="illustrations" :onDblclick="handleDblclick" />
    </template>
  </SectionDetail>
  <FlowchartGroupDetail
    :open="modalOpen"
    :cancelClick="handleCancel"
    :productModelId="productModelId"
    :productModificationId="productModificationId"
    :year="year"
    :partGroupId="partGroupId"
  />
</template>

<script>
import { Request } from "@/services/axios.service";
import SectionDetail from "@/components/SectionDetail.vue";
import FlowchartGroupDetail from "@/components/flowchart/FlowchartGroupDetail.vue";
import illustrationPanel from "@/components/Illustrations_panel.vue";
import SectionDetailTable from "@/components/SectionDetailTable.vue";
import { mapState } from "vuex";
export default {
  name: "FlowchartsGroups",
  async mounted() {
    await this.loadGroups();
    await this.loadIllustrations();
  },
  data() {
    return {
      groups:[],
      illustrations:[],
      modalOpen: false,
      partGroupId: 0,
      year: 2020,
    };
  },
  components: {
    SectionDetail,
    FlowchartGroupDetail,
    SectionDetailTable,
    "illustration-panel": illustrationPanel,
  },
  computed: {
    ...mapState({
        productModificationId: (state) => {
          return state.modification.productModification_id;
        },
        productModelId: (state) => {
          return state.modification.productModel_id;
        },    
      })
  }, 
  updated: function () {
  } ,
  methods: {
    handleDblclick(id) {
      this.modalOpen = true;
      this.partGroupId = id;
    },
    handleCancel() {
      this.modalOpen = false;
    },
    changeGroup(id){
      this.loadIllustrations(id);
    },
    loadGroups(id = "") {
      Request.get(`/partgroup/index/` + id,
        {
          params: {
            productModel_id: this.productModelId,
            productModification_id: this.productModificationId,
            section: 'flowcharts',
            year: this.year,
          }
        }
        ).then((response) => {
            this.groups = response.data.data;
        }).catch(function (error) {
          console.log('error', error.response.data.message);
        });
    },
    loadIllustrations(id = "") {
      Request.get(`/partgroup/index/` + id,
        {
          params: {
            productModel_id: this.productModelId,
            productModification_id: this.productModificationId,
            section: 'flowcharts',
            year: this.year,  
            onlyIllustration: 1,          
          }
        }
        ).then((response) => {
            this.illustrations = response.data.data;
        }).catch(function (error) {
          console.log('error', error.response.data.message);
        });
    },
  },
};
</script>
<style>
</style>