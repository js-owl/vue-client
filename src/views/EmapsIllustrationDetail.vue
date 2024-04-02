<template>
  <div class="uaz__emaps-breadcrumbs">
    <a
      v-for="(crumb, index) in breadcrumbs"
      :href="
        index > 2
          ? `/emaps/illustration/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/illustration-${crumb.id}`
          : '#'
      "
      :key="crumb.id"
      class="uaz__breadcrumb-item"
    >
      <span v-if="index > 0" class="uaz__breadcrumb-item-arrow"> » </span>
      {{ crumb.name }}
    </a>
  </div>
  <div class="uaz_parts_container">
    <EmapsIllustrationZoom
      :illustrationId="illustrationId"
      :handleClick="handleClick"
    />
  </div>
  <teleport to="#download-pdf">
    <div>
      <el-tooltip
        class="item"
        effect="light"
        :content="$t('downloadPdf')"
        placement="top"
        popper-class="uaz__tooltip uaz__tooltip-top"
      >
        <a
          target="_blank"
          :href="pdf"
          class="illustration_header_icon uaz__icons-pdf uaz__light-icon uaz__icons-illustrations"
        />
      </el-tooltip>
    </div>
  </teleport>
</template>
<script>
import EmapsIllustrationZoom from '@/components/emap/EmapsIllustrationZoom.vue'
import { mapState, mapMutations } from 'vuex'
import { types } from '@/store/modules/standtime'
const productModelId = 23
const productModificationId = 890
const modelName = 'Profi'
const modificationName = '236021000015400'
export default {
  name: 'EmapsIllustrationDetail',
  data() {
    return {
      modelName,
      year: '2020',
      productModelId,
      productModificationId,
      modificationName,
      pdf: '/api/download/electricgroup/pdf'
    }
  },
  props: [],
  components: {
    EmapsIllustrationZoom
  },
  methods: {
    handleClick: function(electricGroup) {
      const href = `/emaps/illustration/detail/model-${this.productModelId}/modification-${this.productModificationId}/year-${this.year}/illustration-${electricGroup.electricGroup_id}`
      window.location.href = href
    },
    handleCrumbClick() {
      this.$router.push('/emaps')
      this.$store.commit('section/SET_PAGE_LEVEL', 0)
    },
    ...mapMutations({
      setProp: `emaps/${types.SET_PROP}`
    })
  },
  computed: {
    ...mapState({
      illustrationId: state => state.emaps.illustrationId,
      breadcrumbs: state => state.emaps.breadcrumbs, //
      token: state => state.authToken
    })
  },
  mounted: function() {
    const { illustrationId } = this.$route.params
    this.pdf = `${this.pdf}/${illustrationId}/${this.token}`
    const modelCrumb = {
      id: 23,
      name: modelName,
      click: this.handleCrumbClick
    }
    const modificationCrumb = {
      id: 890,
      name: modificationName,
      click: this.handleCrumbClick
    }
    const yearCrumb = {
      id: 2020,
      name: this.year,
      click: this.handleCrumbClick
    }

    const breadcrumbs = this.breadcrumbs.slice(3, this.breadcrumbs.length)

    this.setProp({
      meta: 'breadcrumbs',
      data: [...[modelCrumb, yearCrumb, modificationCrumb], ...breadcrumbs]
    })
    this.setProp({ meta: 'illustrationId', data: +illustrationId })
  }
}
</script>
<style scoped>
.uaz__emaps-breadcrumbs {
  margin-bottom: 10px;
  margin-left: 5px;
}
.uaz__breadcrumb-item-arrow {
  position: relative;
  display: inline;
  color: #013e2c;
  font-size: 10px;
}

.uaz__breadcrumbs {
  display: inline-block;
  padding: 10px 5px 0;
}
.uaz__breadcrumb-item {
  position: relative;
  display: inline;
  color: #013e2c;
  font-size: 10px;
  text-decoration: none;
}
</style>
