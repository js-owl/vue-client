<template>
  <div v-if="furtherList.length > 0">
    <div class="diagnostic-structure__pad">
      <h2 class="diagnostic-structure__headline" style="margin-bottom: 20px">
        {{ $t('circuit') }} #1
      </h2>
      <div class="diagnostic-algorithm__description-title ng-binding">
        {{ $t('selectNext') }}:
      </div>
      <div
        v-if="furtherList.length"
        class="diagnostic-structure__pad diagnostic-algorithm__options"
      >
        <DiagnosticItem
          v-for="item in furtherList"
          :key="item.uid"
          :item="item"
          :currentFurther="currentFurther"
          @click="handleClick(item.uid)"
        />
      </div>
    </div>
    <div class="button-wrap">
      <Button :text="$t('onward')" :handleClick="buttonclick" />
    </div>
  </div>
</template>

<script>
import DiagnosticItem from './DiagnosticItem.vue'
import Button from '@/components/common/UI/Button.vue'

export default {
  components: {
    Button,
    DiagnosticItem
  },
  data() {
    return {}
  },
  props: [
    'setProp',
    'furtherList',
    'findByUid',
    'setCurrentFurther',
    'currentFurther',
    'showNotifications'
  ],
  methods: {
    buttonclick() {
      this.setProp({ meta: 'currentComponent', data: 'Test' })
      this.showNotifications()
    },
    handleClick(uid) {
      this.setCurrentFurther(uid)
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
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
.diagnostic-structure__pad {
  padding: 5px;
  position: relative;
  text-align: left;
}
.diagnostic-algorithm__description-title {
  width: 100%;
  padding: 0;
  white-space: pre-wrap;
  clear: both;
  margin-bottom: 14px;
}
.diagnostic-algorithm__options {
  font-size: 9px;
}
.button-wrap {
  margin-left: 10px;
}
</style>
