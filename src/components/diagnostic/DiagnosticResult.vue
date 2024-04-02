<template>
  <div style="padding: 5px 0">
    <div class="diagnostic-structure__pad">
      <h2>{{ $t('result') }}</h2>
      <p>{{ currentResult.defectItem_text }}</p>
      <div style="margin-left: 6px;">
        <Button
          :text="$t('finish').toUpperCase()"
          :handleClick="() => handleClick('stop')"
        />
        <span style="margin-left: 10px; display: inline-block">
          <Button
            :text="$t('viewResult').toUpperCase()"
            :handleClick="() => handleClick('report')"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/UI/Button.vue'
export default {
  components: {
    Button
  },
  props: ['currentResult', 'setParentProp', 'setProp', 'toClearTesting'],
  methods: {
    handleClick(direct) {
      if (direct === 'report') {
        this.setProp({ meta: 'currentComponent', data: 'Report' })
      }
      if (direct === 'stop') {
        this.toClearTesting()
        this.setParentProp({ meta: 'currentComponent', data: 'Defects' })
      }
    }
  },
  mounted() {
    this.setParentProp({ meta: 'defectId', data: 0 })
  }
}
</script>
<style>
h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
