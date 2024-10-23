// xpages/Electroniccard/Electroniccard.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp()
var api = require("../../utils/api.js")
var WxParse = require("../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetail: '',
    imgur: '',
    index: 2,
    isShowModal: false,
    animationData: {},
    list: [],
    num: 0,
    indexCurrent: null,
    videoArr: [],
    isactivite: true,
    ftpUrl:app.globalData.ftpurl,
    Mhtml:'',
    tagStyle: {
      img: "width: 100%; height: auto !important; margin:0;padding: 0;line-height: 0; display:block;" ,
      p:"line-height: 0;margin:0; padding: 0; display:block;font-size:0;width: 100%;height:auto !important;"
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面劲来的参数", options)
    let that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '7YPBZ-NHS6D-MEB45-P4O5V-RKZSK-KHBVI'
    });
    let pageMessage = wx.getSystemInfoSync()
    let capsuleMessage = wx.getMenuButtonBoundingClientRect()
    console.log('页面的信息', pageMessage)
    console.log('胶囊按钮的信息', capsuleMessage)
    let ratio = 750 / pageMessage.windowWidth;
    let gap = capsuleMessage.top - pageMessage.statusBarHeight //胶囊按钮到状态栏的高度
    let menuHeight = capsuleMessage.height //右上角胶囊按钮的高度
    console.log(gap)
    let titleBarHeight = gap * 2 + menuHeight + 4 //标题栏高度
    that.setData({
      navHeight: Math.ceil((pageMessage.statusBarHeight + titleBarHeight) * ratio),
      leftboxTop: Math.ceil(capsuleMessage.top * ratio),
      leftboxleft: Math.ceil((pageMessage.windowWidth - capsuleMessage.right) * ratio),
      leftboxHeight: Math.ceil(capsuleMessage.height * ratio),
      leftBoxWidth: Math.ceil(capsuleMessage.width * ratio),
      statusBarHeight: Math.ceil(pageMessage.statusBarHeight * ratio),
      imgur: app.globalData.imgur,
    })

    that.getInfo({
      status: options.status,
      id: options.mumberId
    })

    let data = {
      rootId: 81,
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', data, 'GET', function (e) {
      that.setData({
        activitedata: e.data
      })
    })
  },

  getInfo: function (e) {
    console.log("是否是分享页面进来判断", e)
    console.log('是否有分享id', app.globalData.shareid)
    var that = this
    //不是分享页面进来
    if (e.status != 1) {
      var data = {
        memberId: app.globalData.memberid
      }
      that.setData({
        cardoperation: '修改名片',
        newshareid: e.mumberId,
        TopTitle: '我的名片'
      })
    }
    //是分享页面进来的
    else {
      var SharePage = 1
      that.setData({
        cardoperation: '',
        newshareid: app.globalData.shareid
      })
      if (app.globalData.shareid != '') {
        var data = {
          memberId: app.globalData.shareid
        }
      } else {
        var data = {
          memberId: app.globalData.memberid
        }
      }
    }
    app.log('请求名片数据的参数',data)
    data.memberId = data.memberId || app.globalData.shareid
    app.log('请求名片数据的参数',data)
    api.request('/rest/shareApi/getBusinessCard', data, 'GET', function (e) {
      if(e.code == '500'){
        wx.showToast({
          title: 'TA还没有生成名片',
          icon:'none',
          duration:2000,
          success(){
            var timer = setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
              clearTimeout(timer)
            },2000)
          }
        })
      }
      var data1 = e.data.businessCard
      var list = e.data.list
      if (e.code == 200) {
        that.setData({
          Mhtml:e.data.businessCard.brandIntroduction
        })
        try {
          // var article = data1.brandIntroduction.replace(/<img/gi, '<img class="rich-img" style="max-width:100%;height:auto;float:left;display:block" ')
          // var article = data1.brandIntroduction.replace(/<br\\>/gi, "")
      
          // var article = data1.brandIntroduction.trim()
          // article = article.replace(/\r/g, "")
          // article = article.replace(/\n/g, "")
          // article = article.replace(/\t/g, "")
          article = data1.brandIntroduction.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ')
        } catch {
          var article = ''
        }
        WxParse.wxParse('article', 'html', article, that, 5);
        try {
          var grvideoLength = JSON.parse(e.data.businessCard.vedioIntroducePath).length
        } catch {
          var grvideoLength = 0
        }
        try {
          var lbvideolength = e.data.lbalVedioList.length
        } catch {
          var lbvideolength = 0
        }
        try {
          var ppcideolength = e.data.ppjsVedioList.length
        } catch {
          var ppcideolength = 0
        }
        data1.adImagePath = data1.adImagePath.split(',')
        that.setData({
          cardDetail: data1,
          list: list,
          shareTitle: data1.brand + ' ' + data1.name,
          lbalVedioList: e.data.lbalVedioList,
          ppjsVedioList: e.data.ppjsVedioList,
          lbvideolength: lbvideolength == 1 ? 100 : (lbvideolength == 2 ? 49 : 30),
          grvideoLength: grvideoLength == 1 ? 100 : (grvideoLength == 2 ? 49 : 30),
          ppcideolength: ppcideolength == 1 ? 100 : (ppcideolength == 2 ? 49 : 30)
        })

        if (SharePage == 1) {
          that.setData({
            TopTitle: e.data.businessCard.name + '的名片',
            gohome: 1,
            // cardoperation:'首页'
          })
        }
        if (SharePage == 1 && e.data.businessCard.designerId) {
          that.setData({
            designerId: e.data.businessCard.designerId,
            cardoperation: '去主页',
          })
        }



      }

    })
  },

  //返回上一页
  backpage: function () {
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
        console.log('成功！')
      }
    })
  },

  tabBar: function (e) {
    var that = this
    if (e.currentTarget.dataset.index == 3) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
      return false
    }
    this.setData({
      index: e.currentTarget.dataset.index,
    })

  },

  /**
   * 
   * 回到首页
   */
  gohome: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },
  // 存电话
  savePhone: function (e) {
    console.log(e)
    wx.addPhoneContact({
      firstName: e.currentTarget.dataset.firstname, //名字
      mobilePhoneNumber: e.currentTarget.dataset.phone, //电话号码
      success(res) {
        console.log(res)
      }
    })

  },

  // 微信二维码
  weixinImage: function (e) {

    // // 第1步：创建动画实例 
    // var animation = wx.createAnimation({
    //   duration: 400, //动画时长 
    //   timingFunction: "ear", //线性 
    // });
    // // 第2步：这个动画实例赋给当前的动画实例 
    // this.animation = animation
    // // 第3步：执行第一组动画 
    // animation.opacity(0).step({
    //   duration: 0
    // })
    // // 第4步：导出动画对象赋给数据对象储存 
    // this.setData({
    //   animationData: animation.export()
    // })
    // // 第5步：设置定时器到指定时候后，执行第二组动画 
    // setTimeout(function () {
    //   // 执行第二组动画 
    //   animation.opacity(0.6).step()
    //   // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
    //   this.setData({
    //     animationData: animation
    //   })
    // }.bind(this), 50)
    // this.setData({
    //   isShowModal: true,
    // })

  },

  weixinImages: function () {
    wx.showToast({
      title: '您还没有上传微信二维码！',
      icon: 'none',
      duration: 2000
    })
  },
  hideModal: function (event) {
    this.setData({
      isShowModal: false,
    })
  },


  // 导航
  position: function (e) {
    console.log(e.currentTarget.dataset.wapmapurl)
    var wapmap = e.currentTarget.dataset.wapmapurl
    if (wapmap) {
      // 调用接口
      // 调用接口

      var wapmapurl = wapmap.split(',')
      console.log(wapmapurl)
      // var longitude = Number(wapmapurl[0])
      // var latitude = Number(wapmapurl[1])
      var demo = new QQMapWX({
        key: '7YPBZ-NHS6D-MEB45-P4O5V-RKZSK-KHBVI'
      });
      // 调用接口
      demo.reverseGeocoder({
        location: {
          latitude: Number(wapmapurl[1]),
          longitude: Number(wapmapurl[0])
        },
        coord_type: 3, //baidu经纬度
        success: (res) => {
          var latitude = res.result.location.lat;
          var longitude = res.result.location.lng;
          wx.openLocation({
            latitude,
            longitude,
            scale: 18
          })
          console.log('tx', latitude, longitude)
        },
        fail: (error) => {
          console.error(error);
        },
        complete: (res) => {
          console.log(res);
        }
      })
      // wx.openLocation({
      //   latitude,
      //   longitude,
      //   scale: 18
      // })
    }
  },
  // 跳转详情
  onDetailTap: function (e) {
    console.log(e)
    var newsClassId = e.currentTarget.dataset.newclassid
    var id = e.currentTarget.dataset.id
    var pagetitle = e.currentTarget.dataset.pagetitle
    if (newsClassId == 127) {
      wx.navigateTo({
        url: '/xpages/checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + newsClassId + '&objectId=' + id + '&type=0',
      })
    } else if (newsClassId == 128) {
      wx.navigateTo({
        url: '/xpages/checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + newsClassId + '&objectId=' + id + '&type=1',
      })
    } else if (newsClassId == 129) {
      wx.navigateTo({
        url: '/xpages/selectedchecklist/selectedchecklist?pagetitle=' + pagetitle + '&newsClassId=' + newsClassId + '&objectId=' + id,
      })
    } else if (newsClassId == 147) {
      wx.navigateTo({
        url: '/xpages/land/land?newsClassId=' + newsClassId + '&objectId=' + id + '&casetitle=' + pagetitle,
      })
    }
  },

  // 修改名片 或者去设计师主页
  mark_cards: function (e) {
    var id = e.currentTarget.dataset.id
    var designerid = e.currentTarget.dataset.designerid
    if (designerid) {
      wx.navigateTo({
        url: '../../xpages/allhouse_detail/allhouse_detail?id=' + designerid + '&newsClassId=' + 121,
      })
      return false
    } else if (e.currentTarget.dataset.gohome == 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateTo({
        url: '/businesscard/newmake_card/newmake_card?type=0' + "&id=" + id + "&hasUserInfo=true",
        // url: '/businesscard/make_cards/make_cards?type=0' + "&id=" + id,

      })
    }


  },



  saveimage: function (e) {

    wx.getSetting({
      success(res) {
        wx.downloadFile({
          url: e.currentTarget.dataset.imgurl,
          success: function (res) {
            console.log(res);
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.showToast({
                  title: "保存成功",
                  icon: "success",
                  duration: 2000
                });
              },
              fail: function (err) {
                console.log(err);
              },
              complete(res) {
                console.log(res);
              }
            });
          }
        });
      }
    });

  },

  //微信二维码事件
  imgYu: function (e) {
    var that = this;
    // var src = e.currentTarget.dataset.imgurl; //获取data-src
    // var photo = [src]; //将该图片放入一个数组中，每次点击时只查看一张
    // console.log(photo);
    // wx.previewImage({
    //   current: photo, //当前图片地址
    //   urls: photo, //所有要预览的图片的地址集合 数组形式
    //   success: function (res) {},
    //   fail: function (res) {},
    //   complete: function (res) {},
    // })

    wx.navigateTo({
      url: '../../businesscard/WchatQrc/WchatQrc?imgsrc=' + e.currentTarget.dataset.imgurl + '&UpPagedata=' + encodeURIComponent(JSON.stringify(that.data.cardDetail)),
    })
  },

  // 一键复制事件
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.wechatnum,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        });
      }
    });
  },

  //更多的点击事件
  More: function (e) {
    console.log(e)
    let newclassid = e.currentTarget.dataset.classid
    let pagetitle = e.currentTarget.dataset.title
    //毛坯房精装房
    if (newclassid == 127 || newclassid == 128) {
        wx.navigateTo({
          url: '../../xpages/roughhouse/roughhouse?newsClassId=' + newclassid + '&toptext=' + pagetitle,
        })
    }
    //全屋精选
    else if (newclassid == 129) {
      wx.navigateTo({
        url: '../../xpages/selected/selected?id=' + newclassid + '&toptext=' + pagetitle,
      })
    }
    //装修效果图
    else if (newclassid == 147) {
      wx.navigateTo({
        url: '../../xpages/designsketch/designsketch?id=' + newclassid + '&toptext=' + pagetitle,
      })
    }
  },
  onShow: function () {
    let that = this
    that.setData({
      isPageShow: false
    })
    if (that.data.returnedValue) {
      console.log("名片的onshow", that.data.returnedValue)
      let data = {
        memberId: app.globalData.memberid
      }
      api.request('/rest/shareApi/getBusinessCard', data, 'GET', function (e) {
        try {
          var grvideoLength = JSON.parse(e.data.businessCard.vedioIntroducePath).length
        } catch {
          var grvideoLength = 0
        }

        that.setData({
          cardDetail: e.data.businessCard,
          [`cardDetail.adImagePath`]:e.data.businessCard.adImagePath.split(',')
        })
      })
    }
  },
 

  //播放一个视频关闭另一个视频
  video_play: function (e) {
    var curIdx = e.currentTarget.id;
    // 没有播放时播放视频
    // console.log(curIdx)
    if (!this.data.indexCurrent) {
      this.setData({
        indexCurrent: curIdx
      })
      var videoContext = wx.createVideoContext(curIdx, this) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext(this.data.indexCurrent, this) //this是在自定义组件下，当前组件实例的this，以操作组件内 video 组件（在自定义组件中药加上this，如果是普通页面即不需要加）
      if (this.data.indexCurrent != curIdx) {
        videoContextPrev.pause()
        this.setData({
          indexCurrent: curIdx
        })
        var videoContextCurrent = wx.createVideoContext(curIdx, this)
        videoContextCurrent.play()
      }
    }
  },

  // 预览视频
  PlayVideo: function (e) {
    let that = this
    console.log(e)
    var path = e.currentTarget.dataset.videopath
    let index = e.currentTarget.dataset.index
    console.log(path)
    for (var i = 0; i < path.length; i++) {
      if (path[i].path) {
        that.data.videoArr.push({
          url: that.data.imgur + path[i].path,
          type: 'video'
        })
      } else {
        that.data.videoArr.push({
          url: that.data.imgur + path[i].vedioPath,
          type: 'video'
        })
      }
    }
    wx.previewMedia({
      sources: this.data.videoArr,
      current: index,
      success: function (res) {
        that.data.videoArr = []
      },
      fail: function (res) {}
    })
  },

  // 广告图点击事件
  selectedbtn: function (e) {
    console.log("点击广告返回的数据", e)
    console.log("点击广告返回的详情id", +e.currentTarget.dataset.id)
    let xcxpage = e.currentTarget.dataset.xcxpage //跳转到页面的页面路径
    let id = e.currentTarget.dataset.id
    console.log('详情id', id)
    let newclassid = e.currentTarget.dataset.newclassid
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
  // 隐藏活动列表
  hideactivite: function () {
    let that = this
    that.setData({
      isactivite: false
    })
  },

  lbaladv: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    //个人空间
    if (type == 'grkj') {
      var memeberId = that.data.cardDetail.memberId
      var belongStore = ''
      var isHead = true
    } else {
      var memeberId = ''
      var belongStore = that.data.cardDetail.brandId
    }
    let index = this.data.index
    let videoTitle = ""
    if(index == 2) {
      videoTitle = "拎包案例"
    } else if(index == 1) {
      videoTitle = "品牌介绍"
    } else if(index == 0) {
      videoTitle = "个人空间"
    }
    wx.navigateTo({
      url: '../../pages/video-list/video-list?type=' + type + '&belongStore=' + belongStore + '&memberId=' + memeberId+'&isHead='+isHead + '&videoTitle=' + videoTitle,
    })
  },


  // 转发名片的弹窗
  zfcard: function () {
    let that = this
    that.setData({
      androidDialog2: true
    })
  },
  close: function () {
    let that = this
    that.setData({
      androidDialog2: false
    })
  },
  storeVr(){
    if(!this.data.cardDetail.vrUrl){
      app.showToastMessage('暂无vr实景')
      return false
    }
    wx.navigateTo({
      url: '/xpages/h5page/h5page?url='+this.data.cardDetail.vrUrl,
    })
  },

  videometa:function (e) {
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success (res) {
        //视频的高
        var height = e.detail.height;
        //视频的宽
        var width = e.detail.width;;
        //算出视频的比例
        var proportion = height / width;
        //res.windowWidth为手机屏幕的宽。
        //res.windowWidth为手机屏幕的宽。
        var windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        //算出当前宽度下高度的数值
        height = proportion * (windowWidth-20);
        that.setData({
          height:Math.ceil(height * ratio),
          width:Math.ceil((windowWidth-20) * ratio)
        });
      }
    })
  },

})