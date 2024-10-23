//index.js
//获取应用实例
var api = require("../../utils/api.js")
const app = getApp();
import requestCenter from '../../http/request-center'
import deviceUtil from '../../utils/device-utils'

Page({
  data: {
    // searchplatext: '搜索', //搜索款默认的文字
    chiocetext: '产品', //默认搜索产品
    startnewsClassId: 155, //默认选中产品时的newclassid
    tabIndexHeight: app.globalData.tabIndexHeight,
    statusBarHeight: deviceUtil.getStatusBarHeight1(),
    titleBarHeight: deviceUtil.getTitleBarHeight1(),
    navbarHeightRpx: deviceUtil.getNavigationBarHeight(),
    //搜索的数据
    saveoptions: [{
      name: "产品",
      newsClassId: 155
    },
    {
      name: "效果图",
      newsClassId: 147
    },
    {
      name: "毛坯房",
      newsClassId: 127
    },
    {
      name: "精装房",
      newsClassId: 128
    },
    {
      name: "全屋精选",
      newsClassId: 129
    }],
    imgur: app.globalData.imgur,
    swheight: 0, //顶部轮播图高度,
    isclicktab: false, //解决输入框层级问题,

    topBanner: [],
    topNewsClassList: [],
    msgList: [],
    floorList: [],

    playIndex: -1,
    loading: true
  },

  onLoad: async function (options) {
    // console.log(slfjs)
    if(options.scene){
      let query = decodeURIComponent(options.scene).split(",");
      console.log('query', query)
      if(query[4]=='ccId'){
        wx.navigateTo({
          url: '/businesscard/server-in-help-detail/server-in-help-detail?id='+query[5],
        })
      }
    }
    var that = this
    let params = {
      rootId: 101,
      SearchRowNum: 1
    }
    let getWxBannerByRootIdKey = await requestCenter.getWxBannerByRootIdKey(params)
    if(getWxBannerByRootIdKey&&getWxBannerByRootIdKey.length>0){
      this.setData({
        testImg:this.data.imgur+getWxBannerByRootIdKey[0].imageVo.imagePath
      })
    }
    this.setData({
      loading: true
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#000000',
    //   animation: {
    //     duration: 400,
    //     timingFunc: 'easeIn'
    //   }
    // })
    let menuButtontop = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        let pageWindowwidth = Math.ceil(windowWidth * ratio);
        let pagemenuButtontop = Math.floor(menuButtontop.top * ratio)
        let statusheight = Math.ceil(res.statusBarHeight * ratio)
        let pagebuttonheight = Math.floor(menuButtontop.height * ratio)
        let buttonbottom = Math.ceil(menuButtontop.bottom * ratio)
        let buttonleft = Math.ceil((windowWidth - menuButtontop.right) * ratio)
        let buttonWidth = Math.ceil(menuButtontop.width * ratio)
        this.setData({
          pageWindowHeight: pageWindowHeight,
          pageWindowwidth: pageWindowwidth,
          // pagemenuButtontop: pagemenuButtontop+(pagemenuButtontop-statusheight)
          pagemenuButtontop: pagemenuButtontop,
          pagebuttonheight: pagebuttonheight,
          statusheight: statusheight,
          buttonbottom: buttonbottom,
       
          buttonleft: buttonleft,
          buttonWidth: buttonWidth
        })
      },
    })
    console.log("getSystemInfo", this.data)

    //获取用户最下面的滚动数据，默认查询6条
    var indexStorageStr = wx.getStorageSync('indexStorage')
    var indexStorage = indexStorageStr ? JSON.parse(indexStorageStr) : null
    var curTimeStamp = new Date().getTime()
    var requestTimeStamp = indexStorage ? indexStorage.requestTimeStamp:0
    var deltaTime = curTimeStamp - requestTimeStamp
    console.log("deltaTime", deltaTime)
    if(deltaTime > 3600000) {
      api.newget("/rest/xcxIndex/getIndex", {}, "GET", (res) => {
        console.log("res", res)
        var code = res.code
        var message = res.message
        if(code == 200) {
          var data = res.data

          //预约列表
          var yuyueList = data.msgList
          if(!yuyueList) {
            yuyueList = []
          }
          var msgList = []
          yuyueList.forEach((v, k) => {
            if (v.createDate != null) {
              var timex = v.createDate
              // var year =timex.split('')[0]+timex.split('')[1]+timex.split('')[2]+timex.split('')[3];
              var month = timex.split('')[5] + timex.split('')[6];
              var day = timex.split('')[8] + timex.split('')[9];
              if (v.name == null) {
                var name = ''
              } else {
                var name = v.name.split('')[0] + '**'
              }

              var timeStr = month + '月' + day + '日'
              msgList.push({
                time: timeStr,
                name: name
              })
            }
          })

          //楼层列表
          var floorList = []
          var videoFloor = null
          var floorCount = data.displayFloorList ? data.displayFloorList.length:0
          for(var i=0; i<floorCount; i++) {
            var type = data.displayFloorList[i].type
            if(type == "11") {
              videoFloor = data.displayFloorList[i]
            } else {
              floorList.push(data.displayFloorList[i])
            }
          }
          if(videoFloor) {
            //视频楼层位于最后一个楼层
            floorList.push(videoFloor)
          }
          var requestTimeStamp = new Date().getTime()
          this.setData({
            topBanner: data.topBanner ? data.topBanner:[],//顶部轮播图
            topNewsClassList: data.topNewsClassList ? data.topNewsClassList:[],//顶部导航按钮,
            msgList: msgList, //上下滚动预约列表,
            floorList: floorList, //楼层列表,
          })
          wx.setStorageSync('indexStorage', JSON.stringify(
            {
              topBanner: data.topBanner ? data.topBanner:[],//顶部轮播图
              topNewsClassList: data.topNewsClassList ? data.topNewsClassList:[],//顶部导航按钮,
              msgList: msgList, //上下滚动预约列表,
              floorList: floorList, //楼层列表,
              requestTimeStamp: requestTimeStamp
            }
          ))
        }
      })
    } else {
      this.setData({...indexStorage})
    }

    const query = wx.createSelectorQuery()
    query.select(".floor-list-wrapper").boundingClientRect().exec((res) => {
      this.setData({
        floorListHeight: res[0].height ? res[0].height:0
      })
    })
  },

  onShow: function (options) {
    // 分享结束时
    let that = this;
    that.setData({
      isPageShow: false
    })
  },

  /**
   * 
   * 
   * 新搜索点击的事件
   * 
   */
  searchbtn: function () {
    let that = this
    that.setData({
      isinputshow: true
    })
  },

  /**
   * 
   *  输入框输入时触发事件
   * 
   * */

  bindinputtext: function (e) {
    console.log(e)
    this.setData({
      searword: e.detail.value
    })
  },

  /**
   * 
   * 搜索
   * 
   * 
   */
  searchword: function (e) {
    var that = this;
    that.setData({
      isshowInput: !that.data.isshowInput,
    })
    var extendData = {
      productName: that.data.searword
    }
    let data1 = {
      newsClassId: that.data.startnewsClassId,
      start: 1,
      pageSize: 12,
      extendData: JSON.stringify(extendData)
    }
    var toptext = '搜索结果'
    //跳转到毛坯房
    console.log(that.data.startnewsClassId)
    if (that.data.oldnewclassid == that.data.startnewsClassId) {
      api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
        var myEventDetail = {
          extendData: extendData,
          concats: e.data.list,
          chuancon: e.data,
        }
        var myEventOption = {}
        that.triggerEvent('dianji', myEventDetail, myEventOption)
      })

    } else {
      if (that.data.startnewsClassId == 127) {
        wx.redirectTo({
          url: '../../xpages/roughhouse/roughhouse?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData) + '&toptext=' + toptext,
        })
      }
      //跳转到产品页面
      else if (that.data.startnewsClassId == 155) {
        wx.reLaunch({
          url: '../../xpages/classification/classification?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData) + '&toptext=' + toptext + '&ScreeningFloors=' + 0 + '&categoryId=' + 0
        })
      }
      //跳转到精装房页面
      else if (that.data.startnewsClassId == 128) {
        wx.redirectTo({
          url: '../../xpages/hardcover/hardcover?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData) + '&toptext=' + toptext,
        })
      }
      //跳转到全屋精选
      else if (that.data.startnewsClassId == 129) {
        wx.redirectTo({
          url: '../../xpages/selected/selected?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData) + '&toptext=' + toptext,
        })
      }
      //跳转到效果图
      else if (that.data.startnewsClassId == 147) {
        wx.redirectTo({
          url: '../../xpages/designsketch/designsketch?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData) + '&toptext=' + toptext,
        })
      }
    }
  },

  // 输入框聚焦时触发
  // Focusstarts: function () {
  //   this.setData({
  //     searchplatext: ''
  //   })
  // },

  //输入框失去焦点
  // testfoucs: function () {
  //   this.setData({
  //     searchplatext: '搜索'
  //   })
  // },

  /**
   * 
   * 轮播图自适应
   * 
   */
  goheight: function (e) {
    //图片的原始宽度
    let imagewidth = e.detail.width;
    //图片的原始高度
    let imageheight = e.detail.height
    //同步获取设备宽度
    let sysinfo = wx.getSystemInfoSync()
    //屏幕宽度
    let screenWidth = sysinfo.screenWidth
    //屏幕和原图的比例
    let scale = screenWidth / imagewidth
    console.log(scale)
    //设置容器的高度
    this.setData({
      swheight: imageheight * scale
    })
  },

  /**
   * 
   * 所有广告的点击事件
   * 
   * 
   */
  selectedbtn: function (e) {
    let xcxpage = e.currentTarget.dataset.xcxpage       //跳转到页面的页面路径
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
    if (xcxpage) {
      if (modelName == 'mallItemSkuVO') {
        let xcxpageurl = xcxpage.split('?')
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + 155 + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id,
        })
      }
    }
    else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  },

  // 首页栏目点击
  aftersale: function (e) {
    let imgarr = e.currentTarget.dataset.imgarr
    let ids = e.currentTarget.dataset.ids
    let relationid = e.currentTarget.dataset.relationid
    let toptext = e.currentTarget.dataset.toptext
    let url = e.currentTarget.dataset.url
    let xcxModelName = e.currentTarget.dataset.xcxmodelname     //小程序模型，根据模型跳转
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
      wx.navigateTo({
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
    //成品家具
    else if (ids == 227) {
      var id = 3
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + id + "&cname=" + toptext + '&ScreeningFloors=' + 0,
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

    // 爱居丽局改
    else if (ids == 404) {
      wx.navigateTo({
        url: '../../xpages/server-shop/server-shop?categoryId=1217'
      })
    }

    //一线主材
    else if (ids == 224) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 1 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    // 全屋套餐
    else if (ids == 383) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 1 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //国际软装
    else if (ids == 184) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 2 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //本月爆款
    else if (xcxModelName == 'bybk') {
      var id = 0 //类目id   首页为0
      var cname = "本月爆款" //名字
      wx.navigateTo({
        url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + "&cname=" + cname
      })
    }

    else if (ids == 226) {
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
  },

  tijioayuyue: function (e) {
    var that = this
    let tel = that.data.yuyuephonedata
    let name = that.data.yuyuenamenamedata
    let data = {
      name: name,
      tel: tel,
      sourceType: 'xcx',
      memberId: app.globalData.shareid,
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (tel == undefined) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'none',
        duration: 1500,
        memberId: app.globalData.shareid,
      });
      return false
    } else if (name == undefined || name.length == 0) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1500
      });
      return false
    } else if (tel.length === 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (tel.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (!myreg.test(tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    api.request('/rest/tWebYuyueControllerApi/doAddYuyue', data, 'PUT', function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: '恭喜您预约成功,客服热线：0871-68123333',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          yuyuevrdata: ''
        })
      } else {
        wx.showToast({
          title: '预约失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 
   * 抢vr设计图
   * 
   * 
   */
  yuyuename: function (e) {
    this.setData({
      yuyuenamenamedata: e.detail.value
    })
  },

  yuyuephone: function (e) {
    this.setData({
      yuyuephonedata: e.detail.value
    })
  },

  toVideoList: function(event) {
    var id = event.currentTarget.dataset.id
    console.log(id,'id')
    if(!id) {
      id = ""
    }
    wx.navigateTo({
      url: '/pages/video-list/video-list?newsClassId=' + id,
    })
  },

  onFloorLoadFinish: function(event) {
    this.setData({
      loading: false
    })
  }
})