<template>
  <div>
    <label>{{ $t('interval') }}</label>
    <input
      :disabled="isHistory"
      name="interval"
      type="text"
      @change="handleChange"
      :value="value"
      autocomplete="off"
    />
    <br />
  </div>
</template>

<script>
function checkInput(linkText, input, idx) {
  let itemCondition = ''
  let itemValue = ''
  let itemArray = []
  let numbersArray = []
  let inSight = false
  let result = null

  let itemValues = []
  let multipleValues = []
  if (linkText.indexOf(';') >= 0) {
    itemArray = linkText.split(';').filter(function(el) {
      return el !== ''
    })
    if (linkText.indexOf('-') < 0) {
      //Case <2;>10
      itemCondition = '<|>'
    } else {
      //Case 0-2;4-5;7-9
      itemCondition = '-|-|-'
      itemArray.forEach(function(element) {
        var pair = element.split('-').filter(function(el) {
          return el !== ''
        })
        multipleValues.push(pair)
      })
    }
  } else if (linkText.indexOf('-') >= 0) {
    itemArray = linkText.split('-').filter(function(el) {
      return el !== ''
    })

    itemCondition = '-'
    var number1 = itemArray[0].replace(/,/g, '.')
    var number2 = itemArray[1].replace(/,/g, '.')
    itemValues.push(Number(number1))
    itemValues.push(Number(number2))
  } else {
    numbersArray = linkText.split(/[<>=]/).filter(function(el) {
      return el !== ''
    })
    itemArray = linkText.split(/[\d.,]+/).filter(function(el) {
      return el !== ''
    })

    itemCondition = itemArray[0]
    itemValue = parseFloat(String(numbersArray[0]).replace(/,/, '.'))
  }
  switch (itemCondition) {
    case '>':
      if (input > itemValue) {
        result = idx
      }
      break
    case '>=':
      if (input >= itemValue) {
        result = idx
      }
      break
    case '<':
      if (input < itemValue) {
        result = idx
      }
      break
    case '<=':
      if (input <= itemValue) {
        result = idx
      }
      break
    case '=': {
      if (input === itemValue) {
        result = idx
      }
      break
    }
    case '-':
      if (input >= itemValues[0] && input <= itemValues[1]) {
        result = idx
      }
      break
    case '-|-|-':
      inSight = false
      for (var va = 0; va < multipleValues.length; va++) {
        if (input >= multipleValues[va][0] && input <= multipleValues[va][1]) {
          inSight = true

          break
        }
      }
      if (inSight) {
        result = idx
      }

      break
    case '<|>':
      inSight = false
      for (var ia = 0; ia < itemArray.length; ia++) {
        numbersArray = itemArray[ia].split(/[<>=]/).filter(function(el) {
          return el !== ''
        })
        var conditionArray = itemArray[ia].split(/(\d+)/).filter(function(el) {
          return el !== ''
        })
        itemValue = parseFloat(numbersArray[0])

        if (conditionArray[0] === '>' || conditionArray[0] === '<') {
          if (input > itemValue && input < itemValue) {
            inSight = true

            break
          }
        } else if (conditionArray[0] === '=') {
          if (input === itemValue) {
            inSight = true

            break
          }
        }
      }

      if (inSight) {
        result = idx
      }

      break
    default:
      break
  }
  return result
}

export default {
  data() {
    return {}
  },
  props: ['answers', 'textChangeHandler', 'value', 'isHistory'],
  methods: {
    handleChange(event) {
      const value = event.target.value
      if (value) {
        const answer = this.answers.find((answer, idx) => {
          const match = checkInput(answer.linkText, event.target.value, idx)
          if (match !== null) {
            return true
          }
          return false
        })
        // TODO обрабатывать ответы которые не совпадают ни с одним
        this.textChangeHandler(answer, event.target.value)
      }
    }
  },
  watch: {},
  mounted() {},
  updated: function() {},
  beforeUpdated: function() {}
}
</script>
