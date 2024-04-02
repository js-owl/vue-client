<template>
  <carousel :items-to-show="4">
    <slide
      :class="[
        'carousel_slide_' + illustration.partGroup_id,
        {
          uaz_carousel_slide_active:
            illustration.partGroup_id == $route.params.illustrationId
        }
      ]"
      @click="goNext(illustration.partGroup_id)"
      v-for="(illustration, key) in illustrations"
      :key="key"
    >
      <img
        :src="
          '/storage/img/partgroups/partgroup_' +
            illustration.partGroup_id +
            '.png'
        "
      />
      <!--this.$router.push('/parts/search/'+ '?query=' + this.searchValue);-->
      <span class="uaz__illustration-number">
        {{ illustration.partGroup_group }}-
        {{ illustration.partGroup_subgroup }} -
        {{ formatTointeger(illustration.partGroup_imageGroup) }}-
        {{ illustration.partGroup_imageID }}
      </span>
    </slide>
    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>

<script>
import { Request } from '@/services/axios.service'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'Illustrations_carousel',
  data() {
    return {
      illustrations: {}
    }
  },
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  mounted: function() {
    this.modificationID = this.getParamFromURL('modification')
    this.getIllustration()
  },
  methods: {
    formatTointeger: function(val) {
      return parseInt(val)
    },
    //TODO make it global
    getParamFromURL: function(param) {
      let urlArr = this.$router.currentRoute._value.path.split('/')
      let modification = 0
      urlArr.forEach(elem => {
        if (elem.startsWith(param)) {
          modification = elem.split('-')[1]
        }
      })
      return modification
    },
    getIllustration: function() {
      Request.get(
        'partgroup/illustration/?productModification_id=' +
          this.$route.query.productModification_id,
        {}
      )
        .then(response => {
          this.illustrations = response.data.data
        })
        .catch(function(error) {})
    },
    goNext: function(illustration) {
      this.$router.push(
        '/parts/illustration/detail' +
          '/' +
          illustration +
          '/?productModification_id=' +
          this.$route.query.productModification_id +
          '&productModelId=' +
          this.$route.query.productModelId,
        {}
      )
      this.$store.commit('section/SET_PAGE_LEVEL', 2)
      // setTimeout(() => {
      //   window.main.resize()
      //   window.main.reset()
      // }, 15000)
    }
  }
}
</script>
<style scoped>
.uaz_carousel_slide_active,
.carousel__slide:hover {
  border: 3px solid #013e2c;
}
.uaz__illustration-number {
  position: absolute;
  right: 8px;
  bottom: 2px;
}
</style>
