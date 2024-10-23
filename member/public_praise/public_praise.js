// member/public praise/public praise.js
var app = getApp()
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarr: [],
    topImage: [],
    list: '',
    xtopimage: [],
    xaxas: '',
    xxpanduan: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '发表内容',
      })
    } else {
      wx.setNavigationBarTitle({
        title: options.title,
      })
    }
    // let topImageList = JSON.parse(options.topImageList)
    // console.log(JSON.parse(options.topImageList))
    let that = this
    // that.setData({
    //   title:options.title,
    //   briefContent:options.briefContent,
    //   topImageList:topImageList,
    //   id:options.id,
    //   type:options.type,
    //   imgurl:app.globalData.imgur
    // })
    that.setData({
      type: options.type,
      id: options.id
    })
    if (options.type == 0) {
      let tokens = app.globalData.token
      let data1 = {}
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/getContributeById?id=' + options.id, data1, 'POST', header, function (e) {
        console.log(e, '66666666')
        for (var i = 0; i < e.data.topImageList.length; i++) {
          e.data.topImageList[i].imagePath = app.globalData.imgur + e.data.topImageList[i].imagePath
        }
        that.setData({
          list: e.data,
          briefContent: e.data.briefContent,
          title: e.data.title,
          topImageList: e.data.topImageList,
          topImages: e.data.topImage,
          imageArr: e.data.topImage,
          imgurl: app.globalData.imgur
        })
        console.log(that.data.topImages, 'topImages')
      })
    }
  },
  // 选择图片
  chooseImage: function () {
    let that = this
    let imgarr = that.data.imgarr
    let topImageList = that.data.topImageList
    console.log("type", that.data.type)
    if (that.data.type == 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          console.log(res)
          // // tempFilePath可以作为img标签的src属性显示图片
          imgarr.push(res.tempFilePaths)
          that.setData({
            imgarr: imgarr
          })
          console.log(imgarr)
          console.log(tempFilePaths)
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
          
              if (res.statusCode == 401) {
                app.obtaintoken()
                let arr = that.data.imgarr
                arr.pop()
                console.log(arr)
                that.setData({
                  imgarr:arr
                })
                wx.showToast({
                  title: '上传失败，请重新选择',
                  icon: 'none',
                  duration: 1500
                })
              } else {
                let topImage = that.data.topImage
                console.log(topImage)
                topImage.push(res.data)
                let topImages = topImage.join(",")
                console.log("topImages", topImages)
                that.setData({
                  topImages: topImages
                })
              }

            }
          })
        }
      })
    } else if (that.data.type == 0) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          console.log(res)
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
              if (res.statusCode == 401) {
                app.obtaintoken()
                let arr = that.data.imgarr
                arr.pop()
                that.setData({
                  imgarr:arr
                })
                wx.showToast({
                  title: '上传失败，请重新选择',
                  icon: 'none',
                  duration: 1500
                })
              } else {

                console.log("上传图片成功", res)
                var topImageList = that.data.topImageList
                // // tempFilePath可以作为img标签的src属性显示图片
                var imageObj = {
                  fileName: "",
                  imageId: null,
                  imagePath: tempFilePaths[0],
                  searchId: null,
                  searchName: null,
                  searchRootId: null
                }
                topImageList.push(imageObj)
                var imageArr = that.data.imageArr
                var imageArrs = imageArr.split(",");
                imageArrs.push(res.data)
                console.log(imageArrs)
                let topImages = imageArrs.join(",")
                console.log(topImages)
                that.setData({
                  topImageList: topImageList,
                  topImages: topImages,
                  imageArr: topImages
                })

              }
            }
          })
        }
      })
    }
  },
  // 删除图片
  // onDeleteTap(e) {
  //   let that = this
  //   let index = e.currentTarget.dataset.index
  //   console.log(e.currentTarget.dataset.index)
  //   let topImageList = that.data.topImageList
  //   console.log(topImageList)
  //   topImageList.splice(index, 1)
  //   let topImages = that.data.topImages
  //   let topImageStrs = topImages.split(',')
  //   topImageStrs.splice(index,1)
  //   topImages = topImageStrs.join(',')

  //   that.setData({
  //     topImageList: topImageList,
  //     topImages: topImages,
  //     imageArr: topImages
  //   })
  // },


  onDeleteTap(e) {
    let that = this
    if(that.data.type==0){
    let index = e.currentTarget.dataset.index
    let topImageList = that.data.topImageList
    console.log(topImageList)
    topImageList.splice(index, 1)
    let topImages = that.data.topImages
    let topImageStrs = topImages.split(',')
    topImageStrs.splice(index,1)
    topImages = topImageStrs.join(',')

    that.setData({
      topImageList: topImageList,
      topImages: topImages,
      imageArr: topImages
    })
    }else{
  
    let index = e.currentTarget.dataset.index
    let oldimgarr = that.data.imgarr
    oldimgarr.splice(index, 1)
    that.setData({
      imgarr: oldimgarr
    })
    let oldtopmage = that.data.topImage
    console.log(oldtopmage)
    oldtopmage.splice(index, 1)
    that.setData({
      topImage: oldtopmage
    })
  }
  },



  titleinput: function (e) {
    let that = this
    that.setData({
      title: e.detail.value
    })
  },
  contextinput: function (e) {
    let that = this
    that.setData({
      briefContent: e.detail.value
    })
  },
  onSaveTap: function () {
    let that = this
    let title = that.data.title
    let briefContent = that.data.briefContent
    if (that.data.xxpanduan) {
      var topImage = that.data.xaxas
    } else {
      var topImage = that.data.topImages
    }
    var topImage = that.data.topImages
    console.log(title, briefContent, topImage)
    let type = that.data.type
    if (type == 0) {
      if (title == undefined || title == null) {
        wx.showToast({
          title: '请填写标题',
          icon: 'none'
        })
        return
      }
      if (briefContent == undefined || briefContent == null) {
        wx.showToast({
          title: '请填写内容',
          icon: 'none'
        })
        return
      }
      // let topImageList=that.data.topImageList
      // console.log(topImageList,"555555")
      let tokens = app.globalData.token
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      let data = {
        title: title,
        briefContent: briefContent,
        topImage: topImage,
        id: that.data.id
      }
      console.log(data, 'data')
      // api.xpost('/rest/memberCenter/tWebContributeControllerdoAdd?title=' + title + "&briefContent=" + briefContent + "&topImage="+topImage, data, 'POST', header, function (e) {
      api.xpost('/rest/memberCenter/tWebContributeControllerdoAdd', data, 'POST', header, function (e) {
        console.log(e)
        wx.showToast({
          title: e.message,
          icon: "none"
        })
        if (e.code == 200) {
         
          wx.navigateBack({
            delta: 1,
          })
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: e.message,
            icon: "none"
          })
        }
      })
    } else {
      let tokens = app.globalData.token
      let data = {
        title: title,
        briefContent: briefContent,
        topImage: topImage
      }
      console.log(data)
      console.log(tokens)
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      // api.xpost('/rest/memberCenter/tWebContributeControllerdoAdd?title=' + title + "&briefContent=" + briefContent + "&topImage="+topImage, data, 'POST', header, function (e) {
      api.xpost('/rest/memberCenter/tWebContributeControllerdoAdd', data, 'POST', header, function (e) {
        console.log(e)
        wx.showToast({
          title: e.message,
          icon: "none"
        })
        if (e.code == 200) {
         
          wx.navigateBack({
            delta: 1,
          })
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1500
          })

        } else {
          wx.showToast({
            title: e.message,
            icon: "none"
          })
        }
      })
    }
  },
})