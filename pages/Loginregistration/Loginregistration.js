var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from '../../http/request-center'
import { compareVersion, promisic } from "../../utils/utils"

Page({
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    authorAvator: "",
    supportUserInfoEdit: false,
    loginCode: "",
    agreement: false,
    registerForm: {
      headPic: "",
      nick: "",
      openId: "",
      phoneNum: "",
      sex: "男",
      unionId: "",
      memberId: ""
    },
    backType: "relaunch",
    backPage: "pages/index/index",
    backPageQuery: "",
    showAuthorAgreementDialog: false
  },

  onLoad: function(options) {
    this.data.backType = options.backType || "reLaunch"
    this.data.backPage = decodeURIComponent(options.backPage || "pages/index/index")
    this.data.backPageQuery = decodeURIComponent(options.backPageQuery || "")
    
    const version = wx.getSystemInfoSync().SDKVersion
    let supportUserInfoEdit = compareVersion(version, "2.21.2") >= 0
    this.setData({
      supportUserInfoEdit: supportUserInfoEdit,
      ['registerForm.memberId']: app.globalData.shareid || ""
    })

    this.getWxCode({showLoading: true})
  },

  getWxCode: function({showLoading = false} = {}) {
    /**
     * 通过 wx.login 接口获得的用户登录态拥有一定的时效性。
     * 用户越久未使用小程序，用户登录态越有可能失效。
     * 反之如果用户一直在使用小程序，则用户登录态一直保持有效。
     * 具体时效逻辑由微信维护，对开发者透明。
     * 开发者只需要调用 wx.checkSession 接口检测当前用户登录态是否有效。
     * 登录态过期后开发者可以再调用 wx.login 获取新的用户登录态。
     * 调用成功说明当前 session_key 未过期，调用失败说明 session_key 已过期
     */
    if(showLoading) {
      wx.showLoading({
        title: "加载中"
      })
    }

    return promisic(wx["checkSession"])()
			.then(res => {
        if(!this.data.loginCode) {
          return promisic(wx.login)()
        } else {
          return Promise.resolve({
            code: this.data.loginCode
          })
        }
      })
      .catch(err => {
        return promisic(wx.login)()
      })
      .then(res => {
        this.data.loginCode = res.code
        return Promise.resolve(this.data.loginCode)
      })
      .finally(() => {
        console.log("getWxCode finally", this.data.loginCode)
        if(showLoading) {
          wx.hideLoading()
        }
      })
  },

  onChooseWxAvatarSuccess: function(event) {
    let wxAvatarUrl = event.detail.avatarUrl
		this.setData({
      authorAvator: wxAvatarUrl
    })
  },

  toChooseAvatar: function(event) {
    promisic(wx["chooseMedia"])({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
    })
    .then(res => {
      if(res && res.tempFiles && res.tempFiles[0] && res.tempFiles[0].tempFilePath) {
        let event = {
          detail: {
            avatarUrl: res.tempFiles[0].tempFilePath
          }
        }
        this.onChooseWxAvatarSuccess(event)
      }
    })
  },

  onNickNameInput: function(event) {
    let nickName = event.detail.value
    this.setData({
      ["registerForm.nick"]: nickName
    })
  },

  onSexChange: function(event) {
    let sexFlag = event.detail.value
    let sexText = "男"
    if(sexFlag == "2") {
      sexText = "女"
    } else {
      sexText = "男"
    }

    this.setData({
      ["registerForm.sex"]: sexText
    })
  },

  confirmGetPhonenumber: async function(event) {
    await this.getWxCode({showLoading: true});
  },

  onGetPhoneNumber: function(event) {
    let { iv, encryptedData, code, errMsg } = event.detail
      if(errMsg != "getPhoneNumber:ok") {
        return
      }
      
      wx.showLoading({
        title: "加载中"
      })
      this.getPhoneNumber({iv, encryptedData, phoneCode: code})
        .finally(() => {
          wx.hideLoading()
        })
  },

  getPhoneNumber: function({iv = "", encryptedData = "", phoneCode = ""}) {
    let loginCode = this.data.loginCode || ""
    return requestCenter.code2session({code: loginCode})
      .then((res) => {
        this.setData({
          ["registerForm.openId"]: res.openid || "",
          ["registerForm.unionId"]: res.unionid || "",
        })
        this.data.loginCode = ""
        return res.session_key || ""
      })
      .then((session_key) => {
        return requestCenter.decryptionPhone({
          iv,
          encryptedData,
          phoneCode,
          sessionKey: session_key
        })
      })
      .then((phoneNumber) => {
        this.setData({
          ["registerForm.phoneNum"]: phoneNumber
        })
        return Promise.resolve()
      })
  },

  onAgreementChange: function(event) {
    let agreement = (event.detail.value || []).length > 0
    this.setData({
      agreement: agreement
    })
  },

  toAuthor: function() {
    if(!this.data.authorAvator) {
      wx.showToast({
        title: '请选择头像',
        icon: "none"
      })
      return
    }

    if(!this.data.registerForm.nick) {
      wx.showToast({
        title: '请输入昵称',
        icon: "none"
      })
      return
    }

    if(!this.data.registerForm.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: "none"
      })
      return
    }

    if(!this.data.registerForm.phoneNum) {
      wx.showToast({
        title: '电话不能为空',
        icon: "none"
      })
      return
    }

    if(!this.data.agreement) {
      this.setData({
        showAuthorAgreementDialog: true
      })
    } else {
      this.agreementRegister()
    }
  },

  onAuthorAgreement: function(event) {
    this.setData({
      agreement: true
    })
    this.agreementRegister()
  },

  agreementRegister: function() {
    wx.showLoading({
      title: "加载中"
    })
    requestCenter.commonUploadFile({ path: this.data.authorAvator })
      .then((res) => {
        let resultData = JSON.parse((res || {}).data || "{}")
        let resultDataCode = (resultData.code || "") + ""
        if(resultDataCode.startsWith("2")) {
          return Promise.resolve(resultData.data)
        } else {
          return Promise.reject()
        }
      })
      .then((headPic) => {
        this.setData({
          ["registerForm.headPic"]: headPic
        })
        return requestCenter.xcxBind(this.data.registerForm)
      })
      .then((res) => {
        let token = res.token || ""
        wx.setStorageSync('api_access_token', token)
        return Promise.resolve()
      })
      .then((res) => {
        return requestCenter.getMemberInfo()
          .then((res) => {
            if (res.isEmployee == 1 || (res.isBroker == 1 && res.brokerPower == 1)) {
              app.globalData.memberid = res.id
              app.globalData.ordinarymemberid = res.id
            } else {
              app.globalData.memberid = ''
            }
            return Promise.resolve()
          })
          .catch((error) => {})
      })
      .finally(() => {
        this.navigateBack()
        wx.hideLoading()
      })
  },

  navigateBack: function() {
    let backType = this.data.backType
    let backPage = this.data.backPage
    let backPageQuery = this.data.backPageQuery
    
    if(backPageQuery) {
      wx[backType]({
        url: `/${backPage}?${backPageQuery}`
      })
    } else {
      wx[backType]({
        url: `/${backPage}`
      })
    }
  },

  toServiceAgreement: function(event) {
    wx.navigateTo({
      url: '/pages/service-agreement/service-agreement',
    })
    this.setData({
      agreement: true
    })
  },

  toPrivacyPolicies: function(event) {
    wx.navigateTo({
      url: '/pages/privacy-policies/privacy-policies',
    })
    this.setData({
      agreement: true
    })
  }
})