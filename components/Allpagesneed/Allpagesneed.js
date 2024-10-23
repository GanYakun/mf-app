// components/Allpagesneed/Allpagesneed.js
var app = getApp()
var api = require("../../utils/api.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isone: {
      type: Number,
      value: 1
    },
    istwo: {
      type: Number,
      value: 1
    },
    isstyle: {
      type: String,
      value: ''
    },
  },
  lifetimes: {
    // async show(){
    //   console.log("执行吗")
    //   if(app.globalData.isbusVard.requested){
    //     this.setData({
    //       judeCard:app.globalData.isbusVard.judeCard
    //     })
    //   }else{
    //     let busCard = await app.busCard()
    //     this.setData({
    //       judeCard:app.globalData.isbusVard.judeCard?app.globalData.isbusVard.judeCard:0,
    //     })
    //   }

    // },

  },
  pageLifetimes: {
    async show() {
      this.setData({
        shareId: app.globalData.shareid,
      })
      if (app.globalData.isbusVard.requested) {
        this.setData({
          judeCard: app.globalData.isbusVard.judeCard
        })
      } else {
        let busCard = await app.busCard()
        this.setData({
          judeCard: app.globalData.isbusVard.judeCard ? app.globalData.isbusVard.judeCard : 0,
        })
      }

    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    shareId: app.globalData.shareid,
    isbusVard: app.globalData.isbusVard,
    phone: app.globalData.callPhone
  },

  /**
   * 组件的方法列表
   */
  methods: {
    kefu: function () {
      wx.navigateTo({
        url: '/xpages/contact/contact',
      })
    },
    call: async function (el) {
      if(this.data.judeCard && this.data.shareId) {
        let getBusinessCard = await this.getBusinessCard()
        if (getBusinessCard.status == 500) {
          wx.showToast({
            title: 'TA还没有生成名片',
            icon: 'none',
            duration: 2000,
          })
          return false
        }
        let phone = getBusinessCard.data.businessCard.phone
        wx.makePhoneCall({
          phoneNumber: phone,
          success: function () {
            console.log('成功拨打电话')
          }
        })
        return
      }
      let phone = '0871-68123333'
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          console.log('成功拨打电话')
        }
      })
    },

    //查询分享人的名片信息
    getBusinessCard() {
      return new Promise((resove, reject) => {
        api.newget('/rest/shareApi/getBusinessCard', {
          memberId: app.globalData.shareid
        }, 'GET', (res) => {
          if (res) {
            resove({
              status: res.code,
              data: res.data
            })
          } else {
            reject({
              reason: 400
            })
          }
        })
      })

    },

    huadongzhiding: function () {
      wx.navigateTo({
        url: '/xpages/budgetquotation/budgetquotation?id=' + 203 + '&toptext=' + '预算报价'
      })
    },

    //不显示那三个按钮
    close() {
      this.setData({
        ishide: true
      })
    },
    hidezujian: function (e) {
      let that = this
      let hide = e.currentTarget.dataset.ishide
      console.log(hide)
      if (hide) {
        that.setData({
          ishide: false
        })
      } else {
        that.setData({
          ishide: true
        })
      }

    },
    async card() {
      if (this.data.judeCard && this.data.shareId) {
        let getBusinessCard = await this.getBusinessCard()
        if (getBusinessCard.status == 500) {
          wx.showToast({
            title: 'TA还没有生成名片',
            icon: 'none',
            duration: 2000,
          })
          return false
        }
        wx.navigateTo({
          url: '/xpages/Electroniccard/Electroniccard?status=' + 1,
        })
        return
      }
      wx.navigateTo({
        url: '/xpages/contact/contact',
      })
    }
  }
})