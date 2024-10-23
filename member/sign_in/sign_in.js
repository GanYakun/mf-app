// xpages/sign-in/sign-in.js
import config from '../../http/config'
import requestCenter from '../../http/request-center'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImg: "",
    signInClickImg: config.ftpUrl + "/ic_sign_in.jpg", //顶部图片
    statusBarHeight: app.globalData.statusBarHeight + "rpx",
    icheckInRange: false, //是否在签到范围
    closeImg: config.ftpUrl + "/ic_close.png",
    signSeccessImg: config.ftpUrl + "/bg_sign_in_done.png",
    showDialog: false,
    destinationLat: "",
    destinationLng: "",
    receiveStartTime: "",
    receiveEndTime: "",
    checkInTime: false,
    mid: "",
    hid: "",
    isEmpit: false,
    empitText: "暂无内容",
    location: "",
    content: "",
    latlngsFormat: [],
    launchTypes: [1011, 1017, 1025, 1047, 1124]
  },
  showDialog() {
    this.setData({
      showDialog: true
    })
  },
  closeDialog() {
    this.setData({
      showDialog: false
    })
  },
  closeDialog() {
    this.setData({
      showDialog: false
    })
  },
  // 传目的地的经纬度
  icheckInRange() {
    var isFindLoction = false
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 5000,
        success: res => {
          var latitude = res.latitude
          var longitude = res.longitude
          this.data.location = latitude + "," + longitude
          console.log("log", res)
          if (!this.data.latlngsFormat || this.data.latlngsFormat.length <= 0) {
            isFindLoction = true
          } else {
            for (let i in this.data.latlngsFormat) {
              let distance = this.checkLatlngItem(this.data.latlngsFormat[i].lat, this.data.latlngsFormat[i].lng, latitude, longitude)
              console.log("aaaaaa", distance)
              if (distance < 200) {
                isFindLoction = true
                break
              }
            }
          }
          if (isFindLoction) {
            resolve("")
            console.log("找到了！！！！！！！！！！！！å")
          } else {
            resolve("不在签到范围")
          }
        },
        fail: e => {
          console.log(e);
          resolve("获取位置失败")
        }


      })
    })
  },

  //
  async checkInTime(start, end) {
    return new Promise((resolve, reject) => {
      let newStartTime = start.replace(/-/g,"/")
      let newEndTime = end.replace(/-/g,"/")

      console.log(newStartTime)
      console.log(newEndTime)

      let longStartTime = new Date(newStartTime).getTime()
      let longEndTime = new Date(newEndTime).getTime()
      let longThisTime = new Date().getTime()

      console.log("new Date(start)", new Date(start));
      console.log("new Date()", new Date());

      console.log("longEndTime", longThisTime < longEndTime)
      console.log("longThisTime", longThisTime > longStartTime)
      if (longThisTime < longStartTime) {
        resolve("活动尚未开始")
      } else if (longThisTime > longEndTime) {
        console.log("活动已经结束")
        resolve("活动已经结束")
      } else if ((longThisTime > longStartTime) && (longThisTime < longEndTime)) {
        resolve("")
      }
    })
  },
  //点击签到
  async signIn() {
    console.log(this.data.destinationLat, this.data.destinationLng)
    wx.showLoading({
      title: "正在签到..."
    })
    let checkInRangeTag = await this.icheckInRange()
    let checkInTimeTag = await this.checkInTime(this.data.receiveStartTime, this.data.receiveEndTime)

    wx.hideLoading()
    console.log("a-----z", checkInRangeTag, checkInTimeTag)
    if ((!checkInRangeTag) && (!checkInTimeTag)) {
      this.confirmReceive()
    } else {
      let showText = checkInRangeTag ? checkInRangeTag : checkInTimeTag
      wx.showToast({
        icon: "error",
        title: showText
      })
    }
  },

  async confirmReceive() {
    var that = this
    console.log(this.data.mid, this.data.hid)
    let confirmReceive = await requestCenter.confirmReceive({
      huodongId: this.data.hid,
      issuerMemberId: this.data.mid,
      receivePlace: this.data.location
    })
    // let confirmReceive = await requestCenter.confirmReceive({huodongId:'3',issuerMemberId:'177768'})
    console.log("confirmReceive", confirmReceive);
    if(confirmReceive.canReplace && confirmReceive.recordId){
      wx.showModal({
        title: '提示',
        content: '已领取过特权包，如果需要领取最新的，点击确定，之前领取的将会自动失效。',
        success (res) {
          if (res.confirm) {
            that.huodongTequanReplace(confirmReceive.recordId)
          } 
        }
      })
    }else{
      this.autoNavigateTo(confirmReceive.message)
    }
  },

  //活动特权包替换
  async huodongTequanReplace(recordId){
    let replaceData = await requestCenter.huodongTequanReplace({
      recordId: recordId,
    })
    console.log("replaceData", replaceData);
    this.autoNavigateTo(replaceData)
  },

  async autoNavigateTo(msg) {
    wx.showToast({
      title: msg,
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '/businesscard/server-in-help/server-in-help?currentTab=2&type=meCoup',
      })
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(encodeURIComponent("hid=21&mId=177768"))
    let launchType = wx.getEnterOptionsSync().scene
    let launchTypes = this.data.launchTypes
    let hasOfficialAccount = launchTypes.indexOf(launchType) != -1

    this.setData({
      hasOfficialAccount: hasOfficialAccount
    })

    let scene = options.scene
    console.log("scene", scene)
    if (scene) {
      scene = decodeURIComponent(scene)
      scene = app.getQueryValue(scene)
      console.log("scene",scene)
      this.data.mid = scene.mId
      this.data.hid = scene.hid
      let signInDetail = await requestCenter.getSignDetail({
        'huodongId': scene.hid
      })
      if (signInDetail) {
        let latlngs = signInDetail.coordinate ? signInDetail.coordinate.split("#") : []
        console.log(latlngs)
        var latlngsFormat = []
        for (let i in latlngs) {
          let latlngByString = latlngs[i].split(",")
          let latlngObj = {
            lat: latlngByString[0],
            lng: latlngByString[1]
          }
          latlngsFormat.push(latlngObj)
        }

        this.setData({
          latlngsFormat: latlngsFormat,
          showImg: app.globalData.imgur + "/" + signInDetail.imagePath,
          receiveStartTime: signInDetail.receiveStartTime,
          receiveEndTime: signInDetail.receiveEndTime,
          content: signInDetail.content
        })
        console.log(this.data.latlngsFormat)

        console.log("onLoad", signInDetail)
        console.log("onLoad", app.globalData.memberid)
        console.log(this.data.statusBarHeight)
      } else {
        this.setData({
          isEmpit: true
        })
      }

    } else {
      this.setData({
        isEmpit: true,
        empitText: "请使用微信扫一扫扫描活动内容"
      })
    }
  },

  checkLatlngItem(destinationLat, destinationLng, latitude, longitude) {
    destinationLat = destinationLat || 0
    destinationLng = destinationLng || 0
    latitude = latitude || 0
    longitude = longitude || 0
    var rad1 = destinationLat * Math.PI / 180.0;
    var rad2 = latitude * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = destinationLng * Math.PI / 180.0 - longitude * Math.PI / 180.0;
    var r = 6378137;
    var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
    console.log("distance", distance)
    return distance
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})