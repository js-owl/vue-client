<template>
  <div class="uaz_parts_content_groups_table_heading_right">
    <div
      class="uaz_parts_content_table_heading_cell uaz_parts_content_table_heading_cell_group"
    >
      {{ $t('group').toUpperCase() }}
    </div>
    <div
      class="uaz_parts_content_table_heading_cell uaz_parts_content_table_heading_cell_subgroup"
    >
      {{ $t('subgroup').toUpperCase() }}
    </div>
    <div
      class="uaz_parts_content_table_heading_cell uaz_parts_content_table_heading_cell_pic"
    >
      {{ $t('imgNumberAbrv').toUpperCase() }}
    </div>
    <div
      class="uaz_parts_content_table_heading_cell uaz_parts_content_table_heading_cell_name"
    >
      <span class="margin_fix">{{ $t('name').toUpperCase() }}</span>
    </div>
    <div
      class="uaz_parts_content_table_heading_cell uaz_parts_content_table_heading_cell_info"
    >
      {{ $t('note').toUpperCase() }}
    </div>
  </div>
  <div
    id="uaz_parts_content_groups_table_right_id_right"
    class="uaz_parts_content_groups_table_right"
  >
    <div
      :id="'illustration_inline_' + key"
      @click="
        selectIllustrationInline(
          key,
          row.partGroup_id,
          row.partGroup_group,
          String(row.partGroup_subgroup).padStart(2, '0'),
          row.partGroup_group +
            '-' +
            row.partGroup_subgroup +
            '-' +
            formatTointeger(row.partGroup_imageGroup) +
            '-' +
            row.partGroup_imageID
        )
      "
      @dblclick="selectIllustrationDetail(row.partGroup_id)"
      :key="key"
      v-for="(row, key) in data"
      class="uaz_parts_content_groups_table_row"
    >
      <div
        class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_heading_cell_group"
      >
        {{ row.partGroup_group }}
      </div>
      <div
        class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_heading_cell_subgroup"
      >
        {{ String(row.partGroup_subgroup).padStart(2, '0') }}
      </div>
      <div
        class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_heading_cell_pic"
      >
        {{
          [
            row.partGroup_group,
            row.partGroup_subgroup,
            formatTointeger(row.partGroup_imageGroup),
            row.partGroup_imageID
          ].join('-')
        }}
      </div>
      <div
        :class="[
          'uaz_parts_content_groups_table_cell_right uaz_parts_content_table_heading_cell_name',
          { uaz_parts_content_groups_table_italic: row.description }
        ]"
      >
        {{
          this.$i18n.locale == 'ru' ? row.partGroup_name : row.partGroup_name_en
        }}
      </div>
      <div
        class="uaz_parts_content_groups_table_cell_right uaz_parts_content_table_heading_cell_info uaz_parts_content_groups_table_italic"
      >
        {{
          row.description_en
            ? this.$i18n.locale == 'ru'
              ? row.description
              : row.description_en
            : row.description
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'SectionDetailTable',
  data() {
    return {}
  },
  components: {},
  props: ['data', 'onDblclick'],
  computed: {
    ...mapMutations({
      selectedGroupMutation: 'filters/SET_GROUP'
    }),
    ...mapMutations({
      selectedSubgroupMutation: 'filters/SET_SUBGROUP'
    }),
    ...mapMutations({
      selectedImageIDMutation: 'filters/SET_IMAGE_ID'
    })
  },
  mounted() {},
  methods: {
    formatTointeger: function(val) {
      return parseInt(val)
    },
    selectIllustrationInline: function(
      id,
      partGroup,
      groupName,
      subgroupName,
      imageName
    ) {
      this.selectedIllustration = id
      var el = document.getElementById('illustration_' + id)
      var elInline = document.getElementById('illustration_inline_' + id)
      var active = document.getElementsByClassName('illustration_inline_active')
      var zoomedPic = document.getElementById('zoomPic')
      zoomedPic.src = '/storage/img/partgroups/partgroup_' + partGroup + '.png'
      var active2 = document.querySelectorAll('.illustration_active')
      if (active[0]) {
        active[0].classList.remove('illustration_inline_active')
      }
      active2.forEach(item => {
        item.classList.remove('illustration_active')
      })

      el.classList.add('illustration_active')
      elInline.classList.add('illustration_inline_active')
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      this.$store.commit('filters/SET_GROUP', groupName)
      this.$store.commit('filters/SET_SUBGROUP', subgroupName)
      this.$store.commit('filters/SET_IMAGE_ID', imageName)
    },
    selectIllustrationDetail: function(id) {
      this.onDblclick(id)
    }
  }
}
</script>
<style scoped>
.uaz_parts_content_groups_table_heading_right {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  height: 17px;
  line-height: 17px;
}
.uaz_parts_content_table_heading_cell {
  margin-left: 4px;
}

.uaz_parts_content_table_heading_cell_group {
  width: 65px;
  text-align: center;
}
.uaz_parts_content_table_heading_cell_subgroup {
  width: 100px;
  text-align: center;
}
.uaz_parts_content_table_heading_cell_pic {
  width: 100px;
  text-align: left;
}
.uaz_parts_content_table_heading_cell_name {
  width: 50%;
}
.uaz_parts_content_table_heading_cell_info {
  width: 50%;
}

.uaz_parts_content_groups_table_right {
  overflow-y: auto;
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  /*overflow-y: scroll;*/
  overflow-x: hidden;
  text-transform: uppercase;
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.uaz_parts_content_groups_table_right::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}

.uaz_parts_content_groups_table_row {
  display: flex;
  width: 100%;
  background: #cfdbd9;
  border-top: 1px solid #fff; /*illustration - right block*/
}
.uaz_parts_content_groups_table_row:last-child {
  border-bottom: 1px solid #fff; /*illustration - right block*/
}
.uaz_parts_content_groups_table_cell_right {
  padding: 4px 4px 4px 0px; /*illustration - right block*/
  cursor: pointer;
  background: #cfdbd9;
  box-sizing: border-box;
  margin-left: 5px;
  border-right: 1px solid white; /*illustration - right block- table right line*/
}
.uaz_parts_content_groups_table_cell_right:last-child {
  border-right: 0px; /*illustration - right block- table right line*/
}
.margin_fix {
  margin-left: 4px;
}
.illustration_inline_active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
}
.illustration_inline_active .uaz_parts_content_groups_table_cell_right {
  background: #fff !important;
}
.uaz_parts_content_groups_table_right {
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  /*overflow-y: scroll;*/
  overflow-x: hidden;
}
.uaz_parts_content_groups_table_italic {
  font-style: italic;
}
</style>
