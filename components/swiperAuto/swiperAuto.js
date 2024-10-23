// swiper高度自适应组件
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgarr: {
      type: Array,
      value: [] //图片数组
    },
    current :{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgur: app.globalData.imgur,
    imgheights: [],
    current: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // swiper滑动事件
    bindchange: function (e) {
      this.setData({
        current: e.detail.current,
        imglod: this.data.imglod + 1
      })
    },
    imageLoad: function (e) {
      //获取图片真实宽度  
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        //宽高比  
        ratio = imgwidth / imgheight;
      //计算的高度值  
      var viewHeight = 750 / ratio;
      var imgheight = viewHeight;
      var imgheights = this.data.imgheights;
      //把每一张图片的对应的高度记录到数组里  
      imgheights[e.target.dataset.id] = imgheight;
      this.setData({
        imgheights: imgheights
      })
    },

    //查看图片
    previewimg: function (e) {
      console.log(e)
      var index = e.currentTarget.dataset.id;
      var imgArr = this.data.imgarr;
      var imgur = this.data.imgur
      var arr = []
      imgArr.forEach((v, k) => {
        arr.push(imgur + v.imagePath)
      });
      app.log('图片数组',{imgArr:arr,imgur:imgur})
      wx.previewImage({
        current: arr[index], // 当前显示图片的http链接
        urls: arr // 所有要预览的图片的地址集合 数组形式
      })
    },
  },

})