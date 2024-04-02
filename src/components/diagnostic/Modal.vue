<template>
  <el-dialog
    v-model="visible"
    
    center
    custom-class="uaz__modal uaz__modal-sm alert__dialog"
    @close="cancelClick"
  >
    <template #title>
      <div class="uaz__modal-header">
        <h4 class="uaz__modal-header-h2 uaz__text-center uaz__margin--none">
          <span >{{headModal}}</span>
        </h4>
      </div>
    </template>
    <div
      class="uaz__modal-body default-modal-info"
      style="overflow: hidden"
    >
     <slot></slot>
    </div>
    <template #footer>
      <div v-if="!hideOk" class="uaz__modal-footer uaz__modification-modal-footer ng-scope">
        <button
          @click="confirmClick"
          class="uaz__btn uaz__btn-default uaz__center"
          style="margin-right: 10px;"
        >
          {{submitButtonName}}
        </button>       
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import { modificationNameFormatter } from "@/components/utils/helpers";
import {Request} from "@/services/axios.service";
export default {
  data() {
    return {
      visible: ref(this.open),
    };
  },
  props: ["open", "confirmClick", "cancelClick", "bodyModal", "headModal", "submitButtonName","hideOk"],
  mounted() {
    this.visible = this.open;
  },
  updated: function () {
    this.visible = this.open;
  },
  methods: {
    
  },
  watch: {
  },
  beforeUpdated: function () {},
};
</script>
<style>
.el-row {
  padding-bottom: 10px
}
.title {
  color: #000;
}
.body {
  color: #000;
  font-weight: 100; 
}
.uaz__modal {
  font-weight: 600;
  background-color: #fff;
  box-shadow: 0 0 10px #000;
  font-size: 10px;
}
.uaz__modal-header {
  position: relative;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
}
.uaz__modal-header-h2 {
  margin: 0;
  padding: 0;
}
button.el-dialog__headerbtn {
    margin: 2px 6px;
}

.detail_part_modal__image{
  padding: 0px 10px 5px 10px;
}
.detail_part_modal__image img{
  border-radius: 5px;
}
.uaz__modification-modal-footer .uaz__btn {
  height: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.uaz__btn-default {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  background-color: #013e2c;
  font-weight: 700;
  font-size: 10px;
}
.default-modal-info{
  color:black;
  font-size: 10px;
}
</style>
