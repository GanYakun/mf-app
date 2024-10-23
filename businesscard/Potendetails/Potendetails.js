import {
  calculationfun
} from '../../utils/Heightset' //es6
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面Onload参数1", options)
    var OptionsFather = JSON.parse(decodeURIComponent(options.item))
    console.log("页面Onload参数", OptionsFather)
    var that = this
    var navHeight = calculationfun.constructors()
    that.setData({
      navHeight: navHeight.navHeight,
      Useid: OptionsFather.id,
      PotentialcustomersName: OptionsFather.decodeNick,
      PotentialcustomersPhone: (OptionsFather.phone ? OptionsFather.phone : OptionsFather.account),
      PotentialcustomersTime: OptionsFather.createDate
    })
    // 浏览足迹列表
    let data = {
      memberId: OptionsFather.id
    }
    api.newget('/rest/memberCenter/getMemberBrowseList?page=' + 1 + '&rows=' + 12, data, 'POST', function (e) {
      if (e) {
        that.setData({
          list: e.data,
          start: 1
        })
      }
    })



  },

  // 查看
  looklistdetail: function (e) {
    let newClassid = e.currentTarget.dataset.newclassid
    let objectid = e.currentTarget.dataset.objectid
    let title = e.currentTarget.dataset.title
    console.log(newClassid, '产品详情的id', objectid)
    //产品
    if (newClassid == 14) {
      wx.navigateTo({
        url: '../../xpages/shop/shop?objectId=' + objectid + "&typeId=" + '' + "&productName=" + title + '&itemName=' + '' + '&cid=' + 0 +'&NeworderType='+0,
      })
    }
    //毛坯房
    else if (newClassid == 8) {
      wx.navigateTo({
        url: '../../xpages/checklist/checklist?pagetitle=' + title + '&newsClassId=' + 127 + '&objectId=' + objectid + '&type=0',
      })
    }
    //精装房
    else if (newClassid == 9) {
      wx.navigateTo({
        url: '../../xpages/checklist/checklist?pagetitle=' + title + '&newsClassId=' + 128 + '&objectId=' + objectid + '&type=1',
      })
    }
    //文章详情
    else if(newClassid == 57){

    }
    //全屋精选
    else if(newClassid == 10){
      wx.navigateTo({
        url: '../../xpages/selectedchecklist/selectedchecklist?pagetitle=' + title + '&newsClassId=' +  129+ '&objectId=' + objectid,
      })
    }

  },


  //分页
  lower: function () {
    var that = this
    // 内部员工和经纪人的潜在客户列表
    if (that.data.islast) {
      wx.showToast({
        title: '没有数据了...',
        icon: 'none'
      })
      return false
    }
    var startlower = that.data.start + 1
    let data = {
      memberId: that.data.Useid
    }
    api.newget('/rest/memberCenter/getMemberBrowseList?page=' + startlower + '&rows=' + 12, data, 'POST', function (e) {
      if(e){
        console.log(e.data.length)
        if (e.data.length > 0) {
          that.setData({
            start:startlower,
            list: that.data.list.concat(e.data)
          })
        } else {
          that.setData({
            islast: true
          })
        }
      }else{
        that.setData({
          islast: true
        })
      }
     
    })
  }
})