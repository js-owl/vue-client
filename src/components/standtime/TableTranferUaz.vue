<template>
  <div class="chosen_standtime_wrapper">
    <div class="chosen_standtime_left_bar">
      <div
        :id="'time__' + row.laborTime_id"
        :key="row.laborTime_id"
        v-for="row in standtimesToChoose"
        @click="addToChooseList(row)"
        :class="['chosen_standtime_left_bar__line']"
      >
        {{ row.laborTime_name }}
      </div>
    </div>
    <div class="chosen_standtime_navigation">
      <div @click="moveRight()" class="chosen_standtime_navigation__right">
        >
      </div>
      <div @click="moveLeft()" class="chosen_standtime_navigation__left">
        &lt;
      </div>
    </div>
    <div class="chosen_standtime_right_bar">
      <div
        :id="'time_right__' + row.laborTime_id"
        @click="addToChooseListRight(row)"
        :key="row.laborTime_id"
        v-for="row in chosenStandtimes"
        class="chosen_standtime_left_bar__line"
      >
        {{ row.laborTime_name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { errorMixin } from '@/plugins/error.plugin'
export default {
  data() {
    return {
      list: [],
      value: [],
      standtimesToChoose: this.data,
      chosenStandtimes: [],
      standtimesToAdd: [],
      standtimesToRemove: []
    }
  },
  props: ['data', 'selectedItems'],
  mounted: function() {
    if (this.selectedItems) {
      this.chosenStandtimes = this.selectedItems
    }
  },
  methods: {
    addToChooseList: function(selectedItem) {
      var htmlElement = document.getElementById(
        'time__' + selectedItem.laborTime_id
      )
      if (
        !this.standtimesToAdd.filter(
          elem => elem.laborTime_id == selectedItem.laborTime_id
        ).length
      ) {
        this.standtimesToAdd.push(selectedItem)
        htmlElement.classList.add('chosen_standtime_left_bar__active')
      } else {
        this.standtimesToAdd = this.arrayRemove(
          this.standtimesToAdd,
          selectedItem
        )
        htmlElement.classList.remove('chosen_standtime_left_bar__active')
      }
    },
    addToChooseListRight: function(selectedItem) {
      var htmlElement = document.getElementById(
        'time_right__' + selectedItem.laborTime_id
      )
      if (
        !this.standtimesToRemove.filter(
          elem => elem.laborTime_id == selectedItem.laborTime_id
        ).length
      ) {
        this.standtimesToRemove.push(selectedItem)
        htmlElement.classList.add('chosen_standtime_right_bar__active')
      } else {
        this.standtimesToRemove = this.arrayRemove(
          this.standtimesToRemove,
          selectedItem
        )
        htmlElement.classList.remove('chosen_standtime_right_bar__active')
      }
    },
    arrayRemove: function(arr, value) {
      console.log(arr, value, 'as')
      return arr.filter(function(ele) {
        return ele.laborTime_id !== value.laborTime_id
      })
    },
    clear: function() {
      this.chosenStandtimes = []
      this.standtimesToAdd = []
      this.standtimesToRemove = []
    },
    moveRight: function() {
      this.standtimesToAdd.forEach(element => {
        let isExist = false
        this.chosenStandtimes.forEach(element2 => {
          if (element2.laborTime_id == element.laborTime_id) {
            isExist = true
          }
        })
        if (!isExist) {
          this.chosenStandtimes.push(element)
          this.standtimesToChoose = this.arrayRemove(
            this.standtimesToChoose,
            element
          )
        } else {
          errorMixin.methods.showError('warn', this.$t('standtimeSome'))
        }
      })
      this.standtimesToAdd = []
      var activeLeft = document.querySelectorAll(
        '.chosen_standtime_left_bar__active'
      )
      activeLeft.forEach(item => {
        item.classList.remove('chosen_standtime_left_bar__active')
      })
      this.$emit(
        'selectElements',
        this.chosenStandtimes,
        this.standtimesToChoose
      )
    },
    moveLeft: function() {
      if (this.standtimesToRemove && this.standtimesToRemove.length) {
        this.standtimesToRemove.forEach(element => {
          this.standtimesToChoose.push(element)
          this.chosenStandtimes = this.chosenStandtimes.filter(element2 => {
            return !(element2.laborTime_id == element.laborTime_id)
          })
        })
        this.standtimesToRemove = []
        this.standtimesToAdd = []
        var activeRight = document.querySelectorAll(
          '.chosen_standtime_right_bar__active'
        )
        activeRight.forEach(item => {
          item.classList.remove('chosen_standtime_right_bar__active')
        })
        this.$emit('selectElements', this.chosenStandtimes)
      }
    }
  },
  watch: {
    data: function(newValue, oldValue) {
      this.standtimesToChoose = newValue
    },
    selectedItems: function(newValue, oldValue) {
      this.chosenStandtimes = this.selectedItems
    }
  },
  computed: {
    ...mapState({
      selected: state => state.standtime.selected
    })
  }
}
</script>

<style>
.chosen_standtime_wrapper {
  width: 900px;
  width: 100%;
  display: flex;
  padding-right: 5px;
  padding-left: 5px;
}
.chosen_standtime_left_bar__line {
  cursor: pointer;
  border-bottom: 1px solid white;
  display: flex;
  border: 2px solid transparent;
  cursor: pointer;
  min-height: 17px;
  line-height: 17.8px;
  border-bottom: 1px solid #fff;
  padding-bottom: 1px;
}
.chosen_standtime_left_bar__active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
}
.chosen_standtime_right_bar__active {
  border: 1px solid #013e2c !important;
  background: #fff !important;
}
.chosen_standtime_left_bar {
  /*width: 47%;*/
  border: 1px solid #b8bdc0;
  height: 190px;
  overflow: auto;
}
.chosen_standtime_right_bar {
  /*width: 47%;*/
  border: 1px solid #b8bdc0;
  height: 190px;
  overflow: auto;
}
.chosen_standtime_left_bar,
.chosen_standtime_right_bar {
  max-width: 48%;
  flex: 0 0 48%;
}
.chosen_standtime_navigation {
  /*width: 6%;*/
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column wrap;
  flex-flow: column wrap;
  justify-content: center;
  max-width: 4%;
  flex: 0 0 4%;
}
.chosen_standtime_navigation__right,
.chosen_standtime_navigation__left {
  margin-bottom: 4px;
  width: 21px;
  height: 20px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
  background-color: #013e2c;
  border: 1px solid #013e2c;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out, #b8bdc0 0.15s ease-in-out;
  /* middle of button */
  display: block;
  margin-left: auto;
  margin-right: auto;
}
/*scroll*/
.chosen_standtime_left_bar,
.chosen_standtime_right_bar {
  overflow-y: auto;
  overflow-x: hidden;
}
html {
  --scrollbarBG: #cfdbd9;
  --thumbBG: #7fa099;
}
.chosen_standtime_left_bar::-webkit-scrollbar,
.chosen_standtime_right_bar::-webkit-scrollbar {
  width: 20px;
  overflow: hidden;
}
.chosen_standtime_left_bar::-webkit-scrollbar-track,
.chosen_standtime_right_bar::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.chosen_standtime_left_bar::-webkit-scrollbar-thumb,
.chosen_standtime_right_bar::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 8px;
  border: 5px solid var(--scrollbarBG);
  background-clip: content-box;
}
</style>
