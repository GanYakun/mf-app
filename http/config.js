
const host = "https://www.100good.cn/" //正式服
// var host = 'http://127.0.0.1:8080/mlsmall' //本地
// const host = 'http://116.55.226.51:8087/'   //测试服
// var host = 'http://xcx.lieying100.com/' //测试服2

// var host = 'http://192.168.0.121:8080'
// const host = app.globalData.hostUrl
var ftpUrl = `${host}/images/xcx`
var config={
  host:host,
  ftpUrl:ftpUrl,
  // ftpUrl:ftpUrl+'/home/admin/www/program/mlsmall/plug-in/aykjmobile/images/',
  //查询产品分类
  pageSize: 12,
  getChildList:`${host}/rest/tWebMallItemCatControllerApi/getChildList`,

  //查询美家案例的楼盘风格或拎包案例的筛选等
  getSrarchOptionsBySearchCode:`${host}/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode`,

  //页面列表数据模型
  getPageModel:`${host}/rest/newsClass/getPageModel`,

  //查询该商品所属的大分类
  locationList:`${host}/rest/tWebMallItemCatControllerApi/locationList`,
  
  //查询根目录下的所有的大分类
  getAllList:`${host}/rest/tWebMallItemCatControllerApi/getAllList`,
  
  //店长推荐的分类
  getChildLists:`${host}/rest/tWebMallItemCatControllerApi/getChildLists`,

  //查询店长推荐（原本月爆款）的列表
  getHotDetailsList:`${host}/rest/tWebPromotionsControllerApi/getHotDetailsList`,

  //查询店长推荐（原本月爆款）的列表 new
  getStoreRecommendList:`${host}/rest/tWebPromotionsControllerApi/storeRecommendList`,

  //查询广告图
  getWxBannerByRootIdKey:`${host}/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey`,

  //毛坯房或者精装房顶部的筛选项
  getRootByNewsClassId:`${host}/rest/tWebSearchOptionControllerApi/getRootByNewsClassId`,

  //我的下定导出清单
  getDepositOrderProductListExport:`${host}/rest/memberCenter/getDepositOrderProductListExport`,

  //根据cid获取产品非销售属性列表接口---gaw
  getMallItemUnProp:`${host}/rest/tWebMallItemCatControllerApi/getMallItemUnProp`,

  //加入购物车接口
  putSaveOrUpdateCart:`${host}/rest/memberCenter/saveOrUpdateCart`,

  //查询设计团队接口
  getDesingerSearchOption:`${host}/rest/tWebSearchOptionControllerApi/getDesingerSearchOption`,
  
  //获取产品列表结果共性系列数据接口
  getMallItemCommonIdentification:`${host}/rest/tWebMallItemSkuControllerApi/getMallItemCommonIdentification`,

  //查询模型详情数据
  getModel:`${host}/rest/newsClass/getModel`,

  //立即购买接口
  getNowBuy:`${host}/rest/memberCenter/nowBuy`,

  //商品限购接口
  putLimitCounts:`${host}/rest/memberCenter/limitCounts`,

  //拎包案例的查询设计师
  getDesingerSearchOption2:`${host}/rest/tWebSearchOptionControllerApi/getDesingerSearchOption2`,

  //拎包案例的查询设计师
  getFansList:`${host}/rest/tWebActivityPosterApi/getList`,

  //账号密码获取touken
  getTokens:`${host}/rest/frontTokens`,

  //查询内部会员列表数据
  getmemberListByIsEmployee:`${host}/rest/memberCenter/getEmployeeMemberInfos`,

  //查询内部会员统计数据
  getMemberListByIsEmployeeCount:`${host}/rest/memberCenter/memberListByIsEmployeeCount`,

  //数据字典
  getDataDictionary:`${host}/rest/dataDictionaryApi/dataDictionary`,
  
  //查询指定会员的意向客户
  getMemberCustomerListByMemberId:`${host}/rest/memberCenter/getMemberCustomerListByMemberId`,

  //生成二维码
  getCreateQRCode:`${host}/rest/memberCenter/createQRCode`,
  
  //内部会员统计数据 【浏览】
  getMemberListByIsEmployeeCount2:`${host}/rest/memberCenter/memberListByIsEmployeeCount2`,

  //查询内部会员列表数据[浏览]
  getMemberListByIsEmployee2:`${host}/rest/memberCenter/getEmployeeMemberInfos2`,

  //获取可用优惠券
  getCouponList:`${host}/rest/memberCenter/getCouponList`,

  //上传图片接口
  uploadFile:`${host}/rest/memberCenter/imageUpload`,

  //获取可用的暖心服务优惠券列表
  getNxSererCouponList:`${host}/rest/memberCenter/getCouponList`,

  //生成优惠券领取二维码
  getCreateCouponQRCode:`${host}/rest/memberCenter/createCouponQRCode`,

  //会员领取优惠券
  postCoupon:`${host}/rest/memberCenter/getCoupon`,

  //会员领取优惠券前
  preGetCoupon:`${host}/rest/memberCenter/preGetCoupon`,

  //会员拥有的优惠券
  getMyCoupon:`${host}/rest/memberCenter/MyCoupon`,

  //获取评价的信息
  getAppraiseLabel:`${host}/rest/memberCenter/getAppraiseLabel`,

  //对订单评价
  postOrderAppraise:`${host}/rest/memberCenter/orderAppraise`,

  //购物的筛选的数量
  getOrderStatusCounts:`${host}/rest/memberCenter/getOrderStatusCounts`,

  //部门筛选
  getDepartmentList:`${host}/rest/department/getDepartmentList`,
  
  addCollection: `${host}/rest/memberCenter/addCollection`,//收藏
  deleteCollectionById: `${host}/rest/memberCenter/deleteCollectionById`,//取消收藏
  //活动签到
  getEmployeeCode: `${host}/rest/tWebHuoDongControllerApi/getEmployeeCode`,   //生成活动签到二维码
  getActivitySignList: `${host}/rest/tWebHuoDongControllerApi/getList`,  //活动签到列表
  getMyCustomerList: `${host}/rest/tWebHuoDongControllerApi/getMyCustomerList`,   //员工我的进店(活动被签到)列表
  getMyCustomerTotal: `${host}/rest/tWebHuoDongControllerApi/getMyCustomerTotal`,    //员工我的进店(活动被签到)顶部统计
  getMyReceiveRecordList: `${host}/rest/tWebHuoDongControllerApi/getMyReceiveRecordList`,    //我的当期活动特权包记录列表
  getMyTeamCustomerTotal: `${host}/rest/tWebHuoDongControllerApi/getMyTeamCustomerTotal`,   //团队我的进店(团队员工的我的进店统计信息汇总)顶部统计包含组织机构
  getMyTeamCustomerTotalList: `${host}/rest/tWebHuoDongControllerApi/getMyTeamCustomerTotalList`,   //团队意向客户统计(团队员工的我的进店统计信息汇总)列表

  getHaoSongMyTeamCustomerTotal: `${host}/rest/TWebHaoSongControllerApi/getMyTeamCustomerTotal`,   //团队意向客户(团队员工的意向客户统计信息汇总)顶部统计包含组织机构
  getHaoSongMyTeamCustomerTotalList: `${host}/rest/TWebHaoSongControllerApi/getMyTeamCustomerTotalList`,  //团队意向客户统计(团队员工的意向客户统计信息汇总)


  //进店壕送
  getSignInDetail:`${host}/rest/tWebHuoDongControllerApi/getHuodongById`,// 获取活动详情
  getHaoSongList: `${host}/rest/TWebHaoSongControllerApi/getList`,//获取豪送列表数据
  generateHaoSongCode: `${host}/rest/TWebHaoSongControllerApi/getEmployeeCode`,//生成壕送小程序二维码
  getHaosongDetail: `${host}/rest/TWebHaoSongControllerApi/getHaosongById`,//查询壕送详情
  confirmReceiveHaoSong: `${host}/rest/TWebHaoSongControllerApi/confirmReceive`,//领取壕送
  getHaosongReceiveRecordList: `${host}/rest/TWebHaoSongControllerApi/getMyReceiveRecordList`,//壕送领取记录
  confirmReceive:`${host}/rest/tWebHuoDongControllerApi/confirmReceive`, //提交签到
  getHaosongReceiveRecordDetail:`${host}/rest/TWebHaoSongControllerApi/getRecordById`,//通过壕送领取记录ID查询详情
  confirmHaosongWriteOff: `${host}/rest/TWebHaoSongControllerApi/confirmWriteOff`,//确认壕送核销
  getMyCustomerTotalByHaoSong: `${host}/rest/TWebHaoSongControllerApi/getMyCustomerTotal`,
  getMyCustomerListByHaoSong:`${host}/rest/TWebHaoSongControllerApi/getMyCustomerList`,
  getMyReceiveRecordProList: `${host}/rest/tWebHuoDongControllerApi/getMyReceiveRecordView`,//获取活动产品
  huodongTequanReplace: `${host}/rest/tWebHuoDongControllerApi/huodongTequanReplace`,   //活动特权包替换
  code2session: `${host}/rest/weiXin/jscode2session`, //code2session
  decryptionPhone: `${host}/rest/weiXin/decryptionPhone`, //解密手机号,
  xcxBind: `${host}/rest/weiXin/xcxBind`, //小程序授权注册流程
  getMemberCenterCustomerCount: `${host}/rest/memberCenter/memberCenterCustomerCount`,
  getMemberInfo: `${host}/rest/memberCenter/getMemberInfo`, //获取会员信息,
  commonUploadFile: `${host}/rest/weiXin/imageUpload`, //上传文件
  addRelation: `${host}/rest/weiXin/addRelation`, //绑定上下级关系
  getBusinessCard: `${host}/rest/shareApi/getBusinessCard`,
}

module.exports = config