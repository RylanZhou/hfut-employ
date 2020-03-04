Component({
  properties: {
    data: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },

  // ready() {
  //   console.log(this.properties.index)
  // },

  methods: {
    handleTapDetail() {
      this.triggerEvent('on-detail', {
        jobid: this.properties.data.jobid,
        cid: this.properties.data.cid,
        index: this.properties.index
      })
    }
  }
})
