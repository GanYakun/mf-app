import HttpService from "./http-server"
import config from "./config"
const tokenKey = "token"

class RequestCenter {
  constructor() {
    this.httpService = new HttpService()
  }

  verifyToken(params, headers) {
    return this.httpService.postJson(config.verifyToken, params, headers)
  }

  code2token(params, headers) {
    return this.httpService.postJson(config.code2token, params, headers)
  }

  register(params, headers) {
    return this.httpService.postJson(config.register, params, headers)
  }

  memberIndex(params) {
    return this._verify(params, {}, () => {
      return this.httpService.postJson(config.memberIndex, params)
    })
  }

  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        complete: async function (res) {
          if (res && res.code) {
            resolve(res.code)
          } else {
            reject({
              code: -1,
              msg: "wx.login 失败"
            })
          }
        }
      })
    })
  }

  // token验证
  _verify(author, fun) {
    if (author) {
      return new Promise((resolve, reject) => {
        //验证token是否过期
        this.verifyToken().then((res) => {
          console.log(res)
          //token未过期,继续上一次请求
          fun().then((res) => {
            resolve(res)
          }, (reason) => {
            reject(reason)
          })
        }, (reason) => {
          var code = reason.code
          if (code == 208) {
            //token过期,刷新token,继续上一次请求
            this.wxLogin().then((res) => {
              this.code2token({
                code: res
              }).then((res) => {
                var token = res.memberToken
                wx.setStorageSync('token', token)
                fun().then((res) => {
                  resolve(res)
                }, (reason) => {
                  reject(reason)
                })
              }, (reason) => {
                reject(reason)
              })
            }, (reason) => {
              reject(reason)
            })
          } else {
            reject(reason)
          }
        })
      })
    } else {
      return fun()
    }
  }


  //查询产品分类
  getChildList(params) {
      return this.httpService.get(config.getChildList, params);
  }
  //查询美家的楼盘分类
  getSrarchOptionsBySearchCode(params,author = false) {
      let resData = this.TokenIsExpired(()=>{
        return this.httpService.get(config.getSrarchOptionsBySearchCode,params)
      },author)
      return resData
  }

  //查询顶部的四个筛选项目
  getRootByNewsClassId(params,author = false) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getRootByNewsClassId,params)
    },author)
    return resData
  }

  // 导出我的下定订单清单
  getDepositOrderProductListExport(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.getDepositOrderProductListExport,params)
    },author)
    return resData
  }

   // 根据cId获取产品非销售属性列表接口
   getMallItemUnProp(params,author = false){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMallItemUnProp,params)
    },author)
    return resData
  }

  /**
   * 加入购物车
   * @param {*} params 
   * @param {*} author
   *  
   */
  putSaveOrUpdateCart(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      params = Object.assign({"pageSize": ""}, params)
      return this.httpService.put(config.putSaveOrUpdateCart,params)
    },author)
    return resData
  }
  
 /**
   * 查询设计师
   * @param {*} params 
   * @param {*} author
   *  
   */
  getDesingerSearchOption(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getDesingerSearchOption,params)
    },author)
    return resData
  }


  /**
   * 拎包案例的查询设计师
   * @param {*} params 
   * @param {*} author
   *  
   */
  getDesingerSearchOption2(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getDesingerSearchOption2,params)
    },author)
    return resData
  }
  

  /**
   * 获取产品列表结果共性系列数据接口
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMallItemCommonIdentification(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMallItemCommonIdentification,params)
    },author)
    return resData
  }



  /**
   * 获取模型详情数据接口
   * @param {*} params 
   * @param {*} author
   *  
   */
  getModel(params,author = false){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getModel,params)
    },author)
    return resData
  }

  /**
   * 立即购买接口
   * @param {*} params 
   * @param {*} author
   *  
   */
  getNowBuy(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      params = Object.assign({"pageSize": ""}, params)
      return this.httpService.get(config.getNowBuy,params)
    },author)
    return resData
  }

  /**
   * 商品限购接口
   * @param {*} params 
   * @param {*} author
   *  
   */
  putLimitCounts(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.putLimitCounts,params)
    },author)
    return resData
  }


  /**
   * 获取扫粉列表
   * @param {*} params 
   * @param {*} author
   *  
   */
  getFansList(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getFansList,params)
    },author)
    return resData
  }

  /**
   * 账号密码获取token
   * @param {*} params 
   * @param {*} author
   *  
   */
  getTokens(params,author = false){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getTokens,params)
    },author)
    return resData
  }

  /**
   * 获取内部会员列表
   * @param {*} params 
   * @param {*} author
   *  
   */
  getmemberListByIsEmployee(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getmemberListByIsEmployee,params)
    },author)
    return resData
  }

   /**
   * 获取内部会员统计数据
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMemberListByIsEmployeeCount(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMemberListByIsEmployeeCount,params)
    },author)
    return resData
  }



   /**
   * 数据字典
   * @param {*} params 
   * @param {*} author
   *  
   */
  getDataDictionary(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getDataDictionary,params)
    },author)
    return resData
  }


  //查询指定会员的内部会员
   /**
   * 数据字典
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMemberCustomerListByMemberId(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMemberCustomerListByMemberId,params)
    },author)
    return resData
  }
  

   /**
   * 生成二维码
   * @param {*} params 
   * @param {*} author
   *  
   */
  getCreateQRCode(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getCreateQRCode,params)
    },author)
    return resData
  }


   /**
   * 内部会员统计数据 【浏览】
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMemberListByIsEmployeeCount2(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMemberListByIsEmployeeCount2,params)
    },author)
    return resData
  }
  


  /**
   * 查询内部会员列表数据[浏览]
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMemberListByIsEmployee2(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMemberListByIsEmployee2,params)
    },author)
    return resData
  }

   /**
   * 查询内部会员列表数据[浏览]
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMemberListByIsEmployee2(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMemberListByIsEmployee2,params)
    },author)
    return resData
  }

    /**
   * 查询可用优惠券
   * @param {*} params 
   * @param {*} author
   */
  getCouponList(params, author = true){
    // let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getCouponList,params)
    // },author)
    // return resData
  }

   /**
   * 上传图片和视频
   * @param {*} params 
   * @param {*} author
   *  
   */
  uploadFile(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService._fileUpload(config.uploadFile,params)
    },author)
    return resData
  }

   /**
   * 暖心服务抵用券列表
   * @param {*} params 
   * @param {*} author
   *  
   */
  getNxSererCouponList(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getNxSererCouponList,params)
    },author)
    return resData
  }

   /**
   * 暖心服务抵用券列表
   * @param {*} params 
   * @param {*} author
   *  
   */
  getCreateCouponQRCode(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getCreateCouponQRCode,params)
    },author)
    return resData
  }



  /**
   * 会员领取优惠券
   * @param {*} params 
   * @param {*} author
   *  
   */
  postCoupon(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postForm(config.postCoupon,params)
    },author)
    return resData
  }


  /**
   * 会员领取优惠券前
   * @param {*} params 
   * @param {*} author
   *  
   */
  preGetCoupon(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.preGetCoupon,params)
    },author)
    return resData
  }


  /**
   * 会员拥有的优惠券
   * @param {*} params 
   * @param {*} author
   *  
   */
  getMyCoupon(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMyCoupon,params)
    },author)
    return resData
  }


   /**
   * 会员拥有的优惠券
   * @param {*} params 
   * @param {*} author
   *  
   */
  getAppraiseLabel(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getAppraiseLabel,params)
    },author)
    return resData
  }


  /**
   * 对订单提交评价
   * @param {*} params 
   * @param {*} author
   *  
   */
  postOrderAppraise(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.postOrderAppraise,params)
    },author)
    return resData
  }


  /**
   * 订单状态数量统计
   * @param {*} params 
   * @param {*} author
   *  
   */
  getOrderStatusCounts(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getOrderStatusCounts,params)
    },author)
    return resData
  }


  /**
   * 查询店长推荐的数据 新
   * @param {*} params 
   * @param {*} author
   *  
   */
  getStoreRecommendList(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getStoreRecommendList,params)
    },author)
    return resData
  }

  //收藏产品
  addCollection(params,author = true) {
    let resData = this.TokenIsExpired(()=>{
      params = Object.assign({"pageSize": ""}, params)
      return this.httpService.postJson(config.addCollection,params)
    },author)
    return resData
  }
  
  //取消收藏
  deleteCollectionById(params,author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.deleteCollectionById,params)
    },author)
    return resData
  }
  //查询活动详情
  getSignDetail(params,author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getSignInDetail,params)
    },author)
    return resData
  }
  confirmReceive(params,author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.confirmReceive,params)
    },author)
    return resData
  }

  code2session(params) {
    let res = this.httpService.get(config.code2session, params)
    return res
  }

  decryptionPhone(params) {
    let res = this.httpService.post(config.decryptionPhone, params)
    return res
  }
  
  commonUploadFile(params = {}) {
    return this.httpService._fileUpload(config.commonUploadFile, params.path || "")
  }

  xcxBind(params = {}) {
    return this.httpService.post(config.xcxBind, params)
  }
  

  


  

  

  

  

  


  
  

  

  
  

  
  

  

  


    TokenIsExpired(fun,author){
      return fun()
      .catch((error) => {
        if(error && typeof error === 'object' && error.code==406){
          return this.getToken()
            .then((res) => {
              return fun()
            })
        } else {
          return Promise.reject(error)
        }
      })
      .catch((error) => {
        if(error && typeof error === 'object' && error.code == 407) {
          let pages = getCurrentPages()
          let curPage = pages[pages.length - 1]
          error.curPage = curPage
          return Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      })
  }

  //重新获取token
  getToken(){
    var app = getApp()
    return app.obtaintoken()
  }
  
  //页面列表模型
  getPageModel(params){
    return this.httpService.get(config.getPageModel,params);
  }

    //查询该商品所属的大分类
  locationList(params){
    return this.httpService.get(config.locationList,params)
  }

  //查询根目录下的所有的大分类
  getAllList(params){
    return this.httpService.get(config.getAllList,params)
  }

  //查询店长推荐（原本月爆款）分类数据
  getChildLists(params){
    return this.httpService.get(config.getChildLists,params)
  }

  ////查询店长推荐（原本月爆款）的列表
  getHotDetailsList(params){
    return this.httpService.get(config.getHotDetailsList,params)
  }
  
  //查询广告图
  getWxBannerByRootIdKey(params){
    return this.httpService.get(config.getWxBannerByRootIdKey,params)
  }

  //部门筛选
  getDepartmentList(params){
    return this.httpService.get(config.getDepartmentList,params)
  }

  //生成活动签到二维码
  getEmployeeCode(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getEmployeeCode, params)
    }, author)
    return resData
  }

  //获取进店签到列表
  getActivitySignList(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getActivitySignList, params)
    }, author)
    return resData
  }

  //员工我的进店(活动被签到)列表
  getMyCustomerList(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getMyCustomerList, params)
    }, author)
    return resData
  }

  //员工我的进店(活动被签到)顶部统计
  getMyCustomerTotal(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getMyCustomerTotal, params)
    }, author)
    return resData
  }

  //我的当期活动特权包记录列表
  getMyReceiveRecordList(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getMyReceiveRecordList, params)
    }, author)
    return resData
  }

  //团队我的进店(团队员工的我的进店统计信息汇总)顶部统计包含组织机构
  getMyTeamCustomerTotal(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getMyTeamCustomerTotal, params)
    }, author)
    return resData
  }

  //团队意向客户统计(团队员工的我的进店统计信息汇总)列表
  getMyTeamCustomerTotalList(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getMyTeamCustomerTotalList, params)
    }, author)
    return resData
  }

  //团队意向客户(团队员工的意向客户统计信息汇总)顶部统计包含组织机构
  getHaoSongMyTeamCustomerTotal(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getHaoSongMyTeamCustomerTotal, params)
    }, author)
    return resData
  }

  //团队意向客户统计(团队员工的意向客户统计信息汇总)
  getHaoSongMyTeamCustomerTotalList(params, author = true){
    let resData = this.TokenIsExpired(() =>{
      return this.httpService.get(config.getHaoSongMyTeamCustomerTotalList, params)
    }, author)
    return resData
  }

  //获取豪送列表数据
  getHaoSongList(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getHaoSongList,params)
    },author)
    return resData
  }

  generateHaoSongCode(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.generateHaoSongCode,params)
    },author)
    return resData
  }

  confirmReceiveHaoSong(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.confirmReceiveHaoSong,params)
    },author)
    return resData
  }

  getHaosongDetail(params) {
    return this.httpService.get(config.getHaosongDetail,params)
  }

  getHaosongReceiveRecordList(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getHaosongReceiveRecordList,params)
    },author)
    return resData
  }

  getHaosongReceiveRecordDetail(params) {
    return this.httpService.get(config.getHaosongReceiveRecordDetail,params)
  }

  confirmHaosongWriteOff(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.confirmHaosongWriteOff,params)
    },author)
    return resData
  }

  getMyCustomerListByHaoSong(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMyCustomerListByHaoSong,params)
    },author)
    return resData
  }
  getMyCustomerTotalByHaoSong(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMyCustomerTotalByHaoSong,params)
    },author)
    return resData
  }

  getMyReceiveRecordProList(params, author = true) {
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.get(config.getMyReceiveRecordProList,params)
    },author)
    return resData
  }

  //活动特权包替换
  huodongTequanReplace(params, author = true){
    let resData = this.TokenIsExpired(()=>{
      return this.httpService.postJson(config.huodongTequanReplace, params)
    },author)
    return resData
  }

  getBusinessIndexData(params = {}, author = true) {
    return this.TokenIsExpired(() => {
      let memberCenterCustomerCountPromise = this.httpService.get(config.getMemberCenterCustomerCount, params)
      let orderStatusCountsPromise = this.httpService.get(config.getOrderStatusCounts,params)
      let myCustomerTotalPromise = this.httpService.get(config.getMyCustomerTotal, params)
      let myCustomerTotalByHaoSongPromise = this.httpService.get(config.getMyCustomerTotalByHaoSong,params)

      return Promise.all([memberCenterCustomerCountPromise, orderStatusCountsPromise, myCustomerTotalPromise, myCustomerTotalByHaoSongPromise])
    }, author)
  }

  getMemberInfo(params = {}, author = true) {
    return this.TokenIsExpired(() => {
      return this.httpService.get(config.getMemberInfo, params)
    }, author)
  }

  addRelation(params = {}, author = true) {
    return this.TokenIsExpired(() => {
      return this.httpService.get(config.addRelation, params)
    }, author)
  }

  getBusinessCard(params = {}, author = true) {
    return this.TokenIsExpired(() => {
      return this.httpService.get(config.getBusinessCard, params)
    }, author)
  }
}

const requestCenter = new RequestCenter()

module.exports = requestCenter