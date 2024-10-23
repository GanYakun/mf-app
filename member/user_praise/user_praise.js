// member/user_praise/user_praise.js
var api = require('../../utils/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
    TopTitle:'用户中心口碑'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  fist: function () {
    let that = this
      let tokens = app.globalData.token
      let data = {
        title:''
      }
      api.newget('/rest/memberCenter/getContributeListByToken', data, 'POST', function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            lists: e.data
          })
        } else {
          //  wx.showToast({
          //    title: e.message,
          //  })
        }

      })
    
  },
  // 编辑
  onEditTap: function (e) {
    wx.navigateTo({
      url: '/member/public_praise/public_praise?id=' + e.currentTarget.dataset.id + "&title=" + e.currentTarget.dataset.title + "&topImageList=" + JSON.stringify(e.currentTarget.dataset.topimagelist) + "&briefContent=" + e.currentTarget.dataset.briefcontent + "&type=" + e.currentTarget.dataset.type,
    })

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
    let data = {
      title: keyWord
    }
    console.log(data)
    console.log(tokens)
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': tokens
    }
    api.xpost('/rest/memberCenter/getContributeListByToken', data, 'POST', header, function (e) {
      console.log(e)
      if (e.code == 200) {
        that.setData({
          lists: e.data
         
        })
      } else {
        //  wx.showToast({
        //    title: e.message,
        //  })
      }

    })
  },
  //查看评论
  lookWordOfMouth(e){
    let index = e.currentTarget.dataset.index
    let list = this.data.lists[index]
    let params =encodeURIComponent(JSON.stringify({
      list:list
    }))
    wx.navigateTo({
      url: '../look_word_of_mouth/look_word_of_mouth?params='+params,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.fist()
  },
})