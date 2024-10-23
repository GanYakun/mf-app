var api = require("../../utils/api.js")
var app = getApp()
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
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.toptext,
    })
    this.setData({
      imgur: app.globalData.imgur
    })
 

    //查询子栏目
    if(options.isfurniture){
      var isnav = ''
this.setData({
  isfurniture:options.isfurniture
})
    }else{
      var isnav = 1
    }
    let data2 = {
      isNav: isnav,
      parentId: options.id
    }
    api.request('/rest/newsClass/getNewsClassList', data2, 'GET', this.column)

  },

 


  /**
   * 
   * 子栏目数据
   * 
   */
  column: function (e) {
    var that = this
    that.setData({
      topcolun: e.data
    })
    var arr = e.data
    console.log(arr)
    for(var i = 0;i<arr.length;i++){
      console.log(i)
     let index = i
      let data1 = {
        newsclassId: arr[i].id,
        limitNum:3
      }
      api.request('/rest/tWebArticalControllerApi/list', data1, 'GET', function(res){
  let arrs = res.data
  let list = 'topcolun['+index+'].list'
  console.log(list)
        that.setData({
          [list]:arrs
        })
      })
    }
  },



  /**
   * 
   * 列表里的数据点击事件
   * 
   */
  listshuju: function (e) {
    let videos = e.currentTarget.dataset.videopath
    let title = e.currentTarget.dataset.title
      let classid = e.currentTarget.dataset.id
      console.log(classid)
    wx.navigateTo({
      url: '../videodetails/videodetails?videoa='+videos+'&newsclassid='+classid+'&title='+title
    })
      
  },


  /**
   * 
   * 子栏目点击更多
   * 
   */
  morevideo:function(e){
let id = e.currentTarget.dataset.id
let name = e.currentTarget.dataset.name
wx.navigateTo({
  url: '../morevideo/morevideo?id='+id+'&name='+name,
})
  }
})