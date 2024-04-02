<template>
  <el-table
    :data="data"
    :class="className"
    style="width: 100%"
    :cell-class-name="uazbodycell"
    :header-cell-class-name="uazheadercell"
    :row-class-name="uazbodyrow"
    :header-row-class-name="uazheaderrow"
    :empty-text="notFound"
    @row-click="handleRowClick"
    @sort-change="handleSort"
    :span-method="spanMethod"
    :height="height ? height : null"
  >
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :label="column.label"
      :width="column.width"
      :prop="column.prop"
      :sortable="column.sortable"
    >
      <template #default="scope">
        <div v-if="column.html" v-html="scope.row[column.prop]" />
        <div v-else-if="column.havePopUp">
          <span
            class="modification_link"
            @click="showModalDialog(scope.row['productModification_id'])"
            >{{ formatName(scope.row[column.prop]) }}</span
          >
        </div>
        <div v-else>{{ scope.row[column.prop] }}</div>
      </template>
    </el-table-column>
  </el-table>
  <ModalContent
    v-if="productModification"
    v-model="showModal"
    :redirect-after-confim="redirectLink"
    :vin-info="productModification"
  />
</template>

<script>
import { Request } from '@/services/axios.service'
import ModalContent from '@/components/modal_templates/Search_vin_modal.vue'
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  data() {
    return {
      orders: [null],
      uazheadercell: 'uaz-header-cell',
      uazbodycell: 'uaz-body-cell',
      uazbodyrow: 'uaz-body-row',
      uazheaderrow: 'uaz-header-row',
      notFound: this.$t('notFound'),
      productModification: {},
      showModal: false,
      redirectLink: ''
    }
  },
  props: [
    'data',
    'columns',
    'handleRowClick',
    'handleSort',
    'spanMethod',
    'className',
    'height'
  ],
  methods: {
    showModalDialog: function(modification) {
      this.loadModification(modification)
      this.showModal = true
    },
    loadModification(productModificationId) {
      Request.get(`/productmodification/get/${productModificationId}`, {
        params: {}
      })
        .then(response => {
          this.productModification = response.data
          console.log(this.productModification, 'mod')
          this.redirectLink = `/parts/models-${this.productModification.productModel_id}/modification-${this.productModification.productModification_id}/`
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    formatName: function(val) {
      return modificationNameFormatter(val)
    },
    addGroup: function() {
      let heading = document.getElementsByClassName(
        'el-table__header-wrapper'
      )[0]
      let el = document.createElement('span')
      let headingTitle = this.data[0].productModel_name
      el.innerHTML =
        '<div class="parts_table_model_heading">' + headingTitle + '</div>'
      this.insertAfter(el, heading)
    },
    insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
    }
  },
  mounted: function() {
    setTimeout(() => this.addGroup(), 1000)
  },
  components: {
    ModalContent
  }
}
</script>
<style>
.uaz-header-cell {
  font-size: 10px;
  font-family: Arial;
  color: #fff;
  text-transform: uppercase;
  line-height: 17px !important;
  background-color: #013e2c !important;
  padding: 0 !important;
}
.modification_link {
  color: #00008b;
}
.parts_table_model_heading {
  padding: 1px 5px 2px;
  border-top: 1px solid #fff;
  background-color: #5e7772;
  color: #fff;
  padding-bottom: 3px;
}
.modification_link:hover {
  text-decoration: underline;
  cursor: pointer;
}
.uaz-body-cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px !important;
  padding: 0 !important;
  font-weight: 600;
  font-size: 10px;
}
.parts_table_wrapper {
  overflow-y: hidden;
}
.el-table .cell {
  color: #000;
  font-family: 'Arial';
  line-height: 17px;
  padding: 0px 6px;
  font-weight: 600;
  font-size: 10px;
  text-align: left;
  word-break: break-word;
}
.el-table th.el-table__cell > .cell {
  color: #fff;
  width: 104%;
}
.el-table {
  background-color: #cfdbd9;
  --el-table-row-hover-background-color: inherit;
}
.el-table tr {
  background-color: inherit;
  cursor: pointer;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  border-collapse: collapse;
}
.el-table td.el-table__cell {
  border: var(--el-table-border);
}
.el-table th.el-table__cell.is-leaf {
  border: none;
}
.el-table td.el-table__cell div > p {
  margin: 0;
}
.el-table tr td:first-child {
  text-align: center;
}
.el-table__empty-text {
  font-size: 10px;
  font-family: Arial;
  color: #000;
}
.el-table__row:hover {
  background: inherit;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: inherit;
}
.el-table__empty-block {
  align-items: start;
}
tr.uaz-header-row .cell {
  white-space: nowrap;
  word-break: break-all;
}
</style>
