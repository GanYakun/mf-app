var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // arr: ["TA的代表作品", "设计攻略"],
    arr: ["TA的代表作品"],
    tbindex: 0,
    iosDialog2: false,
    xinxinnum: 5,
    xinxinnums: 5,
    imgurl:app.globalData.imgur,
    imgur:app.globalData.imgur,
    currentPage:12

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        console.log(pageWindowHeight)
        this.setData({
          pageWindowHeight: pageWindowHeight,
          toptext:options.cname,
          tabIndexHeight:app.globalData.tabIndexHeight
        })
      }
    })
    console.log('页面参数',options)
    if(options.Popupornot==1){
this.setData({
  iosDialog22:true
})
    }
    this.setData({
      id: options.id,
      newsClassId:options.newsClassId
    })
    this.getModel()
  },

  /**
   * 回调函数
   */

  getModel: function (e) {
    let that = this
    let data = {
      newsClassId:that.data.newsClassId,
      objectId: that.data.id
    }
    api.request('/rest/newsClass/getModel', data, 'GET', function(e){
      that.setData({
        getModel: e.data,
        imgurl:app.globalData.imgur,
        contributeList:e.data.contributeList,
        TopTitle:e.data.name
      })
    })
    
  },
  /**
   * 
   * 跳转到详情页面
   * 
   */
  checklist: function (e) {
    let pagetitle = e.currentTarget.dataset.hometitle
    let id = e.currentTarget.dataset.id
    console.log('../checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + this.data.newsClassId + '&objectId=' + id + '&type=0')
    wx.navigateTo({
      url: '../checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + 127 + '&objectId=' + id + '&type=0',
    })
  },

  publish: function () {
    var id = this.data.id
    console.log(id)
    wx.navigateTo({
      url: '../publish/publish?id=' + id,
    })

 
  },
  // 免费预约设计
  free_design:function(){
    var id = this.data.id
    wx.navigateTo({
      url: '../free_design/free_design?id=' + id+'&appointDesign='+this.data.getModel.name,
    })
  },

  /**
   * 
   * 我要评价
   * 
   */
  meyaopingjia: function (e) {
    this.setData({
      iosDialog22: true
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
   * 点击服务态度评分事件
   * 
   */
  xinxincbtn: function (e) {
    console.log(e)
    this.setData({
      xinxinnum: e.currentTarget.dataset.index + 1
    })

  },


  /**
   * 
   * 专业能力评分
   * 
   */
  xinxincbtns: function (e) {
    console.log(e)
    this.setData({
      xinxinnums: e.currentTarget.dataset.index + 1
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
    var that = this
    var inputcontent = that.data.inputcontent
    if(!inputcontent){
     wx.showToast({
       title: '请输入评价内容',
       icon:'none'
     })
     return
    }
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
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': app.globalData.token
      }
      let data = {
        commentContent: that.data.inputcontent,
        serviceAttitude: that.data.xinxinnum,
        professionalLevel: that.data.xinxinnums,
        designerDecoratorId: parseInt(that.data.id)
      }
      api.newget('rest/memberCenter/pinJiaDes', data, 'POST', header, function (e) {
        if (e.message == '未登录') {
          app.obtaintoken()
        } else {
          wx.showToast({
            title: '评价成功',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            iosDialog22:false,
          })
          that.getModel()
          
        }
      })
    }


  },
  // tab切换
  tabtap: function (e) {
    let that = this
    console.log(e)
    that.setData({
      tbindex: e.currentTarget.dataset.index
    })
  },
  works_detail:function(e){
    console.log(e)
    let that = this
    let id = e.currentTarget.dataset.id
    // console.log(newsClassId)
  wx.navigateTo({
    url: '../works_detail/works_detail?id=' + id + "&newsClassId=147" ,
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
          var listx = 'getModel.contributeList[' + index + '].isclick'
          var clicknum = 'getModel.contributeList[' + index + '].praise'
          that.setData({
            [listx]: true,
            [clicknum]: e.data
          })
          wx.showToast({
            title: '点赞成功',
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
  onTap:function(e){
    wx.navigateTo({
      url: '../wordofmouth/wordofmouth?id=' + e.currentTarget.dataset.id,
    })
  },
  onShow:function(){
    this.getModel()
  },

  //图片预览
  previewImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var topImageList = e.currentTarget.dataset.topimagelist
    var imgurl = this.data.imgurl
    var imgarr = []
    topImageList.forEach((v, k) => {
      imgarr.push(imgurl + v.imagePath)
    });
    wx.previewImage({
      current: imgarr[index], // 当前显示图片的http链接
      urls: imgarr // 所有要预览的图片的地址集合 数组形式
    })
  },

  //滑动加载
  scrollTolower(){
    let currentPage = this.data.currentPage
    if(currentPage<this.data.getModel.homeList.length){
      this.setData({
        currentPage:currentPage+12
      })
    }else{

    }
  }
})