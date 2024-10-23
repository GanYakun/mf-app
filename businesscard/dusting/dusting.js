import requestCenter from '../../http/request-center'
const app = getApp()
var api = require("../../utils/api.js")

import {
  wxml,
  style
} from './demo.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgur: app.globalData.imgur,
    swiperIndex:0,
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad:async function (options) {
      let getFansList = await requestCenter.getFansList({})
      this.setData({
        fansList:getFansList
      })
      //获取海报的背景图
    let dangqibannerdata = {
      rootId: 42, //正式服的id
      // rootId:551,       //测试服id
      SearchRowNum: 5,
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', dangqibannerdata, 'GET',(e)=> {
      this.setData({
        phoneicon: getApp().globalData.imgur + e.data[0].imageVo.imagePath,
        addressicon: getApp().globalData.imgur + e.data[1].imageVo.imagePath,
      })
    })
  },

  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.currentItemId,
      scrollId:'scroll'+e.detail.currentItemId,
    })
  },

  //scroll子选项点击事件
  scrollTap(event){
    var fansList = this.data.fansList
    var id = fansList[event.currentTarget.dataset.index].id
    var arr = fansList.filter(obj => obj.posterImgPath)
    var index = arr.findIndex(obj=>obj.id==id)
    this.setData({
      currentIndex:index,
      scrollId:'scroll'+event.currentTarget.dataset.index
    })
  },

  async  renderToCanvas() {
    let getCard = await this.getCard()
    let fansList = this.data.fansList
    let arr = fansList.filter(obj => obj.posterImgPath)
    let item = arr[this.data.currentIndex]
    console.log(item)
    console.log(arr,this.data.swiperIndex,this.data.imgur+JSON.parse(item.posterImgPath)[0].path)
    let brokerBackgroundImagePath =this.data.imgur+JSON.parse(item.posterImgPath)[0].path
    console.log(getCard)
    if(!getCard.headPortraitPath){
      app.showToastMessage('名片未上传头像')
      return false
    }else if(!getCard.weixinImagePath){
      app.showToastMessage('名片未上传微信二维码')
      return false
    }
    let widget = this.selectComponent('.widget')
    let srcData = {
      brokerBackgroundImagePath:brokerBackgroundImagePath,
      hedimg:this.data.imgur+getCard.headPortraitPath,
      phoneicon: this.data.phoneicon,
      addressicon: this.data.addressicon,
      qrcode: this.data.imgur+getCard.weixinImagePath,
      name: getCard.name||'',
      remask: getCard.position||'',
      phone: getCard.phone||app.globalData.phone,
      address: getCard.storeName||'木菲总店',
      explain:item.expText||''
    }
    let wxmlData = wxml(srcData);
    console.log(wxmlData)
    let ratio = 750 / wx.getSystemInfoSync().windowWidth
      let pagesize = {
        sizewidth: 750,
        sizeheight: 1340,
      }
      let pageSizes = style(pagesize)
      console.log("style", pageSizes)
    const p1 = widget.renderToCanvas({ wxml:wxmlData, style:pageSizes })
    p1.then((res) => {
      const p2 = widget.canvasToTempFilePath({fileType:'png', quality:1})
    p2.then(result => {
      console.log(result.tempFilePath)
      wx.navigateTo({
        url: '../posterimage/posterimage?transformation=' + result.tempFilePath+'&type='+'haibao',
      })
    // this.setData({
    //   src: result.tempFilePath,
    //   width: res.layoutBox.width,
    //   height: res.layoutBox.height
    // })
  })
  this.setData({
    isShowLoding:false
  })
    })
  
},

getCard: function () {
  return new Promise((resove, reject) => {
    let datacard = {
      memberId: app.globalData.memberid
      // memberId: 1328
    }
    api.request('/rest/shareApi/getBusinessCard', datacard, 'GET', function (e) {
      if (e.data) {
        resove(e.data.businessCard)
      } else {
        wx.showModal({
          title: '请先生成名片',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/businesscard/newmake_card/newmake_card',
              })
            } else {
              console.log('点击取消回调')
            }
          }
        })
      }
    })
  })

},
})