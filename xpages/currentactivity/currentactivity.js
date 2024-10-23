var api = require("../../utils/api.js")
var app = getApp()
var WxParse = require("../../wxParse/wxParse.js")
import tool from "../../utils/FunctionThrottling"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    zongprice: 0,
    num: 0,
    isnoshuzu: false,
    cids: '',
    isbuy: true,
    testnum: 0,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    isSetTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载函数', options)
    var that = this
    that.setData({
      imgur: app.globalData.imgur,
      scrollheight: app.globalData.pageWindowHeight,
      promotionsperiod: options.promotionsperiod
    })
    //查询大礼包列表的详细信息
    if (options.Giftbag) {
      let promotionsContent = decodeURIComponent(options.miaoshu)
      console.log(promotionsContent)
      if (promotionsContent == 'null') {
        that.setData({
          nopromotionsContent: false
        })
      } else {
        that.setData({
          nopromotionsContent: true
        })
      }
      if (promotionsContent) {
        let article = promotionsContent.replace(/<img/gi, '<img class="rich-img" ')
        WxParse.wxParse('article', 'html', article, that, 5);
      }
      that.setData({
        cuxiaoid: options.Giftbag,
        buyItAlone: options.buyItAlone
      })
      let xiangxidata = {
        promotionsId: options.Giftbag
      }
      api.request('/rest/tWebPromotionsControllerApi/getDetailsListBySku', xiangxidata, 'GET', async function (e) {
        that.setData({
          xiangoulist: e.data
        })
        //如果是整单购买
        if (options.buyItAlone == 0) {
          that.setData({
            idarr: []
          })
          let idarr = await that.chicoeshop(e.data)
          that.setData({
            idarr: idarr
          })
          console.log(that.data.zongprice)
        }
      })
    } else {
      that.setData({
        isnoshuzu: true
      })
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        duration: 1000
      })
    }

  },
  // 整单购买循环传入id
  chicoeshop: function (e) {
    let arr = []
    let test = 0
    let zongprice = 0
    let that = this
    return new Promise((resove, reject) => {
      wx.showLoading({
        title: '加载中'
      })
      e.forEach((v, k) => {
        arr.push(v.id + ':' + v.limitCounts)
        test = test + 1
        zongprice = parseFloat((zongprice + parseFloat((v.skuPrice * v.limitCounts).toFixed(2))).toFixed(2))
      })
      if (e.length == test) {
        console.log(zongprice)
        resove(arr)
        wx.hideLoading({})
        that.setData({
          zongprice: zongprice
        })
      }
    })
  },



  /**
   * 
   * 点击方框事件
   * 
   */
  isxuanzhong: function (e) {
    var that = this
    console.log(that.data.isxuanzhongclick)
    if (that.data.isxuanzhongclick) {
      return false
    }
    that.setData({
      isxuanzhongclick: true,
    })

    console.log(e)
    let index = e.currentTarget.dataset.index
    let isclick = e.currentTarget.dataset.isclick
    let pid = e.currentTarget.dataset.pid
    let num = e.currentTarget.dataset.num == 0 ? 1 : e.currentTarget.dataset.num //商品的数量
    let limitcounts = e.currentTarget.dataset.limitcounts //限购数量
    let surplusstock = e.currentTarget.dataset.surplusstock //库存
    if (num > limitcounts) {
      wx.showToast({
        title: '每人限购' + limitcounts,
        icon: 'none'
      })
    } else if (num > surplusstock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      that.setData({
        isxuanzhongclick: false,
       
      })
      return false
    }
    let minoneprice = e.currentTarget.dataset.minoneprice * num

    if (!isclick) {
      let list = 'xiangoulist[' + index + '].isclick'
      let lista = 'arr[' + index + ']'
      that.setData({
        [lista]: pid,
        [list]: true,
        num: that.data.num - 1 + 2,
        zongprice: parseFloat((minoneprice + that.data.zongprice).toFixed(2)),
        isxuanzhongclick: false
      })
    } else {
      if (isclick) {
        that.data.arr.splice(index, 1)
        let num = that.data.num - 1
        that.setData({
          num: num,
          zongprice: parseFloat((that.data.zongprice - minoneprice).toFixed(2))
        })
      } else {
        let list = 'arr[' + index + ']'
        that.setData({
          [list]: pid,
          num: that.data.num - 1 + 2,
          zongprice: parseFloat((minoneprice + that.data.zongprice).toFixed(2))
        })
      }
      let list = 'xiangoulist[' + index + '].isclick'
      that.setData({
        [list]: !isclick,
        isxuanzhongclick: false,
        isAllclick:false
      })
    }
  },



  /** 
   * 
   *结算 
   * 
   */

  settlement: async function (e) {
    let that = this;
    // api.newget('/rest/tWebPromotionsControllerApi/isgiftBag?period=' + that.data.promotionsperiod, {}, 'POST',
    //   function (res) {
    //     console.log(res)
    //     if (res.code == 500) {
    //       // wx.showToast({
    //       //   title: '只能购买一次',
    //       //   icon:'none',
    //       //   duration:1000
    //       // })
    //     }
    //   })
    console.log(app.globalData)
    if (app.globalData.isemployee == 1) {
      wx.showToast({
        title: '主任不能购买此大礼包',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.buyItAlone == 0) {
      var chioceshopIdarr = that.data.idarr
      var nums = 0
    } else {
      var chioceshopIdarr = (await that.chiocecid()).cids
      var nums = (await that.chiocecid()).nums
    }
    if (chioceshopIdarr == '') {
      wx.showToast({
        title: '未选择商品',
        icon: 'none', //如果要纯文本，不要icon，将值设为'none'
        duration: 1500
      })
    } else {
      console.log(chioceshopIdarr)
      let end = chioceshopIdarr[chioceshopIdarr.length - 1]
      if (end == this.data.cuxiaoid) {

      } else {
        chioceshopIdarr.push(this.data.cuxiaoid)
      }
      let xids = chioceshopIdarr.join(',')
      console.log(xids)
      let extendData = {}
      extendData['cartId'] = xids;
      if (nums == 0) {
        var data = {
          type: '3',
          ids: JSON.stringify(extendData),
        }
      } else {
        var data = {
          type: '3',
          ids: JSON.stringify(extendData),
          orderClassification: 0
        }
      }

      api.newget('/rest/memberCenter/nowBuy', data, 'GET', function (e) {

        let arr = JSON.stringify(e.data)
        if (e) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (e.message == '未登录') {
            wx.showLoading({
              title: '加载中...',
              duration: 1000,
            });
            app.obtaintoken()
          } else if (e.code == 200) {
            wx.navigateTo({
              url: '../../xpages/orderattribute/orderattribute?data=' + arr + '&isrecommenderId=' + 1,
            })
          }
        }
      })
    }

  },

  /** 
   * 
   * 循环选中的数据
   * 
   * 
   */
  chiocecid: function () {
    return new Promise((resove, reject) => {
      var that = this
      var cids = []
      var nums = []
      that.data.xiangoulist.forEach(function (v, k) {
        if (v.isclick) {
          console.log("进入循化，输出id", v.id)

          if (v.total == 0) {
            nums.push(1)
            cids.push(v.id + ':' + 1)
          } else {
            nums.push(v.total)
            cids.push(v.id + ':' + v.total)
          }
        }
      })
      console.log(cids)
      resove({
        cids: cids,
        nums: nums
      })
    })
  },

  // 礼包数量减
  numjian: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let isclick = e.currentTarget.dataset.isclick //判断该商品是否选中

    let num = e.currentTarget.dataset.num
    let nums = num - 1
    let xiangoulist = 'xiangoulist[' + index + '].total'
    if (nums < 1) {
      wx.showToast({
        title: '不够减了',
        icon: 'none'
      })
      return false
    } else {
      that.setData({
        [xiangoulist]: nums
      })
      if (isclick) {
        console.log(e.currentTarget.dataset.minoneprice)
        let minoneprice = e.currentTarget.dataset.minoneprice
        that.setData({
          zongprice: parseFloat((that.data.zongprice - minoneprice).toFixed(2))
        })
      }
    }
  },
  // 礼包数量加
  numjia: function (e) {
    let that = this
    let num = (e.currentTarget.dataset.num == 0 ? 1 : e.currentTarget.dataset.num)
    let index = e.currentTarget.dataset.index
    let isclick = e.currentTarget.dataset.isclick //判断该商品是否选中
    console.log(isclick)
    console.log('礼包数量加', num)
    let nums = num + 1
    let limitcounts = e.currentTarget.dataset.limitcounts //限购数量
    let surplusstock = e.currentTarget.dataset.surplusstock //库存
    let xiangoulist = 'xiangoulist[' + index + '].total'
    if (nums > limitcounts) {
      wx.showToast({
        title: '每人限购' + limitcounts,
        icon: 'none'
      })
    } else if (nums > surplusstock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return false
    } else {
      that.setData({
        [xiangoulist]: nums
      })
      if (isclick) {
        console.log(e.currentTarget.dataset.minoneprice)
        let minoneprice = e.currentTarget.dataset.minoneprice
        that.setData({
          zongprice: parseFloat((that.data.zongprice + minoneprice).toFixed(2))
        })
      }
    }
  },


  //全选
  allclick: function (e) {
    let that = this
    
    // clearTimeout(that.data.setTime)
    let isAllclick = this.data.isAllclick
    if (!that.data.IntervalTime) {

    } else {

    }
    console.log(isAllclick)
    if (isAllclick) {
      that.setData({
        isAllclick: false,
        ['IntervalArr[1]']: e.timeStamp
      })
    } else {
      that.setData({
        isAllclick: true,
        ['IntervalArr[0]']: e.timeStamp
      })
    }
    if (that.data.IntervalArr[1] && that.data.IntervalArr[0]) {
      var IntervalTime = that.data.IntervalArr[1] - that.data.IntervalArr[0]
      if (IntervalTime < 0) {
        var IntervalTime = that.data.IntervalArr[0] - that.data.IntervalArr[1]
      }
      console.log(IntervalTime)
      if (IntervalTime > 500) {
        let allclickson = that.allclickson(isAllclick ? false : true)
        that.data.isSetTime = 1
      } else {
        clearTimeout(that.data.setTime)
      }
      that.data.setTime =setTimeout(() => {
        let allclickson = that.allclickson(isAllclick ? false : true)
      }, 800);
    } else {
      let allclickson = that.allclickson(isAllclick ? false : true)
    }
  },

  //全选子方法
  allclickson: function (e) {
    let zongprice = 0
    console.log(e)
    let that = this
    return new Promise((resove, reject) => {
      that.data.xiangoulist.forEach((v, k) => {
        if (v.surplusStock == 0 || v.limitCounts == 0) {} else {
          let setvalue = 'xiangoulist[' + k + '].isclick'
          that.setData({
            [setvalue]: e
          })
          zongprice = parseFloat((zongprice + parseFloat((v.skuPrice * (v.total == 0 ? 1 : v.total)).toFixed(2))).toFixed(2))
          that.setData({
            zongprice: e ? zongprice : 0
          })
          console.log(zongprice)
        }



        if (k + 1 == that.data.xiangoulist.length) {
          resove('ok')
        }
      })
    })
  },
 
})