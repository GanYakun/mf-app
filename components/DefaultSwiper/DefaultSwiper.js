var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    DataArr:{
  type:Array,
  value:[]
}
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgur: app.globalData.imgur,
    imgheights: [],
  },

  lifetimes: {
    attached: function() {
      //同步获取设备宽度
      let sysinfo = wx.getSystemInfoSync()
      this.setData({
        sysinfo: sysinfo
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // swiper滑动事件
    bindchange: function (e) {
      this.setData({
        current: e.detail.current
      })
    },
    imageLoad: function (e) { 
      console.log("load", e)
      //图片的原始宽度
      let imagewidth = e.detail.width;
      // console.log("屏幕宽度", imagewidth)
      //图片的原始高度
      let imageheight = e.detail.height
      let sysinfo = this.data.sysinfo
      //获取转换rpx的参数
      let ratio = 750 / sysinfo.windowWidth;
      //屏幕宽度
      let screenWidth = sysinfo.screenWidth
      //屏幕和原图的比例
      let scale = screenWidth / imagewidth
      // console.log(scale)
      //设置容器的高度
      this.setData({
        swheight: Math.ceil((imageheight * scale)*ratio)
      })
    },

    //查看图片
    previewimg: function (e) {
      // console.log(e)
      var index = e.currentTarget.dataset.id;
      var imgArr = this.data.imgarr;
      var imgur = this.data.imgur

      var arr = []
      imgArr.forEach((v, k) => {
        arr.push(imgur + v.imagePath)
      });

      wx.previewImage({
        current: arr[index], // 当前显示图片的http链接
        urls: arr // 所有要预览的图片的地址集合 数组形式
      })
    },

    //广告图点击事件
    selectedbtn: function (e) {
      console.log("点击广告返回的数据", e)
      console.log("点击广告返回的详情id", +e.currentTarget.dataset.id)
      let xcxpage = e.currentTarget.dataset.xcxpage       //跳转到页面的页面路径
      let id = e.currentTarget.dataset.id
      let newclassid = e.currentTarget.dataset.newclassid
      let specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
      let url = e.currentTarget.dataset.url
      let modelName = e.currentTarget.dataset.modelname
      console.log('所有广告的点击事件的url', url,'页面路径',xcxpage)
      console.log('所有广告的点击事件newclassId', newclassid)
            if(xcxpage){
              console.log('走进了新版广告图的方法')
              if( modelName == 'mallItemSkuVO'){
                let xcxpageurl = xcxpage.split('?')
                console.log(xcxpageurl)
                wx.navigateTo({
                  url: xcxpageurl[0]+'?newsClassId='+155+'&NeworderType='+xcxpageurl[1]+'&objectId='+id+'&categoryId='+newclassid
                  //categoryId只限产品部分，筛选时候用得倒，可能是cid
               })
              }else{
                wx.navigateTo({
                  url: xcxpage+'?newsClassId='+newclassid+'&objectId='+id,
               })
              }
          }
          else if (url) {
            wx.navigateTo({
              url: '../../xpages/h5page/h5page?url=' + url,
            })
          } 
  
  
    },
  }
})
