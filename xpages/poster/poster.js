const { wxml, style } = require('./demo.js')
// const chicun = require("../../utils/device-utils.js")
Page({
  onShareAppMessage() {
    return {
      title: 'wxml-to-canvas',
      path: 'page/weui/example/wxml-to-canvas/wxml-to-canvas'
    }
  },
  data: {
    src: '',
    wxmlTemplate:  wxml('your_img_url'),
    showCanvas: false,
  },
  onLoad() {
    var that = this
    this.widget = this.selectComponent('.widget')
    var url = ''
    this.url = url
    setTimeout(() => {
      that.renderToCanvas()
    }, 500)
  },
  
  renderToCanvas() {
    console.log(wxml(this.url))
    const p1 = this.widget.renderToCanvas({ wxml: wxml(this.url), style })
    p1.then((re) => {
      console.log('container', re.layoutBox)
      this.container = re
    })
  },
  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        width: this.container.layoutBox.width,
        height: this.container.layoutBox.height
      })
    })
  },

  savephoto:function(){
    
  }
})
