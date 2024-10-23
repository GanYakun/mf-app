// member/add_address/add_address.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishuadon: false,
    provinceCityCounty: '',
    // customItem: '全部',
    province: "", //省
    city: "", //市
    area: "", //县
    checked: false,
    // isDefault:0,
    isDefault: 1,
    xpanduan: 'no',
    dwRegion: ["云南省", "昆明市", "五华区"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.isdefault == 0) {
      var dedede = false
    } else {
      var dedede = true
    }
    this.setData({
      consignee: options.consignee,
      consigneeTelephone: options.consigneeTelephone,
      provinceCityCounty: options.provinceCityCounty,
      detailAddress: options.detailAddress,
      addressAlias: options.addressAlias,
      zipCode: options.zipCode,
      id: options.id,
      type: options.type,
      isdefault: dedede,
      xpanduan: options.xpanduan
    })

  },


  //收货人
  getname: function (e) {
    console.log(e.detail.value)
    this.setData({
      consignee: e.detail.value
    })
  },
  getaddress: function (e) {
    console.log(e.detail.value)
    this.setData({
      detailAddress: e.detail.value
    })
  },
  getphone: function (e) {
    console.log(e.detail.value)
    this.setData({
      consigneeTelephone: e.detail.value
    })
  },
  getcodes: function (e) {
    console.log(e.detail.value)
    this.setData({
      zipCode: e.detail.value
    })
  },
  getaddressa: function (e) {
    console.log(e.detail.value)
    this.setData({
      addressAlias: e.detail.value
    })
  },
  switchChange: function (e) {
    if (e.detail.value) {
      this.setData({
        isDefault: 1

      })
    } else {
      this.setData({
        isDefault: 0

      })
    }

    console.log(this.data.isDefault)
  },


  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      provinceCityCounty: e.detail.value,
      ishuadon: true
    })

  },

  // checkedTap: function (e) {
  //   var checked = this.data.checked;
  //   var isDefault = ""

  //   if (checked) {
  //     isDefault = 0
  //   } else {
  //     isDefault = 1
  //   }
  //   this.setData({
  //     "checked": !checked,
  //     isDefault: isDefault
  //   })
  // },
  save: function (e) {
    //   console.log(e)
    //   let that = this
    //   var consignee = that.data.consignee
    //   var detailAddress = that.data.detailAddress
    //   var provinceCityCounty = toString(that.data.provinceCityCounty)
    //   var consigneeTelephone = that.data.consigneeTelephone
    //   var zipCode = that.data.zipCode
    //   var addressAlias = that.data.addressAlias
    //   var isDefault = that.data.isDefault
    //   var id = that.data.id
    //   var type = that.data.type
    //   var isDefault = that.data.isDefault

    //   if (app.globalData.token == undefined) {
    //     let userinfoss = wx.getStorageSync('xuserixnfo')
    //     if (userinfoss == "") {
    //       that.setData({
    //         iosDialog1: true
    //       })
    //     } else {
    //       that.setData({
    //         iosDialog2: true
    //       })
    //     }

    //   } else {
    //     if (type == 1) {
    //       let tokens = app.globalData.token
    //       let data = {
    //         consignee: consignee,
    //         detailAddress: detailAddress,
    //         provinceCityCounty: provinceCityCounty,
    //         consigneeTelephone: consigneeTelephone,
    //         zipCode: zipCode,
    //         addressAlias: addressAlias,
    //         isDefault: isDefault
    //       }
    //       console.log(tokens)
    //       let header = {
    //         'content-type': 'application/json',
    //         'X-AUTH-TOKEN': tokens
    //       }
    //       api.xpost('/rest/memberCenter/shippingAdressAddOrUpdate', data, 'POST', header, function (e) {
    //         wx.showToast({
    //           title: e.message,
    //         })
    //         if (e.code == 200) {
    //           setTimeout(() => {
    //             wx.navigateBack({
    //               delta: 1 //想要返回的层级
    //             })
    //           }, 1000)
    //         }

    //       })
    //     } else {
    //       let tokens = app.globalData.token
    //       let data = {
    //         consignee: consignee,
    //         detailAddress: detailAddress,
    //         provinceCityCounty: provinceCityCounty,
    //         consigneeTelephone: consigneeTelephone,
    //         zipCode: zipCode,
    //         addressAlias: addressAlias,
    //         isDefault: isDefault,
    //         id: id
    //       }
    //       console.log(data)
    //       let header = {
    //         'content-type': 'application/json',
    //         'X-AUTH-TOKEN': tokens
    //       }
    //       api.xpost('/rest/memberCenter/shippingAdressAddOrUpdate', data, 'POST', header, function (e) {
    //         wx.showToast({
    //           title: e.message,
    //         })
    //         if (e.code == 200) {
    //           setTimeout(() => {
    //             wx.navigateBack({
    //               delta: 1 //想要返回的层级
    //             })
    //           }, 1000)
    //         }
    //       })
    //     }
    //   }


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },


  /**
   * 
   * 添加新地址
   * 
   */
  formSubmit: function (e) {
    console.log(e)
    let list = e.detail.value
    let that = this;
    if (list.getconsignee == '') {
      wx.showToast({
        title: '请输入收获人姓名',
        icon: 'none',
        duration: 1500
      })
    } else if (list.bindregionchange == '') {
      wx.showToast({
        title: '请输入收获人地址',
        icon: 'none',
        duration: 1500
      })
    } else if (list.getaddress == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      })
    } else if (list.getphone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1500
      })
    } else {
      var myreg = /^((1[3-9]{1}[0-9]{1})+\d{8})$/;
      if (!myreg.test(list.getphone)) {
        wx.showToast({
          title: '电话号码格式不对',
          icon: 'none',
          duration: 1500
        })
      } else {
        let tokens = app.globalData.token
        if (list.switch) {
          var isdefault = 1
        } else {
          var isdefault = 0
        }
        if (that.data.id == 'undefined') {
          console.log('id为空')
          var ids = ''
        } else {
          var ids = that.data.id
        }
        let data = {
          consignee: list.getconsignee,
          detailAddress: list.getaddress,
          provinceCityCounty: list.bindregionchange[0] + list.bindregionchange[1] + list.bindregionchange[2],
          consigneeTelephone: list.getphone,
          zipCode: list.getcode,
          addressAlias: list.getaddressa,
          isDefault: isdefault,
          id: ids
        }
        let header = {
          'content-type': 'application/json',
          'X-AUTH-TOKEN': tokens
        }
        api.xpost('/rest/memberCenter/shippingAdressAddOrUpdate', data, 'POST', header, function (e) {
          console.log(e)
          if (e.code == 200) {
            if (ids == '') {
              wx.showToast({
                title: '添加地址成功',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            } else {
              wx.showToast({
                title: '修改地址成功',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }

            setTimeout(() => {
              var pages = getCurrentPages()
              var prevPage = pages[pages.length - 2] // 上一页// 调用上一个页面的setData 方法，将数据存储
              prevPage.setData({
                isadd: 1
              })
              wx.navigateBack({
                delta: 1
              })
              return false
            }, 1500)
          }


        })
      }
    }
  },

  //删除地址
  deleteaddress: function (e) {
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': app.globalData.token
    }
    let data = {

    }
    api.xpost('/rest/memberCenter/deleteDeliveryAddress?addressId=' + this.data.id, data, 'DELETE', header, function (e) {
      console.log(e.code == '200')
      if (e) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1500,
          mask: true
        })

        setTimeout(() => {
          wx.navigateBack({
            delta: 1 //想要返回的层级
          })
        }, 1500)
      }
    })
  },

  close:function(){
    this.setData({
      consignee:''
    })
  }



})