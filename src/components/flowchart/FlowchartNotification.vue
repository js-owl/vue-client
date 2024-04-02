<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <div class="uaz__inline">
        <div class="uaz__inline uaz__notice-icon">
          <img
            v-if="data.notification_icon === 'warning'"
            style="width: 100%"
            src="../../assets/warning.png"
          />
          <img
            v-if="data.notification_icon === 'error'"
            style="width: 100%"
            src="../../assets/danger.png"
          />
        </div>

        <span class="uaz__inline uaz__flowchart__detail_notification">
          <span class="uaz__uppercase">{{ $t('notification') }}:</span>
          <span>
            {{
              this.$i18n.locale == 'ru'
                ? data.flowChartItem_name
                : data.flowChartItem_name_en
            }}
          </span>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {},
  props: ['data'],
  methods: {},
  computed: {},
  mounted() {}
}
</script>
<style>
.uaz__uppercase {
  text-transform: uppercase;
}
.uaz__notice-icon {
  width: 20px;
  height: 20px;
  vertical-align: top;
}
.uaz__inline {
  display: inline-block;
}
.uaz__flowchart__detail_notification {
  width: calc(100% - 40px);
  padding-left: 5px;
}
.el-row {
  margin-bottom: 10px;
}
</style>
