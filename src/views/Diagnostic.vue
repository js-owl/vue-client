<template>
  <Choose-modification section="diagnostic" />
</template>

<script>
import { Request } from '@/services/axios.service'
import Choose_modification from '@/components/Choose_modification.vue'
export default {
  name: 'Parts',
  data() {
    return {
      selectedModel: 'undefined',
      selectedGroup: 'undefined',
      selectedYear: 'undefined',
      isScrolling: false,
      groups: {},
      modifications: {}
    }
  },
  components: {
    'Choose-modification': Choose_modification
  },
  mounted: function() {
    this.getGroups()
    // this.lookforScroll();
    // window.addEventListener("resize", this.lookforScroll);
  },
  methods: {
    scrollTo: function(direction) {
      var target = document.getElementById('modification_list')
      var coords = direction === 'top' ? 0 : target.scrollHeight
      target.scrollTo(0, coords)
    },
    lookforScroll: function() {
      /*  var target = document.getElementById('modification_list');
      if(target.scrollHeight > target.clientHeight){
        this.isScrolling = true;
      }
      else{
        this.isScrolling = false;
      }*/
    },
    showContent: function(productModelId, productModificationId) {
      this.$router.push(
        '/parts/models-' +
          productModelId +
          '/modification-' +
          productModificationId +
          '/'
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 1)
    },
    getLabelInfo: function(text) {
      return text == 'half'
        ? this.$t('illustrationsNotAll')
        : this.$t('illustrations50')
    },
    getGroups: function() {
      Request.get('/productmodel', { params: { section: 'diagnostic' } })
        .then(response => {
          this.groups = response.data.data
          console.log(response)
        })
        .catch(function(error) {
          errorMixin.methods.showError('warn', error.response.data.message)
        })
    },
    selectModel: function(id, groupKey) {
      this.selectedModel = id
      this.selectedGroup = groupKey
    },
    selectYear: function(id) {
      this.selectedYear = id
      if (
        this.selectedGroup !== 'undefined' &&
        this.selectedModel !== 'undefined' &&
        this.selectedYear !== 'undefined'
      ) {
        Request.get('/productmodification', {
          params: {
            productModel_id: this.selectedModel,
            section: 'parts',
            year: this.groups[this.selectedGroup].models[this.selectedModel]
              .years[this.selectedYear]
          }
        })
          .then(response => {
            this.modifications = response.data.data
          })
          .catch(function(error) {
            errorMixin.methods.showError('warn', error.response.data.message)
          })
      }
    },
    inArray: function(needle, haystack) {
      return haystack.includes(needle)
    }
  }
}
</script>
<style scoped>
.uaz_parts_left_part {
  flex-grow: 5;
  margin-right: 10px;
  height: 100%;
  background: #cfdbd9;
  width: 30%;
}
.uaz_parts_middle_part {
  flex-grow: 1;
  margin-right: 10px;
  height: 100%;
  width: 10%;
  background: #cfdbd9;
}
.uaz_parts_right_part {
  flex-grow: 10;
  height: 100%;
  background: #cfdbd9;
  width: 60%;
}
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}
.uaz_parts_right_block_content_row {
  display: flex;
  justify-content: flex-start;
  background-color: #cfdbd9;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  border-top: 1px solid #fff;
}
.uaz_parts_block_header {
  flex-grow: 1;
  padding: 4px;
  width: 50%;
}
.uaz_parts_block_header__comment {
  flex-grow: 3;
  padding: 4px;
  width: 56%;
}
.uaz_parts_block_header__modification {
  flex-grow: 1;
  padding: 4px;
  width: 25%;
}
.uaz_parts_right_block_content__modification {
  flex-grow: 1;
  padding: 4px;
  border-right: 1px solid #fff;
  width: 25%;
}
.uaz_parts_right_block_content__comment {
  flex-grow: 3;
  padding: 4px;
  width: 56%;
}
.uaz_parts_left_part_category_name {
  background-color: #7fa099;
  color: white;
  padding: 4px;
  text-transform: uppercase;
}
.uaz_parts_left_part_model_list_row {
  display: flex;
  cursor: pointer;
  min-height: 17px;
  line-height: 17px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
  box-sizing: border-box;
}
.uaz_parts_left_part_model_left {
  border-right: 1px solid #fff;
}
.uaz_parts_left_part_model {
  flex-grow: 1;
  padding: 4px;
  width: 50%;
}
.uaz_parts_left_part_model_list_row.row_active {
  border: 2px solid #013e2c !important;
  background: #fff !important;
}
.uaz_parts_middle_part_year.row_active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
  box-sizing: border-box;
}
.uaz_parts_middle_part_year {
  width: 100%;
  display: block;
  padding: 4px 0px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
}
.uaz_parts_availability_marker {
  width: 20px;
  display: inline-block;
}
.uaz_parts_container {
  position: relative;
}
.uaz__ngsb-thumb-btn-down,
.uaz__ngsb-thumb-btn-up {
  position: absolute;
  right: 0px;
  width: 20px;
  border-radius: 2px;
  background-color: #7fa099;
  height: 19px;
  cursor: default;
  border-bottom: 1px solid white;
}
.uaz__ngsb-thumb-btn-down:after,
.uaz__ngsb-thumb-btn-up:after {
  position: absolute;
  left: 3px;
  top: 2px;
  content: '^';
  font-family: cursive;
  font-size: 20px;
  height: 20px;
  color: #013e2c !important;
}
.uaz__ngsb-thumb-btn-down {
  bottom: 0;
}
.uaz__ngsb-thumb-btn-down:after {
  top: 1px;
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.uaz__fullness-green {
  background-color: green;
}
.uaz__fullness-empty,
.uaz__fullness-green {
  z-index: 0;
  width: 10px;
  height: 10px;
  border: 1px solid #000 !important;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
}
.uaz__fullness-green--semi {
  background: linear-gradient(to right, green 50%, #fff 50%);
}
.uaz__fullness-green-year {
  margin: 0 4px;
}
</style>
