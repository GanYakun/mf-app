
var app = getApp();
import {
  calculationfun
} from '../../utils/Heightset' //es6
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc:app.globalData.imgur
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var navHeight = calculationfun.constructors()
    this.setData({
      navHeight: navHeight.navHeight
    })
    console.log("我的名片页面传过来的图片路径",decodeURIComponent(options.UpPagedata))
this.setData({
  qrcimg:options.imgsrc,
})
    var a = await this.convertImage(options.imgsrc)
    console.log('a',a)
      this.setData({
        // qrcimg:options.imgsrc,
        test:a,
        PageData:JSON.parse(decodeURIComponent(options.UpPagedata))
      })
  },

  
  saveQrc:  function(e){　　　　　　　　　　　　　　　　//触发函数
    var path = e.currentTarget.dataset.imgurl
    console.log(path)
    wx.downloadFile({
      url: path,
      success:function(res){
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '请求授权',
                  content: '需要授权保存图片，请确认授权',
                  success: function (res) {
                    if (res.cancel) {
                      wx.showToast({
                        title: '拒绝授权',
                        icon: 'none',
                        duration: 1000
                      })
                    } else if (res.confirm) {
                      wx.openSetting({
                        success: function (dataAu) {
                          if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'success',
                              duration: 1000
                            })
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'none',
                              duration: 1000
                            })
                          }
                        }
                      })
                    }
                  }
                })
                }else{
                  wx.showToast({
                    title: '保存图片失败',
                    icon:'none',
                    duration:1000
                  })
                }
              }
            })
          }
        })
      },
      fail:function(){
        wx.showToast({
          title: '保存图片失败',
          icon:'none',
          duration:1000
        })
      }
    })
         
      

  },

  //查看二维码
  lookQrc:function(e){
    var src = e.currentTarget.dataset.imgurl; //获取data-src
    var photo = [src]; //将该图片放入一个数组中，每次点击时只查看一张
    console.log(photo);
    wx.previewImage({
      current: photo, //当前图片地址
      urls: photo, //所有要预览的图片的地址集合 数组形式
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  convertImage: function (url) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#convertor')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          const image = canvas.createImage()
          image.src = url
          image.onload = function () {
            canvas.width = image.width
            canvas.height = image.height
            var sysInfo = wx.getSystemInfoSync()
            var width = sysInfo.windowWidth
            var height = sysInfo.windowHeight
            canvas.width = width
            canvas.height = height
            ctx.drawImage(image, 0, 0, width, height)
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: canvas.width,
              height: canvas.height,
              destWidth: width,
              destHeight: height,
              canvas: canvas,
              success(res) {
                resolve(res.tempFilePath)
              }
            })
          }
        })
    })
  },

  

 
})