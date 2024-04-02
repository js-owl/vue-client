<template>
  <div
    v-if="currentComponent !== 'Report'"
    class="uaz_parts_block_header_contianer"
  >
    <div class="uaz_parts_block_header__modification">
      {{ $t('diagnosticSession').toUpperCase() }}
    </div>
  </div>

  <DiagnosticList
    v-if="currentComponent === 'List'"
    :setProp="setProp"
    :furtherList="furtherList"
    :setCurrentFurther="setCurrentFurther"
    :findByUid="findByUid"
    :currentFurther="currentFurther"
    :showNotifications="showNotifications"
  />
  <DiagnosticTest
    v-if="currentComponent === 'Test'"
    :currentFurther="currentFurther"
    :currentStep="currentStep"
    :next="next"
    :preview="preview"
    :setProp="setProp"
    :previewDisabled="previewDisabled"
    :addAnswers="addAnswers"
    :answers="answers"
    :currentIndex="currentIndex"
    :isHistory="isHistory"
  />
  <DiagnosticReport
    v-if="currentComponent === 'Report'"
    :defectInterviewId="defectInterviewId"
    :goToBack="goToBack"
  />
  <DiagnosticResult
    v-if="currentComponent === 'Result'"
    :setProp="setProp"
    :currentResult="currentResult"
    :setParentProp="setParentProp"
    :toClearTesting="toClearTesting"
  />

  <Dialog
    :dialogOpen="dialogOpen"
    :buttonClick="closeDialog"
    :beforeClose="closeDialog"
    :data="dialogData"
    :type="dialogType"
  />
  <InstrumentPanel
    :data="currentStep ? currentStep : {}"
    :openAlert="openAlert"
  />
</template>

