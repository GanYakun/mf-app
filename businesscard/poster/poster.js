var api = require("../../utils/api.js")
import {wxml, style} from './demo'
Page({
  data: {
  },
  onLoad() {
    var that = this
    let dangqibannerdata = {
      rootId:551,
      SearchRowNum: 5,
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', dangqibannerdata, 'GET', function (e) {
      that.setData({
        reportOrClassOverFlag: getApp().globalData.imgur + e.data[0].imageVo.imagePath,
      })
    })
    this.widget = this.selectComponent('.widget')
    // wx.showLoading({
    //   title: '加载中',
    // })
    console.log("系统信息",wx.getSystemInfoSync())
    that.setData({
      pageWidth:wx.getSystemInfoSync().windowWidth,
      pageHeight:wx.getSystemInfoSync().windowHeight
    })
  },
  renderToCanvas() {
    var that = this
    let Parameterspassed={
      imgsrc:that.data.reportOrClassOverFlag,
      hedimg:getApp().globalData.imgur+getApp().globalData.userimg,
      qrcode:'https://img-blog.csdnimg.cn/2020110409321014.png#pic_center',
      name:getApp().globalData.username,
      remask:'高级家具顾问',
      phone:'138-8892-2962',
      address:'昆明市五华区高新区王琼路唔月广场3楼昆明市五华区高新区王琼路唔月广场3楼昆明市五华区高新区王琼路唔月广场3楼'
    }
    let wxmlStr = wxml(Parameterspassed);
      console.log("wxmlStr", wxmlStr)
      let pagesize={
        sizewidth :that.data.pageWidth,
        sizeheight :that.data.pageHeight,
        imgsrc:that.data.reportOrClassOverFlag
      }
      let pagesizes = style(pagesize)
      console.log("style",pagesizes)
      
    
      const p1 =that.widget.renderToCanvas({ wxml:wxmlStr, style:pagesizes })
      console.log(p1)
      p1.then((res) => {
        console.log('container', res)
        that.container = res
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
  }
})
