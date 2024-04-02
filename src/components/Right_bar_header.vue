<template>
  <div class="icon_right_bar_wrapper">
    <div class="illustration_header_right_bar_part">
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('illustrationPrev')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="showIllustration('previous', isIllustrationPage)"
          :class="[
            'illustration_header_icon icon_previous uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !isIllustrationPage }
          ]"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('illustrationNext')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <div
          @click="showIllustration('next', isIllustrationPage)"
          :class="[
            'illustration_header_icon icon_next uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !isIllustrationPage }
          ]"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('goToModification')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top-left"
      >
        <div
          @click="goToModification(isModificationPage, isIllustrationPage)"
          :class="[
            'illustration_header_icon icon_modification uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !(isModificationPage || isIllustrationPage) }
          ]"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('goToGroup')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top-right"
      >
        <div
          @click="goToGroupPage(isModificationPage, isIllustrationPage)"
          :class="[
            'illustration_header_icon icon_group uaz__light-icon uaz__icons-illustrations',
            { uaz__on: !(isModificationPage || isIllustrationPage) }
          ]"
        ></div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('back')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top-right"
      >
        <div
          @click="getBack"
          :class="[
            'illustration_header_icon icon_back uaz__light-icon uaz__icons-illustrations',
            { uaz__on: this.pageLevel == 0 }
          ]"
        ></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import { mapState } from 'vuex'
