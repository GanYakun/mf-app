// member/case_management/case_management.js
// member/user_praise/user_praise.js
var api = require('../../utils/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // list: [{
    //     "iconPath": "images/tab_index_normal.png",
    //     "selectedIconPath": "images/tab_index_checked.png",
    //     "pagePath": "pages/index/index",
    //     "text": "首页"
    //   },
    //   {
    //     "iconPath": "images/tab_new_house.png",
    //     "selectedIconPath": "images/tab_new_house_checked.png",
    //     "pagePath": "pages/tab-classification/tab-classification",
    //     "text": "家居商城"
    //   },
    //   {
    //     "iconPath": "images/tab_old_house.png",
    //     "selectedIconPath": "images/tab_old_house_checked.png",
    //     "pagePath": "pages/tab-cart/tab-cart",
    //     "text": "购物车"
    //   },
    //   {
    //     "iconPath": "images/tab_renting_house.png",
    //     "selectedIconPath": "images/tab_renting_house_checked.png",
    //     "pagePath": "pages/tab-member/tab-member",
    //     "text": "我的"
    //   }
    // ],
    start: 1,
    pageSize: 12

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // wx.login({
    //   success(res) {
    //     console.log(res)
    //     console.log(res.code)
    //     that.globalData.code = res.code
    //     let data = {
    //       code: res.code
    //     }

    //   }
    // })
    let that = this
    that.setData({
      type: options.type
    })
    that.fist()


  },
  fist: function () {
    let that = this
    var type = that.data.type
    let tokens = app.globalData.token
 if (type == 0) {
      let data = {
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/myQwjxFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize , data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myQwjxFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    } else if (type == 1) {
      let data = {
       
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/myGzfFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myGzfFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    } else if (type == 2) {
      let data = {
       
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/myMmpFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myMmpFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    }else if (type == 3) {
      let data = {
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/mySuccessCaseList?start=' + that.data.start+"&pageSize=" +that.data.pageSize, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            mySuccessCaseList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    }

  },

  // 搜索
  keyWord: function (e) {
    console.log(e.detail.value)
    let that = this
    that.setData({
      keyWord: e.detail.value
    })
  },
  onSearchTap: function () {
    let that = this
    let keyWord = that.data.keyWord
    let tokens = app.globalData.token
    var type = that.data.type
    let extendData ={}
      extendData['homeTitle']=keyWord
      extendData = encodeURIComponent(JSON.stringify(extendData))
    if (type == 0) {
      let data = {
       
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/myQwjxFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize+ "&extendData="+extendData , data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myQwjxFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    } else if (type == 1) {
      let data = {
      
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/myGzfFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize+ "&extendData="+extendData, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myGzfFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    } else if (type == 2) {
      let data = {
       
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      console.log(extendData)
      api.xpost('/rest/memberCenter/myMmpFunList?start=' + that.data.start+"&pageSize=" +that.data.pageSize+ "&extendData="+extendData, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myMmpFunList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    }else if (type == 3) {
      let data = {
      }
      let extendData ={}
      extendData['caseTitle']=keyWord
      extendData = encodeURIComponent(JSON.stringify(extendData))
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/mySuccessCaseList?start=' + that.data.start+"&pageSize=" +that.data.pageSize+ "&extendData="+extendData, data, 'GET', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            mySuccessCaseList: e.data.list
          })
        } else {
           wx.showToast({
             title: e.message,
             icon:'none'
           })
        }

      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.fist()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})