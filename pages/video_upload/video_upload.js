// pages/video_upload/video_upload.js
var api = require("../../utils/api.js")
var app = getApp()
var rows = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    imgur:app.globalData.imgur

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let data = {
      typegroupCode: 'web_vedio_type'
    }
    api.newget('/rest/memberCenter/getVedioList?page=1&rows='+rows, {}, 'GET', function (e) {
      that.setData({
        startPage: 1,
        videoList: e.data.results,
        videoListLength:e.data.total
      })
    })
    api.request('/rest/dataDictionaryApi/dataDictionary/', data, 'GET', function (e) {
      let arr = e.data
      that.setData({
        TypeArr: arr
      })
    })
  },

  //上传视频
  UploadVideo: function (e) {
    let that = this
    if (that.data.vedioIntroduce) {
      that.test()
      return false
    }
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log('测试视频上传', res.tempFilePath)
        wx.showLoading({
          title: '加载中...',
        })
        wx.compressVideo({
          quality: 'high',
          src: res.tempFilePath,
          success(comres) {
            wx.uploadFile({
              url: app.globalData.upurl + '/rest/memberCenter/imageUpload',
              filePath: comres.tempFilePath,
              name: 'file', //服务器定义的Key值   
              header: {
                "content-type": "application/x-www-form-urlencoded",
                'X-AUTH-TOKEN': app.globalData.token
              },
              formData: {
                "user": "test",
              },
              success: function (e) {
                wx.hideLoading({})
                console.log('视频上传成功', e)
                wx.showToast({
                  title: '视频上传成功',
                  icon: 'none'
                })
                that.setData({
                  videoPath: comres.tempFilePath,
                  isxshow: true,
                  vedioIntroduce: e.data
                })
              },
              fail: function (e) {
                wx.hideLoading({})
                console.log('视频上传失败', e)
                wx.showToast({
                  title: '视频上传失败',
                  icon: 'none'
                })
              },

            })

          }
        })


      }
    })

  },
  //弹窗测试
  test: function () {
    let that = this
    that.setData({
      isxshow: true
    })
  },
  close: function () {
    let that = this
    that.setData({
      isxshow: false
    })
  },

  //picker选择器事件
  bindPickerChange: function (e) {
    let that = this
    console.log(e)
    let index = e.detail.value
    that.setData({
      videoCode: that.data.TypeArr[index].typecode,
      videoTypeName: that.data.TypeArr[index].typename
    })
  },

  //确定事件
  addvideo: function () {
    let that = this
    that.setData({
      isaddvideo:0
    })
    if (that.data.videoCode) {
      let data = {
        vedio: that.data.vedioIntroduce,
        type: that.data.videoCode
      }
      api.newget('/rest/memberCenter/saveUpdateVedio', data, 'POST', function (e) {
        console.log(e)
        if (e.data) {
          that.setData({
            vedioIntroduce: '',
            videoPath: '',
            videoCode: ''
          })
          that.close()
          that.oneVideoList()
        }
      })

    } else {
      wx.showToast({
        title: '请选择分类',
        icon: 'none',
      })
      return false
    }
  },

  //滑动加载
  slidetop: function () {
    let that = this
    let startPage = that.data.startPage + 1
    api.newget('/rest/memberCenter/getVedioList?page='+startPage + '&rows=' + rows, {}, 'GET', function (e) {
      console.log(e.data.results.length)
      if (e.data.results.length == 0) {
        wx.showToast({
          title: '已经到底了',
          icon:'none'
        })
      } else {
        that.setData({
          startPage: startPage,
          videoList: that.data.videoList.concat(e.data.results)
        })
      }

    })
  },
  oneVideoList:function(){
    let that =this
    api.newget('/rest/memberCenter/getVedioList?page=1' + '&rows=' + 1, {}, 'GET', function (e) {
      that.data.videoList.unshift(e.data.results[0])
        that.setData({
          videoList: that.data.videoList,
          isaddvideo:1
        })
    })
  
  }
})