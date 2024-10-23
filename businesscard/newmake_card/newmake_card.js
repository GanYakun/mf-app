var api = require("../../utils/api.js")
var app = getApp()
const requestCenter = require('../../http/request-center.js')
import WeCropper from '../../utils/cropper/we-cropper.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.imgur,
    pindex: 0,
    qcappnoshare: true,
    hasUserInfo: false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(app.globalData)
    console.log('options', options)
    that.setData({
      type: options.type,
      id: options.id,
      nouserimg: app.globalData.userimg,
      hasUserInfo: options.hasUserInfo
    })
    // type = 0 时 证明已经生成名片过
    if (options.type == 0) {
      let data = {
        memberId: app.globalData.memberid
      }
      api.request('/rest/shareApi/getBusinessCard', data, 'GET', function (e) {
        var data1 = e.data.businessCard
        that.storeQuery(data1.belongStore) //查询门店信息
        
        if (e.code == 200) {
          that.setData({
            phone: data1.phone,
            userimg: app.globalData.imgur + data1.headPortraitPath, //头像
            weixinNumber: data1.weixinNumber, //微信号
            wxImages: data1.weixinImagePath,
            backgroundImages: data1.backgroundImagePath,
            personalIntroduction: data1.personalIntroduction,
            weixinImage: data1.weixinImage,
            backgroundImage: data1.backgroundImage,
            headPortrait: data1.headPortrait,
            VideoArr: that.data.VideoArr,
            vedioIntroduce: data1.vedioIntroduce,
            adImageIntroduce: data1.adImageIntroduce,
            cardImagePath: data1.adImagePath ? data1.adImagePath.split(',') : '',
            cardAdImage: data1.adImage,
            cardVedioPath: data1.vedioPath,
            cardVedioPathVirtual: data1.vedioPathVirtual
          })
        }
      })
    } else {
      that.storeQuery(0) //查询门店信息
    }
  },

  //输入微信号
  weixinNumber: function (e) {
    this.setData({
      weixinNumber: e.detail.value
    })
  },

  //查询门店 
  storeQuery: function (even) {
    let that = this
    let data = {}
    api.request('/rest/dataDictionaryApi/physicalSotreList', data, 'GET', function (e) {
      let arr = e.data
      e.data.unshift({
        ID: 0,
        NAME: '请选择'
      })
      that.setData({
        storeArr: arr
      })
      for (var i = 0; i < arr.length; i++) {
        if (even == arr[i].ID) {
          that.setData({
            pindex: i
          })
        }
      }

    })
  },

  //上传微信二维码
  weImage: function (e) {
    console.log(e)
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res, 'res')
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          img: e.currentTarget.dataset.img,
          wxImages: res.tempFilePaths,
          wximg: 'new'
        })
        wx.uploadFile({
          url: app.globalData.upurl + '/rest/memberCenter/imageUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart/form-data",
            'X-AUTH-TOKEN': app.globalData.token
          },
          formData: {
            "user": "test",
          },
          success(res) {
            console.log('77777', res)
            that.setData({
              weixinImage: res.data
            })

          }
        })
      }
    })

  },

  //上传名片背景
  backgroundImage: function (e) {
    console.log(e)
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res, 'res')
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("测试图片的上传", tempFilePaths)
        that.setData({
          img: e.currentTarget.dataset.img,
          backgroundImages: res.tempFilePaths,
          imgurl: app.globalData.imgur,
          bgimg: 'new'
        })
        wx.uploadFile({
          url: app.globalData.upurl + '/rest/memberCenter/imageUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart/form-data",
            'X-AUTH-TOKEN': app.globalData.token
          },
          formData: {
            "user": "test",
          },
          success(res) {
            console.log('77777', res)
            that.setData({
              backgroundImage: res.data
            })

          }
        })
      }
    })

  },

  // 点击上传图片（头像）
  chooseImage: function (e) {
    console.log(e)
    let that = this
    // that.setData({
    //   img:e.currentTarget.dataset.img
    // })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res, 'res')
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.navigateTo({
          url: '../Cropimage/Cropimage?url=' + tempFilePaths,
        })
        return false
      }
    })

  },

  //输入个人简介
  personalIntroduction: function (e) {
    this.setData({
      personalIntroduction: e.detail.value
    })
  },

  //视频介绍输入事件
  videoInput(e) {
    console.log(e)
    this.data.videoInputIntro = e.detail.value,
      this.data.vedioIntroduce = e.detail.value
  },
  //图片介绍输入事件
  imgIntroInput(e) {
    this.data.manyImgIntroduce = e.detail.value
    this.data.adImageIntroduce = e.detail.value
  },
  // 获取用户头像
  getUserProfile(e) {
    if (!this.data.hasUserInfo) {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          console.log('avatarUrl', res.userInfo.avatarUrl)
          this.setData({
            userimg: res.userInfo.avatarUrl,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 生成名片
  onTap: async function () {
    let isUpload = await this.isUpload()
    let that = this;
    var type = that.data.type
    let token = app.globalData.token
    var id = that.data.id
    var personalIntroduction = that.data.personalIntroduction
    var headPortrait = that.data.headPortrait
    var weixinNumber = that.data.weixinNumber
    var weixinImage = that.data.weixinImage
    var backgroundImage = that.data.backgroundImage
    var belongStore = that.data.storeArr[that.data.pindex].ID
    if (that.data.pindex == 0) {
      app.showToastMessage('请选择门店')
      return false
    }  else if (!headPortrait) {
      app.showToastMessage('请上传头像')
      return false
    }
    // return
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token
    }
    if (type == 0) {
      let data = {
        personalIntroduction: personalIntroduction,
        memberId: app.globalData.memberid,
        headPortrait: headPortrait,
        weixinNumber: weixinNumber,
        weixinImage: weixinImage,
        backgroundImage: backgroundImage,
        id: id,
        belongStore: belongStore,
        vedioPath: isUpload ? isUpload.upVideoResult || '' : '',
        adImage: this.data.cardAdImage || '',
        vedioIntroduce: this.data.videoInputIntro || this.data.vedioIntroduce || '', //视频介绍
        adImageIntroduce: this.data.manyImgIntroduce || this.data.adImageIntroduce || '', //图片介绍
      }
      api.newget('/rest/memberCenter/updateBusinessCard', data, 'POST', function (e) {
        if (e.code == 200) {
          wx.showToast({
            title: e.message,
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            returnedValue: true,
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    } else if (type == 1) {
      let data = {
        personalIntroduction: personalIntroduction,
        memberId: app.globalData.memberid,
        phone: app.globalData.phone,
        headPortrait: headPortrait,
        weixinNumber: weixinNumber,
        weixinImage: weixinImage,
        backgroundImage: backgroundImage,
        belongStore: belongStore,
        vedioPath: isUpload ? isUpload.upVideoResult || '' : '',
        adImage: this.data.cardAdImage || '',
        vedioIntroduce: this.data.videoInputIntro || this.data.vedioIntroduce || '', //视频介绍
        adImageIntroduce: this.data.manyImgIntroduce || this.data.adImageIntroduce || '', //图片介绍
      }
      api.xput('/rest/memberCenter/saveBusinessCard', data, 'PUT', header, function (e) {
        console.log(e, 'eeeee')
        if (e.code == 200) {
          wx.showToast({
            title: e.message,
          })
          wx.navigateBack({
            delta: 1,
          })
        }

      })
    }
  },
  //是否上传了视频和多图
  isUpload() {
    return new Promise(async (resove, reject) => {
      let videoPath = this.data.videoPath
      // tempFilePaths = this.data.tempFilePaths
      wx.showLoading({
        title: '上传中',
      })
      if (videoPath) {
        var upVideoResult = await requestCenter.uploadFile(videoPath)
      }
      // if (tempFilePaths && tempFilePaths.length > 0) {
      //   var upImageResult = ''
      //   for (let i = 0; i < tempFilePaths.length; i++) {
      //     let imgRe = await requestCenter.uploadFile(tempFilePaths[i])
      //     upImageResult = upImageResult ? imgRe.data + ',' + upImageResult : imgRe.data
      //   }
      // }
      wx.hideLoading({
        success: (res) => {},
      })
      let params = {
        upVideoResult: upVideoResult ? upVideoResult.data : (this.data.cardVedioPath ? this.data.cardVedioPath : '')
      }
      console.log(params)
      resove(params)



    })
  },

  //删除视频
  deleteVideo() {
    this.setData({
      cardVedioPathVirtual: '',
      videoPath: '',
      cardVedioPath: ''
    })
  },

  //监听页面显示
  onShow: function () {
    let that = this
    if (that.data.CroTempFilePath) {
      console.log('CroTempFilePath', that.data.CroTempFilePath)
      that.setData({
        userimg: that.data.CroTempFilePath,
        // headPortrait: that.data.CroTempFilePath,
        hasUserInfo: true
      })
      wx.uploadFile({
        url: app.globalData.upurl + '/rest/memberCenter/imageUpload',
        filePath: that.data.CroTempFilePath,
        name: 'file',
        header: {
          "content-type": "multipart/form-data",
          'X-AUTH-TOKEN': app.globalData.token
        },
        formData: {
          "user": "test",
        },
        success(res) {
          console.log('77777', res)
          that.setData({
            headPortrait: res.data
          })
        }
      })
    }
  },



  //删除图片
  deleteImage: function (e) {
    let type = e.currentTarget.dataset.type
    //删除微信二维码
    if (type == 'weImage') {
      this.setData({
        wxImages: '',
        weixinImage: ''
      })
    } else if (type == 'backgroundImages') {
      this.setData({
        backgroundImages: '',
        backgroundImage: ''
      })

    }
  },

  //门店选择事件
  bindPickerChange: function (e) {
    let that = this
    that.setData({
      pindex: e.detail.value
    })
  },

  //上传多张图片
  upImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        wx.showLoading({
          title: '上传中',
        })
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          var upImageResult = ''
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            let imgRe = await requestCenter.uploadFile(res.tempFilePaths[i])
            upImageResult = upImageResult ? upImageResult + ',' + imgRe.data : imgRe.data
          }
        }
        console.log(this.data.cardAdImage)
        let cardAdImage = this.data.cardAdImage ? this.data.cardAdImage + ',' + upImageResult : upImageResult
        console.log(cardAdImage)
        let tempFilePaths = res.tempFilePaths.map(item => {
          return {
            url: item
          }
        })
        let cardImagePath = this.data.cardImagePath || []
        cardImagePath = cardImagePath.concat(tempFilePaths)
        this.setData({
          cardImagePath,
          cardAdImage
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  //上传视频
  upVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        console.log(res)
        this.setData({
          videoPath: res.tempFilePath
        })
      }
    })
  },

  //图片移动和删除
  moveTap(e) {
    let index = e.currentTarget.dataset.index
    let type = e.target.dataset.type
    let cardImagePath = this.data.cardImagePath
    let cardAdImage = this.data.cardAdImage.split(',')
    if (type == 'left') {
      //左移动
      if (index == 0) {
        return
      }
      let frontMove = cardImagePath[index]
      let afterMoving = cardImagePath[index - 1]
      let frontMoveCard = cardAdImage[index]
      let afterMovingCard = cardAdImage[index - 1]
      cardAdImage[index - 1] = frontMoveCard
      cardAdImage[index] = afterMovingCard
      cardAdImage = cardAdImage.join(',')
      console.log(cardAdImage)
      this.setData({
        [`cardImagePath[${index-1}]`]: frontMove,
        [`cardImagePath[${index}]`]: afterMoving,
        cardAdImage: cardAdImage
      })

    } else if (type == 'delete') {
      cardImagePath.splice(index, 1)
      cardAdImage.splice(index, 1)
      this.setData({
        cardImagePath,
        cardAdImage: cardAdImage.join(',')
      })
    } else if (type == 'right') {
      //向右边移动
      if (index == cardImagePath.length - 1) {
        return
      }
      let frontMove = cardImagePath[index]
      let afterMoving = cardImagePath[index + 1]
      let frontMoveCard = cardAdImage[index]
      let afterMovingCard = cardAdImage[index + 1]
      cardAdImage[index + 1] = frontMoveCard
      cardAdImage[index] = afterMovingCard
      this.setData({
        [`cardImagePath[${index+1}]`]: frontMove,
        [`cardImagePath[${index}]`]: afterMoving,
        cardAdImage: cardAdImage.join(',')
      })
    }
  },
  videometa: function (e) {
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success(res) {
        //视频的高
        var height = e.detail.height;
        //视频的宽
        var width = e.detail.width;;
        //算出视频的比例
        var proportion = height / width;
        //res.windowWidth为手机屏幕的宽。
        //res.windowWidth为手机屏幕的宽。
        var windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        //算出当前宽度下高度的数值
        height = proportion * (windowWidth / 2 - 40);
        that.setData({
          height: Math.ceil(height * ratio),
          width: Math.ceil((windowWidth / 2 - 40) * ratio)
        });
      }
    })
  },
})