export default {
  props: {},
  data() {
    return {
      isIllustrationPage: false,
      isModificationPage: false,
      isMainPage: false,
      illustrationData: {}
    }
  },
  computed: {
    ...mapState('section', ['pageLevel'])
  },
  mounted: function() {
    this.isIllustrationPage = this.$route.params.illustrationId ? true : false
    this.isModificationPage =
      this.$route.params.productModelId &&
      this.$route.params.productModificationId
        ? true
        : false
  },
  methods: {
    showIllustration: function(operation, available) {
      if (available) {
        this.getIllustration().then(() => {
          let id =
            operation == 'previous'
              ? this.illustrationData.prevPartGroup_id
              : this.illustrationData.nextPartGroup_id
          this.$router.push(
            '/parts/illustration/detail' +
              '/' +
              id +
              '/?productModification_id=' +
              this.$route.query.productModification_id +
              '&productModelId=' +
              this.$route.query.productModelId,
            {}
          )
          this.$store.commit('section/SET_PAGE_LEVEL', 2)
        })
      }
    },
    goToModification: function(isModificationPage, isIllustrationPage) {
      if (isIllustrationPage) {
        this.$router.push(
          '/parts/?productModification_id=' +
            this.$route.query.productModification_id +
            '&productModelId=' +
            this.$route.query.productModelId,
          {}
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
      if (isModificationPage) {
        this.$router.push(
          '/parts/?productModification_id=' +
            this.$route.params.productModificationId +
            '&productModelId=' +
            this.$route.params.productModelId,
          {}
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
    },
    goToGroupPage: function(isModificationPage, isIllustrationPage) {
      if (isIllustrationPage) {
        this.$router.push(
          '/parts/models-' +
            this.$route.query.productModelId +
            '/modification-' +
            this.$route.query.productModification_id +
            '/',
          {}
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
      if (isModificationPage) {
        this.$router.push(
          '/parts/models-' +
            this.$route.params.productModelId +
            '/modification-' +
            this.$route.params.productModificationId +
            '/',
          {}
        )
        this.$store.commit('section/SET_PAGE_LEVEL', 1)
      }
    },
    getBack: function() {
      let urlArr = []

      urlArr = this.$route.fullPath.split('/')
      console.log(urlArr, '123434')
      if (urlArr[1] == 'parts' && urlArr[2] == 'search') {
        this.$router.push('/parts')
      }

      if (
        urlArr[1] == 'parts' &&
        urlArr[2] == 'illustration' &&
        urlArr[3] == 'detail'
      ) {
        this.$router.push(
          '/parts/models-' +
            this.$route.query.productModelId +
            '/modification-' +
            this.$route.query.productModification_id +
            '/',
          {}
        )
      }
      if (urlArr[1] == 'parts' && urlArr[2].startsWith('models-')) {
        this.$router.push('/parts/', {})
      }
      if (urlArr[1] == 'flowchart' && urlArr[2].startsWith('models-')) {
        this.$router.push('/flowcharts')
      }
      if (
        urlArr[1] == 'flowcharts' &&
        urlArr[2].startsWith('models-') &&
        urlArr[3].startsWith('modification-')
      ) {
        this.$router.push('/flowcharts')
      }
      if (urlArr[1] == 'flowcharts' && urlArr[2] == 'detail') {
        this.$router.push(
          '/flowchart/models-' +
            this.$route.params.productModelId +
            '/modification-' +
            this.$route.params.productModificationId +
            '/'
        )
      }
      if (urlArr[1] == 'flowcharts' && urlArr[2] == 'search') {
        this.$router.push('/flowcharts')
      }
      if (urlArr[1] == 'emaps' && urlArr[2].startsWith('models-')) {
        this.$router.push('/emaps')
      }
      if (
        urlArr[1] == 'emaps' &&
        urlArr[2].startsWith('models-') &&
        urlArr[3].startsWith('modification-')
      ) {
        this.$router.push('/emaps')
      }
      if (urlArr[1] == 'emaps' && urlArr[2] == 'search') {
        this.$router.push('/emaps')
      }
      if (urlArr[1] == 'diagnostic' && urlArr[2].startsWith('models-')) {
        this.$router.push('/diagnostic')
      }
      if (
        urlArr[1] == 'diagnostic' &&
        urlArr[2].startsWith('models-') &&
        urlArr[3].startsWith('modification-')
      ) {
        this.$router.push('/diagnostic')
      }
      if (urlArr[1] == 'diagnostic' && urlArr[2] == 'search') {
        this.$router.push('/diagnostic')
      }
    },
    getIllustration: function() {
      if (this.$route.params.illustrationId) {
        return Request.get(
          '/partgroup/get/' + this.$route.params.illustrationId,
          {
            params: {
              productModification_id: this.$route.query.productModification_id
            }
          }
        )
          .then(response => {
            console.log(response.data.data)
            this.illustrationData = response.data.data
          })
          .catch(function(error) {})
      }
    }
  },
  watch: {
    isIllustrationPage(newValue, oldValue) {
      if (newValue) {
        this.isIllustrationPage = newValue
      }
    },
    isModificationPage(newValue, oldValue) {
      if (newValue) {
        this.isModificationPage = newValue
      }
    },
    $route(to, from) {
      this.isIllustrationPage = this.$route.params.illustrationId ? true : false
      this.isModificationPage =
        this.$route.params.productModelId &&
        this.$route.params.productModificationId
          ? true
          : false
    }
  }
}
</script>
<style scoped>
.icon_right_bar_wrapper {
  display: flex;
  justify-content: flex-end;
}
.illustration_header_right_bar_part {
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 182px;
  height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: flex-end;
}
.uaz__light-icon {
  cursor: pointer;
  width: 25px;
  height: 25px;
  padding: 1px;
  background-color: #013e2c;
  border-radius: 3px;
  right: -28px;
  top: 0px;
  margin: 1px 2px;
}
.illustration_header_zoom_icon.uaz__icons-preview.uaz__light-icon.uaz__icons-preview.item {
  background-color: #fff;
}
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-illustrations {
  right: 1px;
}
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-off,
.illustration_header_zoom_icon.uaz__light-icon.uaz__icons-resize-on {
  right: 4px;
}
.illustration_header .uaz__light-icon {
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 18px;
  padding: 1px;
  /*background-color: #fff;*/
  border-radius: 0px;
  right: -10px;
  top: 0px;
}
.uaz_button_background_white .uaz__light-icon {
  right: 0px;
  top: -1px;
}

.icon_previous,
.uaz__on.icon_previous {
  background: url('../assets/icons.png') -65px -30px;
}
.icon_next,
.uaz__on.icon_next {
  background: url('../assets/icons.png') -99px -30px;
}
.icon_modification,
.uaz__on.icon_modification {
  background: url('../assets/icons.png') -72px -56px;
}
.icon_group,
.uaz__on.icon_group {
  background: url('../assets/icons.png') -106px -56px;
}
.icon_back,
.uaz__on.icon_back {
  background: url('../assets/icons.png') -140px -56px;
}

.uaz__on.icon_previous {
  background-position: -38px -162px;
}
.uaz__on.icon_next {
  background-position: -72px -162px;
}
.uaz__on.icon_modification {
  background-position: -201px -56px;
}
.uaz__on.icon_group {
  background-position: -201px -82px;
}
.uaz__on.icon_back {
  background-position: -180px -108px;
}

.illustration_header_row {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #013e2c;
}
.illustration_header_icon:focus-visible {
  outline: none;
}
</style>
