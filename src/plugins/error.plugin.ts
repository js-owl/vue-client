export const errorMixin = {
  methods: {
    showError(type, text?) {
      switch (type) {
        case 'warn':
          document.getElementById('errorBlock').innerHTML =
            '<div id="uazErrorMessage" class="uaz_message uaz_message__warning">' +
            text +
            '</div>'
          this.hideMessage()
          break
        case 'error':
          document.getElementById('errorBlock').innerHTML =
            '<div id="uazErrorMessage" class="uaz_message uaz_message__error">' +
            text +
            '</div>'
          this.hideMessage()
          break
      }
    },
    hideMessage: function() {
      var elem = document.getElementById('uazErrorMessage')
      setTimeout(() => elem.remove(), 3000)
    }
  }
}