<script>
import DiagnosticList from '@/components/diagnostic/DiagnosticList.vue'
import DiagnosticTest from '@/components/diagnostic/DiagnosticTest.vue'
import DiagnosticResult from '@/components/diagnostic/DiagnosticResult.vue'
import DiagnosticReport from '@/components/diagnostic/DiagnosticReport.vue'
import InstrumentPanel from '@/components/diagnostic/InstrumentPanel/index.vue'
import Dialog from '@/components/common/UI/Dialog.vue'
import { Request } from '@/services/axios.service'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { types } from '@/store/modules/diagnostic/testing'
function makeId(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export default {
  name: 'DiagnosticSession',
  components: {
    Dialog,
    InstrumentPanel,
    DiagnosticList,
    DiagnosticTest,
    DiagnosticResult,
    DiagnosticReport
  },
  props: [
    'defectId',
    'defectType',
    'defectInterviewId',
    'setParentProp',
    'alertOpen',
    'openAlert'
  ],
  data() {
    return {
      dialogOpen: false,
      dialogData: [],
      dialogType: '',
      notifications: {},
      panelData: {}
    }
  },
  methods: {
    goToBack() {
      this.setProp({ meta: 'currentComponent', data: 'Result' })
    },
    setProp(name, value) {
      this[name] = value
    },
    addDefect(node, children, uid, parentUid, level, notificationsList) {
      return {
        ...node,
        children,
        type: 'defect',
        uid,
        parentUid,
        level,
        notificationsList
      }
    },
    addOperation(node, uid, parentUid, level, notificationsList) {
      return {
        ...node,
        type: 'operation',
        uid,
        parentUid,
        level,
        notificationsList
      }
    },
    setCurrentFurther(uid) {
      this.setProp({ meta: 'currentFurther', data: this.findByUid(uid) })
    },
    findByUid(match, subTree = this.tree) {
      const { uid, children } = subTree

      if (uid === match) {
        return subTree
      }
      if (children && children.length > 0) {
        for (let i = 0; i < children.length; i += 1) {
          const found = this.findByUid(match, children[i])
          if (found) {
            return found
          }
        }
      }
    },
    findByStepIdForParent(stepId, parent) {
      return parent.children.find(child => child.defectItem_step === stepId)
    },
    nextStep(answer, node) {
      const { parentUid } = node
      const { defectItemId_child, next_step } = answer

      if (!parentUid) {
        return
      }

      const parent = this.findByUid(parentUid)

      if (next_step) {
        const nextStep = this.findByStepIdForParent(next_step, parent)
        const ns = this.findDeepestOperation(nextStep)
        return ns
      } else {
        const result = parent.result[defectItemId_child]
        if (result.result_type === 'red') {
          this.setProp({ meta: 'isComplete', data: true })
          return result
        } else {
          if (parent.answer) {
            const nextAnswer = parent.answer.find(
              item => item.linkText.toLowerCase() === 'нет'
            )
            return this.nextStep(nextAnswer, parent)
          } else {
            this.setProp({ meta: 'isComplete', data: true })
            return result
          }
        }
      }
    },
    //TODO can be done through a tree, but I would not want to complicate it even more
    getFurther() {
      const operations = Object.values(this.tree.operation)
      const children = Object.values(this.tree.children)
      const furtherList = operations
        .filter(operation => operation.defectItem_further)
        .map(operation => {
          return children.find(
            child => child.defectItem_step === operation.defectItem_step
          )
        })
      return furtherList
    },
    getByUidByHistory() {
      const history = this.history[this.currentFurther.defectItem_step]
      const current = this.currentStep
      for (let i = 0; i < history.length; i += 1) {
        if (history[i].uid === current.uid) {
          return history[i]
        }
      }
    },
    next() {
      const history = this.history[this.currentFurther.defectItem_step]

      const current = this.currentStep
      for (let i = 0; i < history.length; i += 1) {
        if (history[i].uid === current.uid) {
          if (history[i + 1]) {
            this.setProp({ meta: 'currentStep', data: history[i + 1] })
            this.setProp({ meta: 'currentIndex', data: i + 1 })
            return
          }
        }
      }

      this.createInterviewHistory()
      const result = this.nextStep(this.selectedAnswer, this.currentStep)
      if (result && result.result_type) {
        this.setProp({ meta: 'currentResult', data: result })
      } else {
        this.setProp({ meta: 'currentStep', data: result })
        this.addHistory(result)
      }
    },
    preview() {
      const history = this.history[this.currentFurther.defectItem_step]

      if (this.furtherList.length > 1) {
        if (history[0].uid === this.currentStep.uid) {
          this.setProp({ meta: 'currentIndex', data: 0 })
          this.setProp({ meta: 'currentComponent', data: 'List' })
          return
        }
      }

      const current = this.currentStep
      for (let i = 0; i < history.length; i += 1) {
        if (history[i].uid === current.uid) {
          this.setProp({
            meta: 'currentStep',
            data: history[i - 1] && history[i - 1]
          })
          this.setProp({ meta: 'currentIndex', data: i - 1 })
          return
        }
      }
    },
    findDeepestOperation(parent) {
      const { children } = parent
      if (!children) {
        return parent
      }
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i]
        if (child.type === 'defect') {
          const lastOperation = this.findDeepestOperation(child)
          if (lastOperation) {
            return lastOperation
          }
        } else {
          if (!this.history[this.currentFurther.defectItem_step]) {
            return child
          }

          const found = this.history[this.currentFurther.defectItem_step].find(
            item => item.uid === child.uid
          )

          if (!found) {
            return child
          }
        }
      }
    },
    load(id, parentUid, level, previewOperation, notifications) {
      const self = this
      let notificationsList = notifications
      return new Promise(function(resolve, reject) {
        let children = []
        Request.get(`/diagnostic/getdefect/${id}`)
          .then(async defect => {
            const defect_description = defect.data.defect_description
            if (defect.data.operation) {
              const uid = makeId(5)
              const newLevel = level + 1
              const operations = Object.values(defect.data.operation)
              notificationsList.push(...defect.data.notifications)
              for (let i = 0; i < operations.length; i = i + 1) {
                const operation = operations[i]
                if (i > 0) {
                  notificationsList = []
                }
                if (operation.defect_ref) {
                  children.push(
                    await self.load(
                      operation.defect_ref,
                      uid,
                      newLevel,
                      operation,
                      notificationsList
                    )
                  )
                } else {
                  const childUid = makeId(5)
                  notificationsList.push(...operation.notifications)
                  children.push(
                    self.addOperation(
                      { ...operation, defect_description },
                      childUid,
                      uid,
                      newLevel,
                      notificationsList
                    )
                  )
                }
              }

              resolve(
                self.addDefect(
                  { ...previewOperation, ...defect.data },
                  children,
                  uid,
                  parentUid,
                  level,
                  notificationsList
                )
              )
            } else {
              const childUid = makeId(5)
              resolve(
                self.addOperation(
                  defect.data,
                  childUid,
                  parentUid,
                  level,
                  notificationsList
                )
              )
            }
          })
          .catch(function(error) {
            reject(error)
          })
      })
    },
    createInterviewHistory() {
      let formData = new FormData()

      let step = this.isComplete
        ? 'complete'
        : this.selectedAnswer
        ? this.selectedAnswer.defectItem_step
        : 'noSelectedAnswer'
      let action = this.isComplete
        ? this.currentResult.defectItem_text
        : this.currentStep.diagnosticOperation_action

      formData.append('defectInterview_id', this.defectInterviewId)
      formData.append('logDefect_defect_id', this.defectId)
      formData.append('logDefect_defect_type', this.defectType)
      formData.append('logDefect_action', action)
      formData.append(
        'logDefect_question',
        this.currentStep.diagnosticOperation_question
      )
      formData.append(
        'logDefect_answer',
        this.answers[this.currentFurther.defectItem_step][
          this.answers[this.currentFurther.defectItem_step].length - 1
        ]
      )
      formData.append('logDefect_stage', step)
      Request.post(`/logdefect/create`, formData)
        .then(response => {})
        .catch(function(error) {
          console.log('DiagnosticSession', { error })
        })
    },
    closeDialog() {
      this.dialogOpen = false
      delete this.notifications[this.dialogType]
    },
    showNotifications() {
      const notifications = Object.entries(this.notifications)
      if (notifications.length > 0) {
        let i = 0
        while (i < notifications.length) {
          const type = notifications[i][0]
          const data = notifications[i][1]

          if (data.length > 0) {
            this.dialogOpen = true
            this.dialogType = type
            this.dialogData = data
            return
          }
          i += 1
        }
      }
    },
    addNotifications(node) {
      let newNotifications = {
        dc: [],
        operation: []
      }
      for (let i = 0; i < node.notificationsList.length; i = i + 1) {
        const notification = node.notificationsList[i]
        if (notification.hasOwnProperty('defectItemType_id')) {
          newNotifications['dc'].push(notification)
        } else {
          newNotifications['operation'].push(notification)
        }
      }
      this.notifications = newNotifications
    },
    ...mapMutations({
      setProp: `diagnostic/testing/${types.SET_PROP}`,
      toClearTesting: `diagnostic/testing/${types.SET_CLEAR}`,
      addHistory: `diagnostic/testing/${types.ADD_HISTORY}`,
      addAnswers: `diagnostic/testing/${types.ADD_ANSWERS}`
    })
  },
  watch: {
    currentFurther(newCurrentFurther, oldCurrentFurther) {
      if (newCurrentFurther && newCurrentFurther.defectItem_step) {
        this.addNotifications(newCurrentFurther)
        const history = this.history[this.currentFurther.defectItem_step]
        if (history && history.length > 0) {
          this.setProp({ meta: 'currentStep', data: history[0] })
          this.next()
        } else {
          const firstOperation = this.findDeepestOperation(newCurrentFurther)
          this.addHistory(firstOperation)
          this.setProp({ meta: 'currentStep', data: firstOperation })
        }
      }
    },
    notifications: {
      handler(val) {
        this.showNotifications()
      },
      deep: true
    },
    currentResult(result, oldResult) {
      if (this.isComplete) {
        setTimeout(() => {
          this.createInterviewHistory()
        }, 500)
        this.setProp({ meta: 'currentComponent', data: 'Result' })
      }
    }
  },
  computed: {
    previewDisabled() {
      let disable = false

      const history = this.history[this.currentFurther.defectItem_step]
      disable = history[0].uid === this.currentStep.uid

      if (this.furtherList.length > 1 && disable) {
        disable = false
      }
      return disable
    },
    isHistory() {
      const history = this.history[this.currentFurther.defectItem_step]
      if (history && this.currentIndex < history.length - 1) {
        return true
      }
      return false
    },
    ...mapState({
      currentFurther: state => state.diagnostic.testing.currentFurther,
      tree: state => state.diagnostic.testing.tree,
      currentComponent: state => state.diagnostic.testing.currentComponent,
      furtherList: state => state.diagnostic.testing.furtherList,
      currentStep: state => state.diagnostic.testing.currentStep,
      currentIndex: state => state.diagnostic.testing.currentIndex,
      answers: state => state.diagnostic.testing.answers,
      history: state => state.diagnostic.testing.history,
      selectedAnswer: state => state.diagnostic.testing.selectedAnswer,
      isComplete: state => state.diagnostic.testing.isComplete,
      currentResult: state => state.diagnostic.testing.currentResult
    })
  },
  async mounted() {
    if (Object.keys(this.tree).length === 0) {
      const level = 0
      const data = await this.load(this.defectId, null, level, {}, [])
      this.setProp({ meta: 'tree', data: data })
      const furtherList = this.getFurther()
      if (furtherList.length === 1) {
        this.setProp({ meta: 'currentFurther', data: furtherList[0] })
        this.setProp({ meta: 'currentComponent', data: 'Test' })
      }
      this.setProp({ meta: 'furtherList', data: furtherList })

      console.log({ data })
    }
  },
  updated: function() {},
  beforeUpdated: function() {}
}
</script>
<style scoped>
.uaz_parts_block_header_contianer {
  display: flex;
  justify-content: flex-start;
  background-color: #013e2c;
  color: white;
  font-family: Arial;
  font-size: 10px;
  font-weight: 600;
}
.uaz_parts_block_header__modification {
  flex-grow: 1;
  padding: 2px 4px 3px;
  width: 25%;
}
</style>
