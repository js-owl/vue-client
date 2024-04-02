<template>
  <div class="uaz_parts_container">
    <div class="uaz_parts_content_left_part">
      <div class="uaz_parts_content_groups_table_heading">
        <span>{{ $t('selectGroup').toUpperCase() }}</span>
      </div>
      <div class="uaz_parts_content_groups_table uaz__col-sm-6">
        <div class="uaz__col-sm-6 uaz__groups-column" v-show="firstGroupBlock">
          <div
            :key="group.partGroup_id"
            v-for="group in firstGroupBlock"
            @click.capture="changeGroup(group.partGroup_id)"
            :class="[
              'uaz__row-border',
              { border_active: group.partGroup_id == selectedGroup }
            ]"
          >
            <div
              :class="[
                'uaz__panel-row',
                { group_active: group.partGroup_id == selectedGroup }
              ]"
              @click.capture="changeGroup(group.partGroup_id)"
            >
              <span
                v-show="group.partGroup_group"
                class="uaz_parts_content_groups_table_cell__number uaz__col-sm-1"
              >
                {{ group.partGroup_group }}
              </span>
              <div class="uaz__col-sm-11">
                <span>
                  {{
                    group.partGroup_name_en
                      ? this.$i18n.locale == 'ru'
                        ? group.partGroup_name
                        : group.partGroup_name_en
                      : group.partGroup_name
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="uaz__col-sm-6 uaz__groups-column" v-show="secondGroupBlock">
          <div
            :key="group.partGroup_id"
            v-for="group in secondGroupBlock"
            @click.capture="changeGroup(group.partGroup_id)"
            :class="[
              'uaz__row-border',
              { border_active: group.partGroup_id == selectedGroup }
            ]"
          >
            <div
              :class="[
                'uaz__panel-row',
                { group_active: group.partGroup_id == selectedGroup }
              ]"
              @click.capture="changeGroup(group.partGroup_id)"
            >
              <span
                v-show="group.partGroup_group"
                class="uaz_parts_content_groups_table_cell__number uaz__col-sm-1"
              >
                {{ group.partGroup_group }}
              </span>
              <div class="uaz__col-sm-11">
                <span>
                  {{
                    group.partGroup_name_en
                      ? this.$i18n.locale == 'ru'
                        ? group.partGroup_name
                        : group.partGroup_name_en
                      : group.partGroup_name
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="uaz_parts_content_groups_table_cell"
          v-show="Object.keys(groups).length % 2 !== 0"
        ></div>
      </div>

      <slot name="illustration"></slot>
    </div>
    <div class="uaz_parts_content_right_part">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
export default {
  name: 'SectionDetail',
  data() {
    return {
      selectedGroup: 0
    }
  },
  components: {},
  mounted: function() {
    console.log('groups', this.groups)
  },
  props: ['groups'],
  computed: {
    firstGroupBlock: function() {
      return this.groups.filter(
        (groupName, index) => index < this.groups.length / 2
      )
    },
    secondGroupBlock: function() {
      return this.groups.filter(
        (groupName, index) => index >= this.groups.length / 2
      )
    }
  },
  methods: {
    changeGroup: function(groupId, e) {
      this.$emit('changeGroup', groupId)
      this.selectedGroup = groupId
      var active = document.getElementsByClassName('illustration_inline_active')
      var active2 = document.querySelectorAll('.illustration_active')
      if (active[0]) {
        active[0].classList.remove('illustration_inline_active')
      }
      active2.forEach(item => {
        item.classList.remove('illustration_active')
      })
    }
  }
}
</script>
<style scoped>
.uaz_parts_content_left_part {
  flex: 1 1 0%;
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  height: 100%;
  overflow: hidden;
}
.uaz_parts_content_right_part {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  flex-direction: column;
  background: #cfdbd9;
  overflow-x: hidden;
}
.uaz_parts_content_groups_table_heading {
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  line-height: 17px;
}
.uaz_parts_content_groups_table_heading span {
  margin-left: 5px;
}
.group_active {
  border: 1px solid #013e2c;
  background: #fff !important;
  width: 100%;
  line-height: 15px !important;
}
.uaz_parts_content_groups_table_cell {
  cursor: pointer;
  line-height: 8px;
  border-bottom: 1px solid #fff;
  background: #cfdbd9;
  box-sizing: border-box;
  width: 100%;
}
.uaz_parts_content_groups_table_cell__number {
  text-align: center;
  margin: 0 8px 0 0;
}
/*new styles*/
.uaz__col-sm-1,
.uaz__col-sm-11 {
  float: left;
  position: relative;
  padding-right: 5px;
  padding-left: 5px;
}
.uaz__col-sm-6 {
  width: 50%;
  position: relative;
  padding-right: 5px;
  padding-left: 5px;
}
.uaz__col-sm-11 {
  width: 91.66666667%;
}
.uaz__col-sm-1 {
  width: 6.33333333%;
}
.uaz__panel-row {
  line-height: 17px;
  margin-bottom: -1px;
  display: -ms-flexbox;
  display: flex;
}
.uaz_parts_content_groups_table {
  border-right: 1px solid #b8bdc0;
  border-bottom: 1px solid #b8bdc0;
  border-left: 1px solid #b8bdc0;
  text-transform: uppercase;
  background: #cfdbd9;
  float: left;
  padding: 0;
  width: 100%;
}
.uaz_parts_content_groups_table:after,
.uaz_parts_content_groups_table:before {
  display: table;
  content: ' ';
}
.uaz_parts_content_groups_table:after {
  clear: both;
}
@media (min-width: 8px) {
  .uaz__col-sm-1,
  .uaz__col-sm-11,
  .uaz__col-sm-6 {
    float: left;
  }
}
.uaz__row-border {
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
.border_active {
  border-bottom: 2px solid #fff;
}
.uaz__row-border:first-child {
  border-top: 1px solid #fff;
}
.uaz__groups-column {
  padding: 0 !important;
}
.uaz__groups-column:first-child {
  border-right: 2px solid #fff;
}
</style>
