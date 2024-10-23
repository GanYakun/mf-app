var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    tbindex: 0,
    list: [],
    advList: [],
    start:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
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
          newsClassId: options.id
        })
      }

    })
    console.log(options)
    // 获取无忧售后数据
    // 工程管家
    that.tabList()
    that.advList()
  },

  // 广告图
  advList: function () {
    var that = this
    let data = {
      rootId: 87,
      SearchRowNum: 5,
    }
    api.newget('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', data, 'GET', function (e) {
      console.log(e)
      for(var i=0; i<e.data.length; i++) {
        e.data[i].imagePath = e.data[i].imageVo.imagePath
      }
      that.setData({
        advList: e.data
      })
      var heightArr = []
      const query = wx.createSelectorQuery()
      query.selectAll('#topimage').boundingClientRect()
      query.exec((res) => {
        console.log(res, '######')
        for (var i = 0; i < res[0].length; i++) {
          heightArr.push(res[0][i].height)
          console.log(heightArr, 'heightArr')
          that.setData({
            heightArr:heightArr.push(res[0][i].height)

          })

        }
      })
    })
  },
  first: function () {
    var that = this
    var tabList = that.data.tabList
    console.log(that.data.tabList, 'tab列表2')
    console.log(that.data.tbindex, 'that.data.tbindex')
    var tbindex = that.data.tbindex
    var typecode = tabList[tbindex].typecode
    var newsClassId = that.data.newsClassId
    if (typecode) {
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: newsClassId,
        extendData: {
          position: typecode
        }
      }
    } else {
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: newsClassId,
      }
    }

    api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
      console.log(e, '请求数据')
      var code = e.code
    
      if (code == 200) {
        wx.hideLoading()
        var list = e.data.list
        that.setData({
          list: list,
          nextPage:e.data.webNextPage,
          start:1,
          TopTitle:e.data.newsClass.name

        })

      }
    })
  },
  // tab列表
  tabList: function () {
    var that = this
    var tbindex = that.data.tbindex
    let data = {
      typegroupCode: 'position'
    }
    api.newget('rest/dataDictionaryApi/dataDictionary', data, 'GET', function (e) {
      console.log(e, 'tab列表')
      e.data.unshift({
        typename: '全部',
        typecode: null
      })
      var code = e.code
      if (code == 200) {
        var list = e.data
        that.setData({
          tabList: list,
        })
        console.log(that.data.tabList, 'tab列表1')
        that.first()
      }
    })

  },


  //
  upafter: function (e) {
    let that = this
    let index = e.detail.index - 1
    if (index == 0) {

    } else if (index < 0) {

    } else {
      let data = {
        start: 1,
        pageSize: 12,
        newsClassId: options.id,
        extendData: {
          position: 6
        }
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', that.getPageModel)
      let getPageModelData = {
        start: 1,
        pageSize: 12,
        newsClassId: options.id,
        extendData: {
          position: 5
        }
      }
      api.request('/rest/newsClass/getPageModel', getPageModelData, 'GET', that.getPageModels)
    }

  },
  nextafter: function (e) {
    let that = this

    let index = parseInt(e.detail.index) + 1
    if (index > that.data.lists.maxStart) {

    } else {
      let data = {
        start: 1,
        pageSize: 12,
        newsClassId: options.id,
        extendData: {
          position: 6
        }
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', that.getPageModel)
      let getPageModelData = {
        start: 1,
        pageSize: 12,
        newsClassId: options.id,
        extendData: {
          position: 5
        }
      }
      api.request('/rest/newsClass/getPageModel', getPageModelData, 'GET', that.getPageModels)
    }

  },

  getPageModel: function (e) {
    if (e) {
      wx.hideLoading({
        success: (res) => {},
      })
    }
    let that = this
    that.setData({
      start:1,
      list: e.data.list
    })
  },
  // 点击tab
  tabtap: function (e) {
    let that = this
    console.log(e)
    that.setData({
      tbindex: e.currentTarget.dataset.index,
    })
    that.first()
  },

  //跳转到工程管家详情页
  after: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../aftersaleuser/aftersaleuser?id=' + id + '&newsClassId=' + that.data.newsClassId,
    })
  },

  /**
   * 
   * 
   * 监听页面隐藏
   * 
   * 
   */
  onHide: function () {
    wx.hideLoading({})
  },

  /**
   * 
   * 滑动到底部的事件
   * 
   */
  slideusage: function () {
    let that = this
    var tabList = that.data.tabList
    var tbindex = that.data.tbindex
    var typecode = tabList[tbindex].typecode
    var newsClassId = that.data.newsClassId
    var start = that.data.start+1
    if (that.data.nextPage) {
      let data = {
        start: start,
        pageSize: 12,
        newsClassId: newsClassId,
        extendData: {
          position: typecode?typecode:''
        }
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function(e){
          that.data.list.concat(e.data.list)
          that.setData({
            nextPage:e.data.webNextPage,
            list:that.data.list.concat(e.data.list),
            start:start
          })
      })
    }else{
      wx.showToast({
        title: '暂无更多',
        icon:'none'
      })
    }
  },

  selectedbtn: function (e) {
    console.log("点击广告返回的数据", e)
    console.log("点击广告返回的详情id", +e.currentTarget.dataset.id)
    let xcxpage = e.currentTarget.dataset.xcxpage //跳转到页面的页面路径
    //如果广告的标题为空
    if (e.currentTarget.dataset.hometitle != undefined) {
      var pagetitle = e.currentTarget.dataset.hometitle
    } else {
      var pagetitle = ''
    }
    let id = e.currentTarget.dataset.id
    let newclassid = e.currentTarget.dataset.newclassid
    let specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
    let url = e.currentTarget.dataset.url
    let modelName = e.currentTarget.dataset.modelname
    console.log('所有广告的点击事件的url', url, '页面路径', xcxpage)
    console.log('所有广告的点击事件newclassId', newclassid)
    if (xcxpage) {
      console.log('走进了新版广告图的方法')
      if (modelName == 'mallItemSkuVO') {
        let xcxpageurl = xcxpage.split('?')
        console.log(xcxpageurl)
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + 155 + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id,
        })
      }
    } else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }


  },


})