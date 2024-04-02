<template>
  <!--uaz_parts_right_block_content_contianer -->
  <div
    class="uaz__container-small uaz__content uaz__flowchart uaz__flowchart_border"
    :class="{ 'uaz__flowchart__detail-inside': view }"
  >
    <div class="uaz__row uaz__margin-none uaz__total-height">
      <div class="uaz__total-height">
        <div class="uaz__panel-default uaz__total-height">
          <div class="uaz__panel-header-dark">
            <span>{{ this.$i18n.locale == 'ru' ? name : name_en }}</span>

            <!--ТХ: inside white table with images-->
          </div>

          <div class="uaz__panel-content uaz__flowchart scroll_table_container">
            <FlowchartCard1
              :name="this.$i18n.locale == 'ru' ? name : name_en"
              :parts="parts"
              :code="code"
            />
            <FlowchartCard2
              v-if="!view"
              :productModification="productModification"
            />
            <FlowchartToolsWrap :flowchartId="flowchartId" />
            <div class="uaz__flowchart-section"></div>
            <div v-for="(tools, index) in items" :key="index">
              <div v-for="(tool, index2) in tools" :key="index2">
                <FlowchartNotification
                  :data="tool"
                  v-if="tool.flowChartItemType_id === 4"
                />
                <FlowchartTitle
                  :data="tool"
                  v-if="tool.flowChartItemType_id === 5"
                />
                <FlowchartRedirect
                  :data="tool"
                  :productModelId="productModelId"
                  :productModificationId="productModificationId"
                  :year="year"
                  v-if="tool.flowChartItemType_id === 2"
                  :key="index"
                />
                <FlowchartHTML
                  :data="tool"
                  v-if="tool.flowChartItemType_id === 6"
                />
                <FlowchartModelWrap :data="tool" v-if="Array.isArray(tool)" />
              </div>

              <div class="uaz__flowchart-section"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FlowchartCard1 from '@/components/flowchart/FlowchartCard1.vue'
