<template
  ><!--ТХ(FlowchartCard2): inside white table with images-->
  <el-row :gutter="20">
    <el-col :span="4">
      <div class="uaz__form-group">
        <label for="uaz__number" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('model') }}
        </label>

        <div class="uaz__card__text">
          <span>
            {{
              this.$i18n.locale == 'ru'
                ? productModification.productModel_name
                : productModification.productModel_name_en
            }}
          </span>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="uaz__form-group">
        <label for="uaz__name" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('period') }}
        </label>
        <div class="uaz__card__text">
          <span>{{ productModification.productModification_modelYear }}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="uaz__form-group">
        <label for="uaz__otn" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('modification') }}
        </label>
        <div class="uaz__card__text">
          <span>{{
            formatModificationName(productModification.productModification_name)
          }}</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { modificationNameFormatter } from '@/components/utils/helpers'
export default {
  data() {
    return {}
  },
  components: {},
  props: ['productModification'],
  methods: {
    formatModificationName: function(val) {
      return modificationNameFormatter(val)
    }
  },
  computed: {},
  mounted() {}
}
</script>
<style>
.uaz__form-group {
  margin-bottom: 5px;
}
.uaz__text-left {
  text-align: left !important;
}
.uaz__label {
  font-size: 10px;
  padding-bottom: 5px;
  display: block;
}
.uaz__bold {
  font-weight: 700;
}
.uaz__card__text {
  font-weight: 600;
}
.uaz__parts-list {
  padding: 0;
  list-style: none;
  margin: 0;
}
.models-button-show-all-list {
  cursor: pointer;
  text-transform: none;
}
</style>
