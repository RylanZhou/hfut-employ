Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    headerOpacity: {
      type: Number,
      value: 1
    },
    withBack: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    handleJumpBack() {
      this.triggerEvent('back')
    }
  }
})
