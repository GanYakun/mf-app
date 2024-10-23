
    import WeCropper from '../../utils/cropper/we-cropper.js'
    const device = wx.getSystemInfoSync() // 获取设备信息
    const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
    const height = device.windowHeight -50 
    // const height = width
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 300) / 2, // 裁剪框x轴起点
        y: (height - 300) / 2, // 裁剪框y轴期起点
        width: 300, // 裁剪框宽度
        height: 300 // 裁剪框高度
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    let that = this
    
    var iscro = await that.weCropperfun()
    if(iscro == 1){
      const src = options.url
      console.log(src)
      that.cropper.pushOrign(src)
    }
  },

  //实例化裁剪图片的组件
  weCropperfun:function(){
    let that = this
    return new Promise((resove,reject)=>{
      const { cropperOpt } = that.data
      that.cropper = new WeCropper(cropperOpt)
          .on('ready', (ctx) => {
              console.log(`wecropper is ready for work!`)
          })
          .on('beforeImageLoad', (ctx) => {
              wx.showToast({
                  title: '上传中',
                  icon: 'loading',
                  duration: 20000
              })
          })
          .on('imageLoad', (ctx) => {
              wx.hideToast()
          })
          resove(1)
    })
   
  },
  touchStart (e) {
    console.log(e)
    console.log(this.cropper)
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    var that = this;
    console.log(e)
    that.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
   //...
   uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        self.cropper.pushOrign(src)
      }
    })
  },


  //导出图片
  getCropperImage () {
    this.wecropper.getCropperImage((tempFilePath) => {
      // tempFilePath 为裁剪后的图片临时路径
      if (tempFilePath) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          CroTempFilePath: tempFilePath,
        })
        wx.navigateBack({
          delta: 1 //想要返回的层级
        })
      } else {
        wx.showToast({
          title: '获取图片地址失败，请稍后重试',
          icon:'none'
        })
        console.log('获取图片地址失败，请稍后重试')
      }
    })
   },

   cancel:function(){
    wx.navigateBack({
      delta: 1,  // 返回上一级页面。
   })
  }
})