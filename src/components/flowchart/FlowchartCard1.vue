<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <div class="uaz__form-group">
        <label for="uaz__number" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('flowchartNumber') }}
        </label>

        <div class="uaz__card__text">
          <span>{{ code }}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="uaz__form-group">
        <label for="uaz__name" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('flowchartName') }}
        </label>
        <div class="uaz__card__text">
          <span>{{ name }}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="uaz__form-group">
        <label for="uaz__otn" class="uaz__text-left uaz__bold uaz__label">
          {{ $t('model') }}
        </label>
        <div v-if="list.length > 0">
          <ul class="uaz__parts-list">
            <li
              class="uaz__parts-elements"
              v-for="(item, index) in list"
              :key="index"
            >
              <span>{{ item }}</span>
            </li>
          </ul>
          <div @click="headerClick()" class="models-button-show-all-list">
            {{ this.active ? '...' : 'cкрыть' }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      active: true
    }
  },
  components: {},
  props: ['parts', 'code', 'name'],
  methods: {
    headerClick() {
      this.active = !this.active
    }
  },
  computed: {
    list: function() {
      let list = []
      if (this.active) {
        list = this.parts.filter(function(item, index) {
          if (index < 1) {
            return true
          }
          return false
        })
      } else {
        list = this.parts
      }
      return list
    }
  },
  mounted() {
    console.log('Model', this.parts)
  }
}
</script>
<style scoped>
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
.el-row {
  margin-bottom: 20px;
}
</style>