import FlowchartCard2 from '@/components/flowchart/FlowchartCard2.vue'
import FlowchartToolsWrap from '@/components/flowchart/FlowchartToolsWrap.vue'
import FlowchartRedirect from '@/components/flowchart/FlowchartRedirect.vue'
import FlowchartTitle from '@/components/flowchart/FlowchartTitle.vue'
import FlowchartHTML from '@/components/flowchart/FlowchartHTML.vue'
import FlowchartModelWrap from '@/components/flowchart/FlowchartModelWrap.vue'
import FlowchartNotification from '@/components/flowchart/FlowchartNotification.vue'
import { Request } from '@/services/axios.service'
function combine(obj) {
  let mapping = []
  let result = []
  let data = []
  for (let i = 0; i < obj.length; i = i + 1) {
    const flowchart = obj[i]
    if (mapping.length === 0) {
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    } else if (
      mapping[mapping.length - 1] === flowchart.flowChartItemType_id ||
      mapping[mapping.length - 1] === 5
    ) {
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    } else {
      result.push(data)
      data = []
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    }

    if (i === obj.length - 1) {
      result.push(data)
    }
  }

  return result
}
function formatter(obj) {
  const newObj = obj.map(item => {
    if (item.filter(item2 => item2.flowChartItemType_id === 1).length > 0) {
      const result = []
      const images = []
      for (let i = 0; i < item.length; i = i + 1) {
        if (item[i].flowChartItemType_id !== 1) {
          result.push(item[i])
        } else {
          if (item[i].operation_image) {
            images.push({ ...item[i], children: [item[i]] })
          } else {
            if (!images[images.length - 1]) {
              images.push({ ...item[i], children: [item[i]] })
            } else {
              images[images.length - 1].children.push(item[i])
            }
          }
        }
      }
      result.push(images)
      return result
    }
    return item
  })
  return newObj
}
export default {
  name: 'FlowchartDetail',
  components: {
    FlowchartCard1,
    FlowchartCard2,
    FlowchartToolsWrap,
    FlowchartTitle,
    FlowchartRedirect,
    FlowchartHTML,
    FlowchartNotification,
    FlowchartModelWrap
  },
  props: [
    'flowchartId',
    'productModelId',
    'productModificationId',
    'year',
    'view'
  ],
  data() {
    return {
      productModification: {},
      data: {},
      parts: [],
      code: '',
      name: '',
      name_en: '',
      items: []
    }
  },
  methods: {
    load() {
      Request.get(`/flowchart/get/${this.flowchartId}`, {
        params: {}
      })
        .then(response => {
          if (response.data && response.data.data) {
            const data = response.data.data
            console.log('data', data)
            const parts = [
              ...data.parts.map(item => item.part_name),
              ...data.modifications.map(item => item.productModification_name)
            ]
            console.log('parts', parts)
            this.parts = parts // no translation
            this.code = data.flowChart_code
            this.name = data.flowChart_name
            this.name_en = data.flowChart_name_en
            this.items = formatter(combine(data.items))
          }
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    loadModification(productModificationId) {
      Request.get(`/productmodification/get/${productModificationId}`, {
        params: {}
      })
        .then(response => {
          this.productModification = response.data
        })
        .catch(function(error) {
          console.log('error', error)
        })
    }
  },
  watch: {
    flowchartId: async function(newValue, oldValue) {
      if (this.flowchartId > 0) {
        await this.load()
      }
    },
    productModificationId: async function(newValue, oldValue) {
      await this.loadModification(newValue)
    }
  },
  async mounted() {
    if (this.flowchartId && this.flowchartId > 0) {
      await this.load()
    }
    if (this.productModificationId > 0) {
      await this.loadModification(this.productModificationId)
    }
  },
  updated() {}
}
</script>
<style scoped>
.uaz__total-height {
  height: 100%;
}
.uaz__panel-content {
  padding-left: 10px;
  text-transform: none;
}
.uaz__flowchart {
  /*padding-top: 15px !important; ???bothers me - flowcharts : table.General procedures - bothers*/
  padding-bottom: 15px !important;
}
/*scroll*/
.scroll_table_container {
  padding-top: 15px !important;
}

.uaz__flowchart {
  border-right: 0px solid #b8bdc0;
  border-bottom: 0px solid #b8bdc0;
  border-left: 0px solid #b8bdc0;
}
.uaz__flowchart_border {
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
}
.uaz__panel-header-dark {
  position: relative;
  background-color: #013e2c;
}

.uaz__container-small {
  margin-right: auto;
  margin-left: auto;
  /*overflow-y: scroll;*/
  height: 100%;
}

.uaz__panel-header-dark,
.uaz__panel-header-light {
  text-transform: uppercase;
  line-height: 17px;
  display: -ms-flexbox;
  display: flex;
  font-size: 10px;
  min-height: 17px;
  font-weight: 600;
  padding-left: 5px;
}
.fa-inverse,
.uaz__panel-header-dark {
  color: #fff;
}

.uaz__flowchart-tools-left {
  padding: 5px;
  border: 2px solid #b8bdc0;
}
.uaz__flowchart-img {
  width: 100%;
  height: auto;
}

.uaz__instruction:first-child {
  padding-top: 0;
}
.uaz__instruction:first-child {
  padding-top: 0;
}
.uaz__instruction-btn {
  padding-top: 10px;
}
.uaz__btn-sm {
  padding: 5px;
  background-color: #cfdbd9;
  color: #013e2c;
}
.uaz__btn {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  font-size: 10px;
}
.uaz__flowchart-inline-btn {
  float: left;
  margin-right: 15px;
}

.uaz__operation-item:last-child {
  padding: 10px;
}
.uaz__border-left {
  border-left: 1px solid #b8bdc0;
  left: -1px;
}
.uaz__operation-item p {
  font-size: 10px;
}

.uaz__flowchart-section {
  border-top: 2px solid #cfdbd9;
  margin: 25px 0;
  position: relative;
  width: calc(100% + 30px);
  left: -15px;
}
.uaz__flowchart .el-row {
  padding-bottom: 0px;
}
@media (min-width: 768px) {
  .uaz__container-small {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .uaz__container-small {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .uaz__container-small {
    width: 1170px;
  }
}
.uaz__flowchart__detail-inside {
  width: 100%;
  border: 2px solid #013e2c;
  overflow: hidden;
  height: 100%;
}
</style>
