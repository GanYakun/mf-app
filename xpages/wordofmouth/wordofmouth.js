var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iosDialog22: false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this
    that.setData({
      newsClassId: options.id?options.id:options.newsClassId,
      TopTitle:options.toptext,
    })
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        that.setData({
          pageWindowHeight: pageWindowHeight,
          imgur: app.globalData.imgur
        })
      }
    })
    that.getPageModel()
    

  },

  //图片预览
  previewImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var topImageList = e.currentTarget.dataset.topimagelist
    var imgur = this.data.imgur
    var imgarr = []
    topImageList.forEach((v, k) => {
      imgarr.push(imgur + v.imagePath)
    });
    wx.previewImage({
      current: imgarr[index], // 当前显示图片的http链接
      urls: imgarr // 所有要预览的图片的地址集合 数组形式
    })
  },
  // 点赞
  onPraiseTap: function (e) {
    let that = this
    let token = app.globalData.token
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    that.setData({
      id: id,
    })
    if (e.currentTarget.dataset.isclick) {
      wx.showToast({
        title: '你已经点过赞了',
        icon: 'none'
      })
    } else {
      let data = {}
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': token
      }
      api.xpost('/rest/tWebContributeControllerApi/contributePraise?contributeId=' + id, data, 'PUT', header, function (e) {

        console.log(e)
        if (e.code == 200) {
          var listx = 'countallusers.list[' + index + '].isclick'
          var clicknum = 'countallusers.list[' + index + '].praise'
          that.setData({
            [listx]: true,
            [clicknum]: e.data
          })
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 
   * 评价
   * 
   */
  meyaopingjia: function (e) {
    let that = this
    let contributeId = e.currentTarget.dataset.id
    let commentIndex = e.currentTarget.dataset.commentIndex
    that.setData({
      iosDialog22: true,
      contributeId: contributeId,
      commentIndex: commentIndex
    })
  },
  getPageModel(e) {
    let that = this
    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: that.data.newsClassId
    }
    //查询用户口碑
    api.request('/rest/newsClass/getPageModel', data1, 'GET', function(e){
      that.setData({
        countallusers: e.data
      })
      console.log("e.data.list[2]", JSON.stringify(e.data.list[2]))
      that.setCollapse()
    })
    
  },
  getPageModels(e) {
    let that = this
    that.setData({
      countallusers: e.data
    })
    
  },
  /** 
   * 
   * 关闭弹窗
   * 
   */
  close: function () {
    this.setData({
      iosDialog22: false
    })
  },
  /**
   * 
   * 输入的评价内容
   * 
   */
  shurucontent: function (e) {
    console.log(e)
    this.setData({
      inputcontent: e.detail.value
    })
  },
  /**
   * 
   * 确定评价
   * 
   */
  queding: function (e) {
    let that = this
    if (app.globalData.token == undefined) {
      let userinfoss = wx.getStorageSync('xuserixnfo')
      if (userinfoss == "") {
        that.setData({
          iosDialog1: true
        })
      } else {
        that.setData({
          iosDialog2: true
        })
      }
    } else {
      if (that.data.inputcontent == null) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': app.globalData.token
      }
      let data = {
        content: that.data.inputcontent,
        contributeId: that.data.contributeId
      }
      api.xpost('/rest/memberCenter/contributeReply', data, 'POST', header, function (e) {
        console.log(e)
        if (e.message == '未登录') {
          wx.showLoading({
            title: '加载中...',
            duration: 1500,
          });
        } else {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1500
          })
        }
        that.setData({
          iosDialog22: false
        })
        // that.getPageModel()
        console.log("userInfo", getApp().globalData.uinfo)
        let reviewResult = {
          content: that.data.inputcontent,
          memberName: getApp().globalData.uinfo.nick
        }
        
        let countallusers = that.data.countallusers
        let countalluserList = countallusers.list
        let commentIndex = that.data.commentIndex
        let commentItem = countalluserList[commentIndex]
        commentItem.reviewList.push(reviewResult)
        that.setData({
          countallusers: countallusers
        })
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let that =this
    // that.getPageModel()

  },
  onReady: function () {

  },
  //判断是否显示全文
  setCollapse: function () {
    var query = wx.createSelectorQuery();
    var that = this;
    query.selectAll('.koubeicontent').boundingClientRect(function (rect) {
      rect.forEach((v, i) => {
        if (v.height > 66) { //判断高度,根据各种高度取折中
          var set = "countallusers.list[" + i + "].collapse";
          var set1 = "countallusers.list[" + i + "].showCollapse";
          that.setData({
            [set]: true,
            [set1]: true,
          })
        }
      })
    }).exec();
  },
  // 全文
  textqueries: function (e) {
    let index = e.currentTarget.dataset.index
    let arr = this.data.countallusers
    arr.list[index].collapse = !arr.list[index].collapse
    this.setData({
      countallusers: arr,
      ceshi: 1233
    })
  },
   //选择页数
   onParentEvent: function (e) {
     let that =this
    console.log(e)
    let data = {
      start: e.detail.index,
      pageSize: 12,
      newsClassId: that.data.newsClassId
    }
    api.request('/rest/newsClass/getPageModel', data, 'GET', that.getPageModels)
  },

  //
  upafter: function (e) {
    console.log(e)
    let that = this
    let index = e.detail.index - 1
    if (index == 0) {

    } else if (index < 0) {

    } else {
      let data = {
        start: index,
        pageSize: 12,
        newsClassId: that.data.newsClassId
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', that.getPageModels)
    }

  },
  nextafter: function (e) {
    console.log(e)
    let that =this
    let index = parseInt(e.detail.index) + 1
    if (index > that.data.countallusers.maxStart) {

    } else {
      let data = {
        start: index,
        pageSize: 12,
        newsClassId: that.data.newsClassId
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', that.getPageModels)
    }

  },
  /**
   * 
   * 发布新的用户口碑
   * 
   * 
   */
  
  fabu:function(){
    let that = this
    if (app.globalData.token == undefined) {
      let userinfoss = wx.getStorageSync('xuserixnfo')
      if (userinfoss == "") {
        that.setData({
          iosDialog1: true
        })
      } else {
        that.setData({
          iosDialog2: true
        })
      }
    }else{
      wx.navigateTo({
        url: '../../member/public_praise/public_praise?type='+1,
      })
    }

  },



   /**
   * 
   * 滑动到底部的事件
   * 
   */
  slideusage:function(){
  
    let that = this
var arr = that.data.countallusers
if(arr.webNextPage){
  wx.showLoading({
    title: '加载中',
  })
  var startnum = arr.start+1
  let data = {
    start: startnum,
    pageSize: 12,
    newsClassId: this.data.newsClassId,
  }
  api.request('/rest/newsClass/getPageModel', data, 'GET',function(e){
    if(e){
      wx.hideLoading({
        
      })
    }
     arr.list.concat(e.data.list)
    var xiugai ='countallusers.webNextPage'
    var xiugai1 = 'countallusers.start'
    that.setData({
      countallusers:arr,
      [xiugai]:e.data.webNextPage,
      [xiugai1]:startnum
  })
  })
}else{
  wx.showToast({
    title: '已经到底了',
    icon:'none',
    duration:1500
  })
}
  }
})