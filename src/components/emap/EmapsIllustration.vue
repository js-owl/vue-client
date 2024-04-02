<template>
  <div id="mainViewContainer" style="width: 100%; height: 100%">
    <div ref="space" v-html="svg" />
  </div>
  <div
    id="uaz__context-menu"
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`,
      position: 'absolute'
    }"
  >
    <div id="uaz__context-menu" class="uaz__context-menu" v-if="showModal">
      <span
        class="uaz__emaps-not-found"
        v-if="electricgroups.length === 0"
      ></span>

      <ul class="uaz__context-menu__items">
        <li
          class="uaz__context-menu__item"
          v-for="item in electricgroups"
          :key="item.electricGroupType_id"
        >
          <a href="#" class="uaz__context-menu__link" @click="handleClick(item)"
            ><i class="fa fa-eye"></i>
            {{ item.electricGroup_name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Request } from '@/services/axios.service'
import { mapState, mapMutations } from 'vuex'
import { types } from '@/store/modules/standtime'

import axios from 'axios'
const config = {
  headers: { 'Access-Control-Allow-Origin': '*' }
}
import { fromEvent, merge } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'

const documentOb$ = fromEvent(document, 'click')
export default {
  props: ['illustrationId', 'handleClick'],
  data() {
    return {
      //TODO : put in store
      widthButtonState: 'normal',
      isFullScreen: false,
      electricgroups: [],
      position: {
        x: 0,
        y: 0
      },
      showModal: false
    }
  },
  mounted: async function() {
    console.log('EI.vue 64 ~ mounted')
    this.onBacklight()
  },
  components: {},
  methods: {
    searchNote: function(noteId) {
      for (var m = 0; m < this.notes.length; m++) {
        if (noteId == this.notes[m].electricGroupNote_id) {
          return {
            note: this.notes[m],
            key: m
          }
        }
      }

      return false
    },
    openModal: function(e) {
      this.showModal = true
      this.position.x = e.offsetX
      this.position.y = e.offsetY + 20
    },
    loadElectricgroup(id) {
      this.electricgroups = []
      Request.get(`/electricgroup`, {
        params: {
          electricGroup_ref: id
        }
      })
        .then(response => {
          this.electricgroups = response.data.data
          console.log(
            'EI.vue 95 ~ loadElectricgroup ~ RES',
            this.electricgroups
          )
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    onBacklight() {
      console.log('EI.vue 105 ~ onBacklight ~ BEGIN')
      setTimeout(() => {
        const elements = document.querySelectorAll('g[notetype]')
        console.log('EI.vue 108 ~ elements:', elements)

        const clicks$ = []
        for (var i = 0; i < elements.length; i++) {
          var noteid = elements[i].getAttribute('noteid').split(',')

          for (var j = 0; j < noteid.length; j++) {
            var data = this.searchNote(noteid[j])
            console.log('EI.vue 116 ~ data:', data)

            if (data) {
              elements[i].setAttribute('style', 'cursor: pointer !important;')
              elements[i].setAttribute(
                !data.note.isLink ? 'selected' : 'isLink',
                true
              )

              elements[i].setAttribute('electricGroupNote_id', noteid[j])

              clicks$.push(fromEvent(elements[i], 'click'))
            }
          }
        }
        console.log('EI.vue 131 ~ clicks$:', clicks$)

        /*
        Collect all mouse click, if coords are equal - click within red square - 
        */
        const notesOb$ = merge(...clicks$)
        console.log('EI.vue 137 ~ notesOb$:', notesOb$)

        documentOb$
          .pipe(withLatestFrom(notesOb$))
          .subscribe(([documentEvent, noteEvent]) => {
            this.showModal = false
            if (
              documentEvent.offsetX === noteEvent.offsetX &&
              documentEvent.offsetY === noteEvent.offsetY
            ) {
              this.openModal(noteEvent)

              const electricGroupNote_id = noteEvent.target.parentNode.getAttribute(
                'electricGroupNote_id'
              )
              this.loadElectricgroup(electricGroupNote_id)
            }
          })
      }, 100)
    },
    load: async function() {
      await Request.get(`/electricgroup/get/${this.illustrationId}`, {
        params: {}
      })
        .then(response => {
          const emapCrumb = {
            id: response.data.data.electricGroup_id,
            name: response.data.data.electricGroup_name,
            click: () => {
              console.log('click')
            }
          }

          let indexEmapCrumb = this.breadcrumbs.findIndex(
            item => +item.id === +response.data.data.electricGroup_id
          )

          if (indexEmapCrumb === -1) {
            indexEmapCrumb = this.breadcrumbs.length
          }

          const breadcrumbs = this.breadcrumbs.slice(0, indexEmapCrumb)
          this.setProp({
            meta: 'svgPath',
            data: response.data.data.electricGroup_imagePreview
          })
          this.setProp({ meta: 'notes', data: response.data.data.notes.main })
          this.setProp({
            meta: 'illustrationName',
            data: response.data.data.electricGroup_name
          })
          this.setProp({
            meta: 'breadcrumbs',
            data: [...breadcrumbs, emapCrumb]
          })
        })
        .catch(function(error) {
          console.log('error', error)
        })

      await axios
        .get(`/storage/${this.svgPath}`, config)
        .then(response => {
          this.svg = response.data
          console.log('🚀 ~ load:function 191 ~ this.svg:', this.svg)
          this.setProp({ meta: 'svg', data: response.data })

          this.onBacklight()
        })
        .catch(data => {
          console.log({ data })
        })
    },
    ...mapMutations({
      setProp: `emaps/${types.SET_PROP}`
    })
  },
  watch: {
    illustrationId: async function(newValue, oldValue) {
      await this.load()
    }
  },
  computed: {
    ...mapState({
      breadcrumbs: state => state.emaps.breadcrumbs,
      notes: state => state.emaps.notes,
      svgPath: state => state.emaps.svgPath,
      svg: state => state.emaps.svg
    })
  },
  updated: function() {}
}
</script>

<style scoped>
.emaps-links {
  position: absolute;
}

.uaz__context-menu {
  display: block;
  position: fixed;
  z-index: 10;
  padding: 12px 0;
  width: auto;
  background-color: #fff;
  border: 1px solid #b8bdc0;
  box-shadow: 1px 1px 2px #cfcfcf;
}
.uaz__context-menu__items {
  list-style: none;
  margin: 0;
  padding: 0;
}
.uaz__context-menu__item {
  display: block;
  margin-bottom: 4px;
}
.uaz__context-menu__link {
  display: block;
  padding: 4px 12px;
  color: #013e2c;
  text-decoration: none !important;
}
</style>
