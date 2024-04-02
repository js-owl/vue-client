<template>
  <el-tree
    :data="tree"
    @node-click="handleClickNode"
    :icon-class="treeicon"
    :props="defaultProps"
    :empty-text="notData"
    :icon="ison"
    node-key="structureFlowChart_name"
  >
    <template #default="{ data }">
      <span class="custom-tree-node">
        <span :class="data.isLeaf ? 'leaf' : data.desc ? 'desc' : ''">
          {{
            this.$i18n.locale == 'ru'
              ? data.structureFlowChart_name
              : data.structureFlowChart_name_en
          }}
        </span>
      </span>
    </template>
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      notData: this.$t('notFound'),
      defaultProps: {
        children: 'nodes',
        label: 'structureFlowChart_name'
      },
      treeicon: 'treeicon',
      ison: 'empty'
    }
  },

  props: ['tree', 'handleClickNode'],
  updated: function() {
    console.log('Tree updated', this.tree)
  }
}
</script>

<style>
.el-tree {
  padding: 0 0 0 10px;
}
.custom-tree-node {
  margin: 14px 0;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
  color: black;
}
.custom-tree-node .leaf,
.custom-tree-node .desc {
  text-transform: none;
}
i.el-tree-node__expand-icon {
  background-image: url(https://elis.uaz.ru/elis.uaz/img/tree.png);
  width: 18px;
  min-width: 18px;
  height: 13px;
  line-height: 13px;
  background-repeat: no-repeat;
  background-color: transparent;
  display: inline-block;
  text-decoration: none;
  margin: 0;
  padding: 0;
  vertical-align: top;
  text-align: center;
  background-position: -103px -10px;
  cursor: pointer;
}
i.expanded {
  cursor: pointer;
  background-position: -135px -10px;
}
i.is-leaf {
  background-position: 100px 100px;
}
.is-current > div > span > span.leaf {
  font-weight: 900;
}
.el-tree,
.el-tree-node__content:hover,
.el-tree-node:focus {
  background: inherit;
  --el-tree-node-hover-background-color: inherit;
}
.el-tree-node:focus > .el-tree-node__content {
  background: inherit;
}
.el-tree-node {
  white-space: inherit;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
.el-tree-node__expand-icon.expanded {
  transform: none;
}
.el-tree-node__content {
  text-align: left;
  height: 21px;
}
.el-tree__empty-text {
  font-size: 10px;
  font-family: Arial;
  top: 15px;
  /*text-transform: uppercase;*/
  color: black;
}
</style>
