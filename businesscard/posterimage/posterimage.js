// businesscard/posterimage/posterimage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcappnoshare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      imgsrc: options.transformation,
      type:options.type
    })
  },

onShow:function(){
  wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
},

  saveimage: function (e) {
    wx.saveImageToPhotosAlbum({
      filePath: e.currentTarget.dataset.imgurl,
      success(res) {
        console.log(res)
        wx.showToast({
          title: '保存图片成功！',
        })
      },
      fail(res) {
        wx.showToast({
          title: '保存图片失败！',
          icon:'none'
        })
      }
    })
  },

  saveimage: function(e){　　　　　　　　　　　　　　　　//触发函数
          wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
            filePath: e.currentTarget.dataset.imgurl,
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
  //轮播图点击预览
  imgYu: function (e) {
    var src = e.currentTarget.dataset.imgurl; //获取data-src
    console.log(src)
    var photo = [src]; //将该图片放入一个数组中，每次点击时只查看一张
    console.log(photo);
    wx.previewImage({
      current: photo, //当前图片地址
      urls: photo, //所有要预览的图片的地址集合 数组形式
      success: function (res) {

      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  
})