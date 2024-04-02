<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="paginate.total"
    prev-text="«"
    next-text="»"
    :page-size="paginate.pageSize"
    v-model:currentPage="paginate.currentPage"
    @current-change="currentChange"
    :hide-on-single-page="true"
	
  >
  </el-pagination>
</template>


<script>
import { ref } from "vue";
export default {
  data() {
    return {
      currentPage: ref(2),
    };
  },
  props: ["paginate", "currentChange"],
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>
<style>
.el-pagination{
  text-align: right;  
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7fa099;
}
.el-pagination.is-background .el-pager li {
  color: #7fa099;
  margin: 0;
  text-decoration: none;
  background-color: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-radius: 0;
  margin: 0 4px;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  margin: 0;
  color: #7fa099;
  background-color: #fff;
  margin: 0 4px;
}

.el-pagination.is-background .btn-next span,
.el-pagination.is-background .btn-prev span,
.el-pagination.is-background .btn-next:disabled span,
.el-pagination.is-background .btn-prev:disabled span {
  line-height: 1.8;
  min-width: 20px;
}
.el-pagination.is-background .btn-next {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.el-pagination.is-background .btn-prev {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.el-pagination.is-background .el-pager li:not(.disabled, .active):hover,
.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover {
  color: #23527c;
  background-color: #eee;
  border-color: #ddd;
}
.el-pager li.btn-quicknext svg {
  color: #7fa099;
}

</style>