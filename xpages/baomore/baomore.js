var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choice: [{
      name: '流行风格',list:['全部','简约时尚','北欧格调','美式风情','全部'],flag:false,select:'全部'
    }, {
      name: '整装户型',list:['全部','普通住宅','全部','全部','全部'],flag:false,select:'全部'
    }, {
      name: '空间设计',list:['全部','全部','全部','全部','全部'],flag:false,select:'全部'
    }, {
      name: '楼盘位置',list:['全部','全部','全部','全部','全部'],flag:false,select:'全部'
    },
    {
      name: '设计师',list:['全部','全部','全部','全部','全部'],flag:false,select:'全部'
    }],
    shoplist: [{
      imgurl: 'http://116.55.251.19/group1/M00/00/59/dDf7E18VfQaAJ4WcAAK93l6tfrM921.jpg',
     
      user: '抛光砖预付定金',
      
      frequency: '125.40'
    },
    {
      imgurl: 'http://116.55.251.19/group1/M00/00/59/dDf7E18VfQaAJ4WcAAK93l6tfrM921.jpg',
      introduce: '内外通透北欧风格',
      user: '郭浩',
      address: '木菲大悦城店[昆明]',
      frequency: '11'
    },{
      imgurl: 'http://116.55.251.19/group1/M00/00/59/dDf7E18VfQaAJ4WcAAK93l6tfrM921.jpg',
      introduce: '内外通透北欧风格',
    
      user: '郭浩',
      address: '木菲大悦城店[昆明]',
      frequency: '11'
    }],
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
        pageWindowHeight:pageWindowHeight
      })
    }
  })

//查询本月爆款的数据
let data = {
  start:1,
  pageSize:12,
  cid:0
}
  api.request('/rest/tWebPromotionsControllerApi/getHotDetailsList', data, 'GET', function(e){
    this.setData({
      shoplist:e.data
    })
    
  })
  },

  //筛选点击事件
  powerDrawer: function () {
    this.drawer.powerDrawerzujian()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   //获得drawer组件
   this.drawer = this.selectComponent("#drawer");
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