// components/floor-list/index.js.js
const api = require("../../utils/api.js")
const createRecycleContext = require('../recycle-view/index.js')
const tools = require("../../utils/func-utils.js")
const app = getApp()
var ctx
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topBanner: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          _topBanner: newVal
        })
      }
    },
    topMenu: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          _topMenu: newVal
        })
      }
    },
    list: {
      type: Array,
      value: [],
      observer: async function (newVal, oldVal) {
        var floorList = []
        //这个过滤重要
        for (var i = 0; i < newVal.length; i++) {
          if ((newVal[i].adImageList || newVal[i].adImageList1 || newVal[i].adImageList2 || newVal[i].adImageList3 || newVal[i].msgList)) {
            floorList.push(newVal[i])
          }
        }
        ctx = createRecycleContext({
          id: 'recycleId',
          dataKey: '_floorList',
          page: this,
          itemSize: (item, index) => {
            var defaultHeight = wx.getSystemInfoSync().windowHeight / floorList.length
            var rectList = this.data.rectList ? this.data.rectList : []

            // var itemInfo = {
            //   queryClass: "floor-item",
            //   width: rectList[index] ? rectList[index].width:ctx.transformRpx(710),
            //   height: ctx.transformRpx(600)
            // }

            var itemInfo = {
              width: 162,
              height: 182
            }

            return itemInfo
          }
        })

        for (var i = 0; i < floorList.length; i++) {
          // 控制首页显示的数据条数
          // if(i<3 || i==13) {
          await this.addFloorItem(floorList[i], i)
          this.triggerEvent("floorloadfinish", {})
          // }
        }
      }
    },
    msgList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          _msgList: newVal
        })
      }
    },
    pageButtonHeight: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        this.setData({
          _pageButtonHeight: newVal
        })
      }
    },
    pageMenuButtonTop: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        this.setData({
          _pageMenuButtonTop: newVal
        })
      }
    },
    isPageShow: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {
        this.setData({
          _isPageShow: newVal
        })
      }
    },
    height: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        this.setData({
          _height: newVal
        })
      }
    },
    topHeight: {
      //顶部搜索栏的高度
      type: Number,
      value: 0
    }
  },

  lifetimes: {
    attached: function () {
      const query = this.createSelectorQuery()
      query.select(".wrapper").boundingClientRect().exec((res) => {
        var floorWidth = res[0] ? res[0].width : 0
        this.setData({
          floorWidth: floorWidth,
        })
      })
      var sysInfo = wx.getSystemInfoSync()
      this.setData({
        _contentHeight: sysInfo.screenHeight
      })
    },
    detached: function () {
      if (ctx) {
        ctx.destroy()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _height: 0,
    _floorList: [],
    _topMenu: [],
    _msgList: [],
    floorWidth: 0,
    videoItems: [],
    videoListHeight: 0,
    _contentHeight: 0,
    playIndex: -1,
    rectList: [],
    videoListStart: 1,
    marginHeight: 140
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // var type = source.type
    // if(type == "1") {
    //   //普通楼层
    // } else if(type == "2") {
    //   //大礼包楼层
    // } else if(type == "3") {
    //   //当期活动楼层
    // } else if(type == "4") {
    //   //限时抢购楼层
    // } else if(type == "5") {
    //   //样品特卖楼层
    // } else if(type == "6") {
    //   //细节、头条楼层
    // } else if(type == "7") {
    //   //实体门店楼层
    // } else if(type == "8") {
    //   //全案设计楼层
    // } else if(type == "9") {
    //   //装修流程图楼层
    // } else if(type == "10") {
    //   //用户口碑楼层
    // }

    //用来控制菜单栏不显示的高度
    close(e) {
      app.log('floor-list里的close方法', e)
      this.setData({
        marginHeight: e.detail.height
      })
    },
    more: function (event) {
      console.log("more", event)
      var source = event.currentTarget.dataset.source
      var sourceType = source.type
      console.log("source", source)
      var newsClassId = source.newsClass.id
      var type = "more"
      var position = 0
      if (newsClassId == 223) {
        type = "moreRight"
      }
      if (sourceType == "4") {
        type = "activityMore"
      }
      if (newsClassId == 155) {
        position = -1
      }
      var detail = {
        eventType: type,
        position: position,
        source: source
      }

      this.onAction({
        detail: detail
      })
    },

    //所有楼层公告事件接收器
    onAction: async function (event) {
      // await app.obtaintoken()
      // if (!app.globalData.token) {
      //   app.UserLoginToClick()
      //   return false
      // }
      console.log("event", event)
      var eventType = event.detail.eventType
      var position = event.detail.position
      var source = event.detail.source
      var adListType = event.detail.adListType ? event.detail.adListType : ''
      //这个是每个楼层的banner图的第二种形态，就是左右各两张，用来判断数据取得是 bannerList 还是 bannerList
      var sourcesType = event.detail.sourcesType
      if (eventType == "detail") {
        this.processDetailEvent(position, source, adListType)
      } else if (eventType == "banner") {
        this.processBannerEvent(position, source, sourcesType)
      } else if (eventType == "filter") {
        this.processFilterEvent(position, source)
      } else if (eventType == "subtitle") {
        this.processSubtitleEvent(position, source)
      } else if (eventType == "build") {
        this.processBuildEvent(position, source)
      } else if (eventType == "more" || eventType == "moreRight") {
        this.processMoreEvent(position, source, eventType)
      } else if (eventType == "vr") {
        this.processVrEvent(position, source)
      } else if (eventType == "moreVr") {
        this.processMoreVrEvent(position, source)
      } else if (eventType == "topBanner") {
        this.processTopBannerEvent(position, source)
      } else if (eventType == "topMenu") {
        this.processTopMenuEvent(position, source)
      } else if (eventType == "moreVideo") {
        this.processMoreVideoEvent(position, source)
      } else if (eventType == "videoFilter") {
        this.processVideoFilterEvent(position, source)
      } else if (eventType == "activityMore") {
        this.processActivityMore(position)
      } else if (eventType == "advMore") {
        this.processAdvlist(source)
      } else if (eventType == 'headlines') {
        //今日头条或美家头条
        this.processHeadlines(source, position)
      }
    },

    processDetailEvent: function (position, source, adListType) {
      var type = source.type
      var newsClass = source.newsClass
      if (type == "1" || type == "3" || type == "4") {
        // 3为本月大促    4为当期活动也就是
        if (type == "3" || type == "4") {
          app.log('floor-list组件 source', source)
          var listObj = source[`${adListType}`]
          app.log('floor-list组件 listObj', listObj)
        } else {
          var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        }

        var list = listObj ? listObj : []
        var item = list[position]
        var xcxpage = item.xcxpage
        var id = item.contentId
        var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var pagetitle = ""
        var url = item.url
        var modelName = item.modelName
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }
        if (modelName == 'xcx' && xcxpage) {
          wx.navigateToMiniProgram({
            appId: id,
            path: xcxpage,
            extraData: {}, //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
            envVersion: 'release',
            success(res) {
              app.log('打开其他小程序的回调', res)
            }
          })
        } else if (xcxpage) {
          if (modelName == 'mallItemSkuVO') {
            let xcxpageurl = xcxpage.split('?')
            wx.navigateTo({
              url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
              // +'&source='+encodeURIComponent(JSON.stringify(source)) 
              //categoryId只限产品部分，筛选时候用得倒，可能是cid
            })
          } else {
            wx.navigateTo({
              url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
            })
          }
        } else if (url) {
          wx.navigateTo({
            url: '/xpages/h5page/h5page?url=' + url,
          })
        }
      } else if (type == "2") {
        //大礼包楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj ? listObj : []
        var item = list[position]

        var id = item.id
        var promotionsContent = item.promotionsContent
        var buyItAlone = item.buyItAlone
        var promotionsperiod = item.promotionsPeriod
        wx.navigateTo({
          url: '/xpages/currentactivity/currentactivity?Giftbag=' + id + '&miaoshu=' + encodeURIComponent(promotionsContent) + '&buyItAlone=' + buyItAlone + '&promotionsperiod=' + promotionsperiod,
        })
      }
      //else if (type == "3") {
      //   //当期活动楼层
      //   var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      //   var list = listObj && listObj.proList ? listObj.proList : []
      //   var item = list[position]

      //   var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      //   var objectId = item.pid
      //   var typeId = 0
      //   var itemName = item.itemName
      //   var productName = item.productName
      //   var cid = item.cid
      //   var typeofpurchase = 'dangqi'

      //   wx.navigateTo({
      //     url: '/xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + "&NeworderType=" + 2,
      //   })
      // } 
      else if (type == "4") {
        //限时抢购楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj && listObj.proList ? listObj.proList : []
        var item = list[position]

        var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var pid = item.pid
        var itemname = item.productName
        var productname = item.productName
        var cid = item.cid

        let params = {
          promotionsType: 1,
        }
        api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', params, 'GET', function (e) {
          let promotionsId = e.data[0].id
          let data = {
            objectId: pid,
            newsClassId: newclassid,
            typeId: 0,
            extendData: {
              promotionsId: promotionsId,
              promotionsType: 1,
              // promotionsId: "81", //促销id

            }
          }

          let isgonnengdata = {
            itemName: itemname,
            productName: productname,
            cid: cid
          }

          wx.navigateTo({
            url: '/xpages/shop/shop?buytype=4' + '&buydata=' + JSON.stringify(data) + '&isgonnengdata=' + JSON.stringify(isgonnengdata)
          })
        })
      } else if (type == "5") {
        //样品特卖楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj && listObj.proList ? listObj.proList : []
        var item = list[position]

        var objectId = item.pid
        var typeId = 0
        var itemName = item.itemName
        var productName = item.productName
        var cid = item.cid
        var typeofpurchase = 'dangqi'
        wx.navigateTo({
          url: '/xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + '&NeworderType=' + 3,
        })
      } else if (type == "6") {
        //细节、头条楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj ? listObj : []
        var item = list[position]

        var xcxpage = item.xcxpage
        var id = item.contentId
        var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var pagetitle = item.name
        var url = item.url
        var modelName = item.modelName
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }

        if (xcxpage) {
          if (modelName == 'mallItemSkuVO') {
            let xcxpageurl = xcxpage.split('?')
            wx.navigateTo({
              url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
              //categoryId只限产品部分，筛选时候用得倒，可能是cid
            })
          } else {
            wx.navigateTo({
              url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
            })
          }
        } else if (url) {
          wx.navigateTo({
            url: '/xpages/h5page/h5page?url=' + url,
          })
        }
      } else if (type == "7") {
        //实体门店楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj && listObj.list ? listObj.list : []
        var item = list[position]
        console.log('查看实体门店列表', list)
        // var imgarr = item.thumbnailsPath
        // var title = item.name
        wx.navigateTo({
          url: '../../xpages/storedetails/storedetails?id=' + item.id + '&newsClassId=145',
        })
      } else if (type == "8") {
        //全案设计楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj && listObj.list ? listObj.list : []
        var item = list[position]

        var id = item.id
        var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "155")
        wx.navigateTo({
          url: '/xpages/allhouse_detail/allhouse_detail?id=' + id + '&newsClassId=' + newclassid,
        })
      } else if (type == "9") {
        //装修流程图楼层
        var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
        var list = listObj && listObj ? listObj : []
        var item = list[position]

        var xcxpage = item.xcxpage
        var id = item.contentId
        var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var pagetitle = item.name
        var url = item.url
        var modelName = item.modelName
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }

        if (xcxpage) {
          if (modelName == 'mallItemSkuVO') {
            let xcxpageurl = xcxpage.split('?')
            wx.navigateTo({
              url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
              //categoryId只限产品部分，筛选时候用得倒，可能是cid
            })
          } else {
            wx.navigateTo({
              url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
            })
          }
        } else if (url) {
          wx.navigateTo({
            url: '/xpages/h5page/h5page?url=' + url,
          })
        }
      } else if (type == "10") {
        //用户口碑楼层,无详情
      }
    },

    processBannerEvent: function (position, source, sourcesType) {
      console.log('banner图类型', sourcesType)
      var type = source.type
      var newsClass = source.newsClass
      //这里统一判定为接口返回banner图的结构是一致的,
      //防止接口里面banner图返回的结构不一致时导致报错,可以根据type分开判断
      if (sourcesType == 'bannerList2') {
        var list = source.bannerList ? source.bannerList : []
      } else if (sourcesType == 'bannerList3') {
        var list = source.bannerList3 ? source.bannerList3 : []
      } else {
        var list = source.bannerList2 ? source.bannerList2 : []
      }

      var item = list[position]
      console.log(item)
      var xcxpage = item.xcxpage //跳转到页面的页面路径
      var id = item.contentId
      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      // var specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
      var url = item.url
      var modelName = item.modelName
      var extendData = item.extendData
      if (!extendData || !this.isJson(extendData)) {
        extendData = "{}"
      }
      if (modelName == 'xcx' && xcxpage) {
        wx.navigateToMiniProgram({
          appId: id,
          path: xcxpage,
          extraData: {}, //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
          envVersion: 'release',
          success(res) {
            app.log('打开其他小程序的回调', res)
          }
        })
      } else if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          var xcxpageurl = xcxpage.split('?')
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
            //categoryId只限产品部分，筛选时候用得倒，可能是cid
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '../../xpages/h5page/h5page?url=' + url,
        })
      }
    },

    processFilterEvent: function (position, source) {
      var type = source.type
      var newsClass = source.newsClass
      var listObj = source.filterList ? source.filterList : (source.filterList1 ? source.filterList1 : (source.filterList2 ? source.filterList2 : null))
      var list = listObj && listObj ? listObj : []
      var item = list[position]
      var modelName = item.modelName ? item.modelName : (newsClass ? newsClass.modelName : '')
      var listPage = newsClass && newsClass.listPage ? newsClass.listPage : ''
      if (modelName == "tWebPerfectHome") {
        console.log(item)
        var name = item.searchName
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")

        var id = item.id
        var advData = encodeURIComponent(JSON.stringify({
          clickName: item.searchName,
          clickId: id
        }))
        if (newsclassid == '128') {
          //精装房
          var extenddata = {
            searchOption: id,
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1 + '&advData=' + advData
          })
        } else if (newsclassid == "127") {
          //毛坯房
          let extenddata = {
            searchOption: id,
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
          })
        } else if (newsclassid == "129") {
          //精选组合
          var extendData = {
            searchOption: id,
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/selected/selected?id=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData) + '&chioceid=' + id
          })
        }
      } else if (modelName == "tWebCustomFurn") {
        //定制
        var name = item.searchName
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var id = item.id
        wx.navigateTo({
          url: '/pages/customized_home/customized_home?id=' + id + '&newsClassId=' +
            newsclassid
        })
      } else if (modelName == "mallItemSkuVO") {
        console.log("产品", source);
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var id = item.id
        var cname = item.cname
        if (newsclassid == 223) {
          //本月爆款筛选条件被点击
          if (item.parentCid == 0) {
            item.pid = id
          } else {
            item.pid = item.parentCid
            item.parentCid = 0
          }

          var catItem = item
          var catItemStr = "{}"
          if (catItem) {
            catItemStr = encodeURIComponent(JSON.stringify(catItem))
          }

          wx.navigateTo({
            url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + '&cname=' + cname + '&catItem=' + catItemStr,
          })
        } else {
          wx.navigateTo({
            url: '/xpages/classification/classification?id=' + id + "&cname=" + cname + '&ScreeningFloors=' + 0,
          })
        }
      } else if (modelName == "tWebDesignerDecorator") {
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var modelname = item.modelName
        var xcxpage = item.xcxpage
        var id = item.contentId
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }

        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      } else if (modelName == "tWebArticle") {
        var newsclassid = newsClass && newsClass.id ? `${newsClass.id}` : ""
        console.log(item)
        wx.navigateTo({
          url: listPage + '?id=' + newsclassid + '&scrrenId=' + item.id,
        })
      } else {
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var modelname = item.modelName
        var xcxpage = item.xcxpage
        var id = item.contentId
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }

        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      }
    },

    processSubtitleEvent: function (position, source) {
      var type = source.type
      var newsClass = source.newsClass

      var list = source.subTitleList ? source.subTitleList : []
      var item = list[position]

      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var modelName = item.modelName
      var xcxpage = item.xcxpage
      var id = item.contentId
      var hometitle = item.name
      var url = item.url
      var extendData = item.extendData
      if (!extendData || !this.isJson(extendData)) {
        extendData = "{}"
      }

      if (modelName == 'xcx' && xcxpage) {
        wx.navigateToMiniProgram({
          appId: id,
          path: xcxpage,
          extraData: {}, //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
          envVersion: 'release',
          success(res) {
            app.log('打开其他小程序的回调', res)
          }
        })
      } else if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          let xcxpageurl = xcxpage.split('?')
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newsclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newsclassid + "&extendData=" + extendData
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '../../xpages/h5page/h5page?url=' + url,
        })
      }
    },

    processBuildEvent: function (position, source) {
      var type = source.type
      var newsClass = source.newsClass

      var list = source.buildList ? source.buildList : []
      var item = list[position]

      var id = item.id
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")

      var id = item.id
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var name = item.searchName
      var extendData = {
        searchOption: id,
        designerId: ""
      }
      var advData = encodeURIComponent(JSON.stringify({
        clickName: item.searchName,
        clickId: id
      }))
      wx.navigateTo({
        url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData) + '&advData=' + advData
      })
    },

    processMoreEvent: function (position, source, eventType) {
      var position = position
      var type = source.type
      console.log(eventType)
      var newsClass = source.newsClass
      var newsclassid = newsClass && newsClass.id ? `${newsClass.id}` : ""
      var modelName = newsClass ? newsClass.modelName : ''
      var name = source ? source.name : ''
      var listPage = newsClass && newsClass.listPage ? newsClass.listPage : ''
      var relationid = newsClass && newsClass.relationId ? newsClass.relationId : ''
      if (modelName == "tWebPerfectHome") {
        if (newsclassid == '128') {
          //精装房
          var extenddata = {
            searchOption: "",
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
          })
        } else if (newsclassid == "127") {
          //毛坯房
          let extenddata = {
            searchOption: "",
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
          })
        } else if (newsclassid == "129") {
          //精选组合
          var extendData = {
            searchOption: "",
            designerId: ""
          }
          wx.navigateTo({
            url: '/xpages/selected/selected?id=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData) + '&chioceid='
          })
        }
      } else if (modelName == "tWebCustomFurn") {
        wx.navigateTo({
          url: '/pages/customized_home/customized_home?id=&newsClassId=' +
            newsclassid
        })
      } else if (modelName == "mallItemSkuVO") {
        console.log("mallItemSkuVO", newsclassid)
        var cid = ""
        if (newsclassid == 224) {
          //一线主材
          cid = "1"
        } else if (newsclassid == 184) {
          //国际软装
          cid = "2"
        } else if (newsclassid == 227) {
          //成品家具
          cid = "3"
        } else if (newsclassid == 228) {
          //家用电器
          cid = "4"
        } else if (newsclassid == 383) {
          //全屋套餐
          cid = "677"
        } else if (newsclassid == 263) {
          cid = "318"
        } else if (newsclassid == 223) {
          let catItemStr = {
            cname: "全部",
            id: 0,
            imagePath: "https://www.100good.cn/plug-in/aykjmobile/images/all_hot.png",
            parentCid: 0
          }
          if (eventType == 'more' || eventType == 'moreRight') {
            wx.navigateTo({
              url: '/xpages/hotproduct_detail/hotproduct_detail?id=' + 0 + '&catItem=' + encodeURIComponent(JSON.stringify(catItemStr)),
            })
          }
          console.log('走这里moreRight1')
          //本月爆款
          // 首页更多跳转到店长推荐
          // wx.navigateTo({
          //   url: '/pages/tab-classification/tab-classification?isRecommended=' + true,
          // })
        } else if (newsclassid == 155) {
          //样品特
          wx.navigateTo({
            url: '/xpages/activitypage/activitypage?newsClassId=' + newsclassid + '&NeworderType=3&objectId=&categoryId=3&position='+position,
          })
        }
        if (cid) {

          if (eventType == 'moreRight') {
            console.log('走这里moreRight2')
            wx.navigateTo({
              // 首页更多跳转到对应的类别
              url: '/pages/tab-classification/tab-classification?cid=' + cid,
            })
          } else {
            wx.navigateTo({
              url: '/xpages/classification/classification?id=' + cid + '&cname=' + name + '&ScreeningFloors=' + 0,
            })
          }

        }
      } else if (modelName == "tWebPhysicalStore") {
        wx.navigateTo({
          url: '/xpages/phystroes/phystroes?newsClassId=' + newsclassid,
        })
      } else if (modelName == "tWebContribute") {
        wx.navigateTo({
          url: '/xpages/wordofmouth/wordofmouth?newsClassId=' + newsclassid,
        })
      } else if (modelName == "tWebDesignerDecorator") {
        var relationId = newsClass ? newsClass.relationId : ""
        wx.navigateTo({
          url: '/xpages/allhouse/allhouse?id=' + newsclassid + '&relationid=' + relationId + '&toptext=' + name
        })
      } else if (modelName == "tWebArticle") {
        // ../../xpages/newactivity/newactivity?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext
        wx.navigateTo({
          // url:'/xpages/newactivity/newactivity'+'?id='+newsclassid+'&relationid='+relationid,
          url: listPage + '?id=' + newsclassid,
        })
      } else {
        var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
        var modelname = item.modelName
        var xcxpage = item.xcxpage
        var id = item.contentId
        var extendData = item.extendData
        if (!extendData || !this.isJson(extendData)) {
          extendData = "{}"
        }

        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      }
    },

    processMoreVrEvent: function (position, source) {
      wx.navigateTo({
        url: '/xpages/storevr/storevr',
      })
    },

    // 跳转到活动列表页
    processActivityMore: function (position) {
      wx.navigateTo({
        url: '/xpages/activitypage/activitypage?NeworderType=' + 1,
        // options = {newsClassId: "155", NeworderType: "3", objectId: "undefined", categoryId: "3"}
      })
    },

    //跳转到广告图列表页
    processAdvlist: function (source) {
      wx.navigateTo({
        url: '/xpages/adv_list/adv_list?source=' + encodeURIComponent(JSON.stringify(source)),
        // options = {newsClassId: "155", NeworderType: "3", objectId: "undefined", categoryId: "3"}
      })
    },

    processVrEvent: function (position, source) {
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj.list : []
      var item = list[position]
      var roam = item.roam
      wx.navigateTo({
        url: '/xpages/h5page/h5page?url=' + roam,
      })
    },

    processTopBannerEvent: function (position, source) {
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj : []
      var item = list[position]

      var indexType = item.indexType
      var modelName = item.modelName
      var xcxpage = item.xcxpage
      var contentId = item.contentId
      var newsClassId = item.indexType
      var name = item.name
      var url = item.url
      var extendData = item.extendData
      if (!extendData || !this.isJson(extendData)) {
        extendData = "{}"
      }
      if (modelName == 'xcx' && xcxpage) {
        wx.navigateToMiniProgram({
          appId: contentId,
          path: xcxpage,
          extraData: {}, //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
          envVersion: 'release',
          success(res) {
            app.log('打开其他小程序的回调', res)
          }
        })
      } else if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          let xcxpageurl = xcxpage.split('?')
          console.log('xcxpageu', xcxpageurl)
          if (xcxpageurl[0] == "/xpages/hotproduct_detail/hotproduct_detail") {
            wx.navigateTo({
              url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + contentId + "&cname=" + '展厅实物'
            })
          }
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newsClassId + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + contentId + '&categoryId=' + newsClassId + "&extendData=" + extendData
            //categoryId只限产品部分，筛选时候用得倒，可能是cid
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newsClassId + '&objectId=' + contentId + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '../../xpages/h5page/h5page?url=' + url,
        })
      }
    },

    processTopMenuEvent: function (position, source) {
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj : []
      var item = list[position]

      let imgarr = item.imageVoList
      let ids = item.id
      let relationid = item.relationId
      let toptext = item.name
      let url = item.url
      let xcxModelName = item.xcxModelName //小程序模型，根据模型跳转
      app.log('小程序模型', xcxModelName)
      if (ids == 144) {
        //无忧售后
        wx.navigateTo({
          url: '../../xpages/aftersale/aftersale?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (xcxModelName == 'stmd') {
        //实体门店
        wx.navigateTo({
          url: '../../xpages/phystroes/phystroes?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (ids == 146) {
        //生活细节
        wx.navigateTo({
          url: '../../xpages/fitforlife/fitforlife?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (ids == 147) {
        //装修效果图
        wx.navigateTo({
          url: '../../xpages/designsketch/designsketch?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (ids == 148) {
        //最新活动
        wx.navigateTo({
          url: '../../xpages/newactivity/newactivity?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (xcxModelName == 'yhkb') {
        //用户口碑
        wx.navigateTo({
          url: '../../xpages/wordofmouth/wordofmouth?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (xcxModelName == "mp") {
        //毛坯房
        wx.redirectTo({
          url: '../../xpages/roughhouse/roughhouse?newsClassId=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (xcxModelName == "wztw") {
        //生活场景
        wx.navigateTo({
          url: '../../xpages/newactivity/newactivity?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
        // wx.navigateTo({
        //   url: '../../xpages/homeencyclopedia/homeencyclopedia?id='+ids+'&relationid='+relationid,
        // })
      } else if (xcxModelName == 'jzf') {
        // 精装房
        wx.navigateTo({
          url: '../../xpages/roughhouse/roughhouse?newsClassId=' + ids,
        })
      } else if (ids == 129) {
        //全屋精选
        wx.navigateTo({
          url: '../../xpages/selected/selected?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      } else if (xcxModelName == 'qasj') {
        //全案设计
        wx.navigateTo({
          url: '../../xpages/allhouse/allhouse?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
        })
      }

      //家居百科
      else if (ids == 150) {
        wx.navigateTo({
          url: '../../xpages/newactivity/newactivity?id=' + ids + '&toptext=' + toptext,
        })
        //视频专栏
      } else if (ids == 151) {
        wx.navigateTo({
          url: '../../xpages/videocolumn/videocolumn?id=' + ids + '&toptext=' + toptext,
        })
      }

      // 爱居丽局改
      else if (ids == 404) {
        wx.navigateTo({
          url: '../../xpages/server-shop/server-shop?categoryId=1217',
        })
      }

      // 家居服务
      else if (ids == 423) {
        wx.navigateTo({
          url: '../../xpages/server-shop/server-shop?categoryId=897',
        })
      }

      //产品列表页
      else if (xcxModelName == 'ptcp' && ids != 404 && ids != 423) {
        let classification = [{ //成品家具
            id: 3,
            ids: 227
          },
          { //一线主材
            id: 1,
            ids: 224
          },
          { //国际软装
            id: 2,
            ids: 184
          }, { //居家用品
            id: 318,
            ids: 263
          }, { //全屋套餐
            id: 677,
            ids: 383
          },
        ]
        let findValue = classification.find(obj => obj.ids == ids)
        app.log({
          findValue: findValue,
          ids: ids
        }, 'findValue+ids')
        wx.navigateTo({
          url: '../../xpages/classification/classification?id=' + findValue.id + "&cname=" + toptext + '&ScreeningFloors=' + 0,
        })
      }
      //今日头条
      else if (ids == 154) {
        wx.navigateTo({
          url: '../../xpages/todaysheadlines/todaysheadlines?id=' + ids + '&toptext=' + toptext,
        })
      }
      //预算报价
      else if (ids == 203) {
        wx.navigateTo({
          url: '../../xpages/budgetquotation/budgetquotation?id=' + ids + '&toptext=' + toptext + '&imgarr=' + JSON.stringify(imgarr)
        })
      }





      //本月爆款
      else if (xcxModelName == 'bybk') {
        let index = source.adImageList.findIndex(obj => obj.xcxModelName == 'bybk')
        let name = source.adImageList[index].name
        var id = 0 //类目id   首页为0adImageList
        var cname = name //名字
        wx.navigateTo({
          url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + "&cname=" + cname
        })
      } else if (ids == 226) {
        wx.navigateTo({
          url: '/pages/customized_home/customized_home?ids=226',
        })
      }

      //家用电器
      else if (ids == 228) {
        let id = 4
        wx.navigateTo({
          url: '../../xpages/classification/classification?id=' + id + '&cname=' + toptext + '&ScreeningFloors=' + 0,
        })
      }

      //定制家装
      else if (ids == 226) {
        wx.navigateTo({
          url: '../../xpages/h5page/h5page?url=' + url,
        })
      }
      //美家视频
      else if (xcxModelName == 'splb') {
        app.navigateToPage({}, '/pages/video-list/video-list')

      }
      //样品特卖
      else if(ids == 503){
        wx.navigateTo({
          url: '/xpages/activitypage/activitypage?newsClassId=155&NeworderType=3&objectId=&categoryId=3&position=-1',
        })
      }
    },

    onVideoInit: function (event) {
      var that = this
      var items = event.detail.items
      var listHeight = event.detail.listHeight
      that.setData({
        videoItems: items,
        videoListHeight: listHeight
      })
    },

    onScroll: tools.debounce(function (event) {
      var contentHeight = this.data._contentHeight

      var scrollHeight = event[0].detail.scrollHeight
      var scrollTop = event[0].detail.scrollTop

      var scrollPosition = scrollTop + contentHeight / 2
      var index = this.getCurrentPlayIndex(scrollPosition, scrollHeight)
      var playIndex = this.data.playIndex
      if (index != playIndex) {
        this.setData({
          playIndex: index
        })
      }
    }),

    getCurrentPlayIndex: function (scrollPosition, scrollHeight) {
      var contentHeight = this.data._contentHeight
      var videoListHeight = this.data.videoListHeight ? this.data.videoListHeight : 0
      var top = scrollHeight - videoListHeight

      var current = -1
      var videoItems = this.data.videoItems
      if (!videoItems || videoItems.length <= 0) {
        return -1
      }
      var offset = top - videoItems[0].top
      for (var i = 0; i < videoItems.length; i++) {
        if (scrollPosition >= (videoItems[i].top + offset) && scrollPosition <= (videoItems[i].bottom + offset)) {
          current = i
          break
        }
      }

      return current
    },

    processMoreVideoEvent: function (position, source) {
      var newsClassId = source.newsClass ? source.newsClass.id : ""
      wx.navigateTo({
        url: '/pages/video-list/video-list?newsClassId=',
      })
    },

    processVideoFilterEvent: function (position, source) {
      var newsClassId = source.newsClass ? source.newsClass.id : ""
      var listObj = source.filterList ? source.filterList : (source.filterList1 ? source.filterList1 : (source.filterList2 ? source.filterList2 : null))
      var list = listObj && listObj ? listObj : []
      var item = list[position]
      console.log("processVideoFilterEvent", item)
      var id = item.id ? item.id : ""
      wx.navigateTo({
        url: '/pages/video-list/video-list?newsClassId=' + id,
      })
    },

    addFloorItem: function (item, index) {
      return new Promise((resolve, reject) => {
        var timer = setTimeout(() => {
          var list = []
          list.push(item)
          ctx.append(list, () => {
            resolve("")
          })
          clearTimeout(timer)
        }, 100) //这里延时100ms,是为了预留时间渲染单个楼层
      })
    },

    onScrollToLower: function (event) {
      var floorList = this.data.list
      var videoFloor = floorList[floorList.length - 1]
      if (videoFloor && videoFloor.type == "11") {
        var newList = videoFloor.adImageList.list
        var videoListStart = this.data.videoListStart
        // /rest/newsClass/getPageModel?start=1&pageSize=20&newsClassId=244
        var nextPage = videoFloor.adImageList.webNextPage
        if (!nextPage) {
          return
        }
        videoListStart += 1
        var postData = {
          start: videoListStart,
          pageSize: 10,
          newsClassId: videoFloor.newsClass.id
        }
        wx.showLoading({
          title: '加载中',
        })
        api.newget("/rest/newsClass/getPageModel", postData, "GET", (res) => {
          var newList = res && res.data && res.data.list ? res.data.list : []
          nextPage = res && res.data ? res.data.webNextPage : true
          videoFloor.adImageList.list = videoFloor.adImageList.list.concat(newList)
          videoFloor.adImageList.webNextPage = nextPage
          ctx.update(floorList.length - 1, [videoFloor])
          this.setData({
            videoListStart: videoListStart
          })
          wx.hideLoading()
        })
      }

    },

    processHeadlines(event, index) {
      app.log('processHeadlines 方法', event)
      let item = event.adImageList.list[index]
      let id = item.id
      let newsClassId = 148
      wx.navigateTo({
        url: '/xpages/childactivity/childactivity?id=' + id + '&newsClassId=' + newsClassId,
      })
    },
    isJson: function (str) {
      try {
        var json = JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }
  }
})