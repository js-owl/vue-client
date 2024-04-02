<template>
  <div class="diagnostic__tab-wrap uaz__text-center">
    <button
      :disabled="emptyByCode"
      type="button"
      class="uaz__btn uaz__btn-light diagnostic-structure__tab"
      @click="handleClick('defectbycode')"
      :class="defectType === 'defectbycode' && 'active'"
    >
      {{ $t('toCode') }}
    </button>

    <button
      :disabled="emptyByFeature"
      type="button"
      class="uaz__btn uaz__btn-light diagnostic-structure__tab"
      @click="handleClick('defectbyfeature')"
      :class="defectType === 'defectbyfeature' && 'active'"
    >
      {{ $t('toFeature') }}
    </button>
  </div>

  <Tree :tree="tree" :handleClickNode="handleClickNode" />
</template>

<script>
import Tree from '../common/UI/Tree.vue'
import { Request } from '@/services/axios.service'

function recMap(data) {
  return data.map(node => {
    if (node.nodes.length > 0) {
      return {
        ...node,
        structureFlowChart_name: `${node.structureFlowChart_code} - ${node.structureFlowChart_name}`,
        nodes: recMap(node.nodes)
      }
    } else {
      const children = []
      if (node.emptyDescriptionPrinciple === 0) {
        children.push({
          desc: true,
          structureFlowChart_id: node.structureFlowChart_id,
          structureFlowChart_name: 'Описание и принцип действия',
          structureFlowChart_name_en: 'Description and principle of operation'
        })
      }
      children.push({
        isLeaf: true,
        structureFlowChart_id: node.structureFlowChart_id,
        structureFlowChart_name: 'Проверка и диагноcтика',
        structureFlowChart_name_en: 'Check and diagnostic'
      })
      return {
        ...node,
        structureFlowChart_name: `${node.structureFlowChart_code} - ${node.structureFlowChart_name}`,
        nodes: children
      }
    }
  })
}
export default {
  name: 'DiagnosticTree',
  components: {
    Tree
  },
  data() {
    return {
      tree: [],
      treeDefectbycode: [],
      treeDefectbyfeature: [],
      emptyByCode: false,
      emptyByFeature: false
    }
  },
  props: ['defectType', 'setProp', 'productModificationId'],
  mounted: function() {
    this.initialLoadClick()
  },
  methods: {
    handleClickNode: async function(data) {
      if (data.desc) {
        await this.setProp({ meta: 'currentComponent', data: 'Description' })
      }
      if (data.isLeaf) {
        await this.setProp({ meta: 'currentComponent', data: 'Defects' })
      }
      await this.setProp({
        meta: 'structureFlowChartId',
        data: data.structureFlowChart_id
      })
    },
    async handleClick(defectType) {
      this.setProp({ meta: 'defectType', data: defectType })
      //TODO do it without timeout
      setTimeout(() => this.load(), 100)
    },
    load() {
      Request.get(`/structureflowchart/diagnostic`, {
        params: {
          productModification_id: this.productModificationId,
          request_target: this.defectType
        }
      })
        .then(response => {
          if (response.data.data && response.data.data.length > 0) {
            this.tree = recMap(response.data.data)
            console.log('tree', this.tree)
          }
        })
        .catch(function(error) {
          console.log('DiagnosticTree', error)
        })
    },
    //diagnostic: by code or by attribute
    initialLoadClick() {
      Request.get(`/structureflowchart/diagnostic`, {
        params: {
          productModification_id: this.productModificationId,
          request_target: 'defectbycode'
        }
      })
        .then(response => {
          if (response.data.data && response.data.data.length > 0) {
            this.handleClick('defectbycode')
          } else {
            this.emptyByCode = true
            Request.get(`/structureflowchart/diagnostic`, {
              params: {
                productModification_id: this.productModificationId,
                request_target: 'defectbyfeature'
              }
            })
              .then(response => {
                if (response.data.data && response.data.data.length > 0) {
                  this.handleClick('defectbyfeature')
                } else {
                  this.emptyByFeature = true
                }
              })
              .catch(function(error) {
                console.log('DiagnosticTree', error)
              })
          }
        })
        .catch(function(error) {
          console.log('DiagnosticTree', error)
        })
    }
  },
  watch: {
    productModificationId: function(newValue, oldValue) {
      this.load()
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>

<style>
.uaz__btn-light {
  cursor: pointer;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-size: 10px;
  margin: 0 1.5px; /*//diagnostic: by code or by attribute */
  height: 34px;
  min-width: 100px;
  width: 100px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  background-color: #7fa099;
}
.diagnostic-structure__tab.active {
  background-color: #013e2c;
}
.uaz__text-center {
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center !important;
}
.diagnostic__tab-wrap {
  padding: 15px 0;
}
.uaz__btn-light:disabled {
  background: #a7a9ac;
}
</style>
