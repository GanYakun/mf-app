var WxParse = require('../../wxParse/wxParse.js');
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '请选择',
    values: '请选择',
    tabindex: 999,
    hidindex: 0,
    heade: [{
      name: '综合'
    }, {
      name: '人气'
    }, {
      name: '浏览'
    }, {
      name: '最新'
    }, {
      name: '筛选'
    }],
    choice: [{
        name: '流行风格',
        list: ['全部', '简约时尚', '北欧格调', '美式风情', '全部'],
        flag: false,
        select: '全部'
      }, {
        name: '整装户型',
        list: ['全部', '普通住宅', '全部', '全部', '全部'],
        flag: false,
        select: '全部'
      }, {
        name: '空间设计',
        list: ['全部', '全部', '全部', '全部', '全部'],
        flag: false,
        select: '全部'
      }, {
        name: '楼盘位置',
        list: ['全部', '全部', '全部', '全部', '全部'],
        flag: false,
        select: '全部'
      },
      {
        name: '设计师',
        list: ['全部', '全部', '全部', '全部', '全部'],
        flag: false,
        select: '全部'
      }
    ],
    showModalStatus: false,
    extendData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
          imgur: app.globalData.imgur,
          newsClassId: options.id?options.id:options.newsClassId,
          imgur: app.globalData.imgur
        })
      }
    })

    //如果从首页非功能按妞进来
    if( options.shejitypedata!=undefined){
console.log(options.shejitypedata)
      that.setData({
        newsClassId: options.shejitypedata.newsClassId,
      })
      let data =options.shejitypedata
           //获取全案设计列表
           api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
            if(e){
              wx.hideLoading({})
              var h5content = e.data.newsClass.content
              WxParse.wxParse('article', 'html', h5content, that, 5);
              that.setData({
                content: e.data,
                TopTitle:e.data.newsClass.name,
                h5content: h5content
              })
            }
          })
    }else{
      wx.setNavigationBarTitle({
        title: options.toptext
      })
      that.setData({
        newsClassId: options.id?options.id:options.newsClassId,
      })
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: options.id?options.id:options.newsClassId
      }
      wx.showLoading({
        title: '加载中',
      })
      //获取全案设计列表
      api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if(e){
          wx.hideLoading({
           
          })
          var h5content = e.data.newsClass.content
          WxParse.wxParse('article', 'html', h5content, that, 5);
          that.setData({
            content: e.data,
            TopTitle:e.data.newsClass.name,
            h5content: h5content
          })
        }
      })
    }
   


  },

  chioce: function (e) {
    let index = e.currentTarget.dataset.index
    let flags = e.currentTarget.dataset.flag
    let arr = this.data.choice
    arr[index].flag = !flags
    this.setData({
      choice: arr,
      tabindex: index
    })


  },


  powerDrawer: function (e) {
    this.setData({
      iosDialog22: true
    })
  },

  //取消
  cancel: function () {
    this.util('close')
  },
//  店面列表
  onTypeTap: function () {
    let that = this
    var isclick = that.data.isclick
    that.setData({
      isclick: !isclick
    })
    let data = {
      typegroupCode: 'designer_department'
    }
    api.request('/rest/dataDictionaryApi/dataDictionary', data, 'GET', function (e) {
      e.data.unshift({
        typename: '请选择',
        typecode: ''
      })
      that.setData({
        departmentList: e.data
      })

    })

  },
  // 设计师类别列表
  onTypeTap1: function () {
    let that = this
    var isclick1 = that.data.isclick1
    that.setData({
      isclick1: !isclick1
    })
    let data = {
      typegroupCode: 'designer_type'
    }
    api.request('/rest/dataDictionaryApi/dataDictionary', data, 'GET', function (e) {
      e.data.unshift({
        typename: '请选择',
        typecode: ''
      })
      that.setData({
        typeList: e.data
      })

    })
  },
  // 选择类型
  onSelectTap: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.index)
    that.setData({
      selected: e.currentTarget.dataset.index,
      isclick: e.currentTarget.dataset.isclick,
      isclick1: e.currentTarget.dataset.isclick1,
      value: e.currentTarget.dataset.value,
      values: e.currentTarget.dataset.values,
      typecode: e.currentTarget.dataset.typecode,
      typecodes: e.currentTarget.dataset.typecodes
    })
  },
  // 姓名
  nameinput: function (e) {
    let that = this
    let name = e.detail.value
    that.setData({
      name: name
    })
  },
  // 设计师筛选
  queding: function () {
    let that = this
    let name = that.data.name
    let typecode = that.data.typecode
    let typecodes = that.data.typecodes
    let newsClassId = that.data.newsClassId
    that.setData({
      extendData: {
        designerDepartment: typecode,
        designerType: typecodes,
        name: name
      }
    })
    let data = {
      newsClassId: newsClassId,
      start: 1,
      pageSize: 12,
      extendData: {
        designerDepartment: typecode,
        designerType: typecodes,
        name: name
      }

    }
    api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
      console.log(e)
      that.setData({
        iosDialog22: false,
        content: e.data

      })

    })
  },
  closemask: function () {
    let that = this
    that.setData({
      iosDialog22: false
    })
  },
  allhouse_detail:function(e){
    let that =this
    let id = e.currentTarget.dataset.id
    let newsClassId =that.data.newsClassId
   wx.navigateTo({
     url: '../allhouse_detail/allhouse_detail?id=' + id +'&newsClassId=' +newsClassId,
   })
  },
  /**
   * 
   * 滑动到底部的事件
   * 
   */
  slideusage:function(){
    let that = this
var arr = that.data.content
if(arr.webNextPage){
  wx.showLoading({
    title: '加载中',
  })
  var startnum = arr.start+1
  let data = {
    start: startnum,
    pageSize: 12,
    newsClassId: that.data.newsClassId,
  }
  api.request('/rest/newsClass/getPageModel', data, 'GET',function(e){
    if(e){
      wx.hideLoading({
        
      })
    }
    arr.list = arr.list.concat(e.data.list)
    console.log(arr)
    var xiugai ='content.webNextPage'
    var xiugai1 = 'content.start'
    that.setData({
      content:arr,
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