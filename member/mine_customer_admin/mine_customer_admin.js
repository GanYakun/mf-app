// member/intent_customer_admin/intent_customer_admin.js
const app = getApp()
import requestCenter from '../../http/request-center' 
import config from "../../http/config"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    newFtpUrl:app.globalData.newFtpUrl,
    ftpUrl: config.ftpUrl,
    monthSign: "",
    totalSign: "",
    pickerShow:false,
    teamCustomerTotalList: [],
    staffTotal: '',
    mineDepart: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMyTeamCustomerTotal()
    this.getMyTeamCustomerTotalList()
  },

  //顶部统计
  async getMyTeamCustomerTotal(){
    var total =  await requestCenter.getMyTeamCustomerTotal()
    console.log("getMyTeamCustomerTotal", total.departmentNodes)
    this.setData({
      monthSign: total.monthlyAddition,
      totalSign: total.cumulative,
      mineDepart: total.departmentNodes,
    }, () => {
      if(this.data.mineDepart) {
        this.setData({
          deptName: this.data.mineDepart.departName,
          orgTypeid: this.data.mineDepart.id,
        })
      } else {
        this.setData({
          deptName: "",
          orgTypeid: "",
        })
      }
    })
  },

  //团队意向客户统计(团队员工的我的进店统计信息汇总)列表
  async getMyTeamCustomerTotalList(){
    let params = {
      departmentId:this.data.orgTypeid||'',   //部门ID
      employeeName:this.data.name||'',  //员工名字
      beginTime:this.data.startTime||'', //开始时间
      endTime:this.data.endTime||'', //结束时间
      orderField: this.data.sort||'',  //(receiveTotal:签到数,effectiveTotal:有效签到数, invalidTotal:无效签到数)
      orderType	:this.data.sortType||'', //排序方式（asc升序，desc降序）
      name: this.data.searchTitle||'',    //标题
    }
    var myTeamCustomerTotalList = await requestCenter.getMyTeamCustomerTotalList(params)
    this.setData({
      teamCustomerTotalList: myTeamCustomerTotalList,
      staffTotal: myTeamCustomerTotalList.length
    })
  },

  //点击部门
  clickdepar(){
    this.setData({
      pickerShow:true
    })
  },

   //项目点击
   clickItem(e) {
    this.setData({
      deptName: e.detail.deptName,
      orgTypeid: e.detail.orgTypeid,
    })
    this.getMyTeamCustomerTotalList()
  },

  //开始时间
  startTime(e) {
    let startTime = e.detail.value
    if (this.data.endTime && startTime > this.data.endTime) {
      app.showToastMessage('开始时间大于结束时间,请重新选择')
      return false
    }
    this.setData({
      startTime: startTime
    })
    if (this.data.endTime) {
      this.getMyTeamCustomerTotalList()
    }
  },

  //结束时间
  endTime(e) {
    let endTime = e.detail.value
    if (this.data.startTime && endTime < this.data.startTime) {
      app.showToastMessage('结束时间大于开始时间,请重新选择')
      return false
    }
    this.setData({
      endTime: endTime
    })
    if (this.data.startTime) {
      this.getMyTeamCustomerTotalList()
    }
  },

  //员工搜索
  searchStarff(e){
    this.setData({
      name:e.detail.value
    })
    this.getMyTeamCustomerTotalList()
  },

  //标题搜索
  searchTitle(e){
    this.setData({
      searchTitle:e.detail.value
    })
    this.getMyTeamCustomerTotalList()
  },

  //重置所有筛选数据
  reset() {
    if(this.data.mineDepart) {
      this.setData({
        deptName: this.data.mineDepart.departName,
        orgTypeid: this.data.mineDepart.id,
      })
    } else {
      this.setData({
        deptName: "",
        orgTypeid: "",
      })
    }
    this.setData({
      staffAsc:false,
      signNumAsc:false,
      signValidAsc:false,
      sort: '',
      sortType: '',
      searchValue: '',
      startTime: '',
      endTime: '',
      searchTitle: ''
    })
    this.getMyTeamCustomerTotalList()
  },

  //字段排序
  tableSort(e){
    let type = e.currentTarget.dataset.type
    let sortType = ''
    if(type=='receiveTotal'){
        this.setData({
          signNumAsc:this.data.signNumAsc?false:true,
          signNumDesc:this.data.signNumAsc?true:false,
        })
        sortType = this.data.signNumAsc?'desc':'asc'
    }else if(type=='effectiveTotal'){
      this.setData({
        signValidAsc:this.data.signValidAsc?false:true,
        signValiDesc:this.data.signValidAsc?true:false,
      })
      sortType = this.data.signValidAsc?'desc':'asc'
    }
    this.setData({
      sort:type,
      sortType:sortType
    })
    this.getMyTeamCustomerTotalList()
  },

  toIntentCustomer: function(event) {
    let item = event.currentTarget.dataset.item
    let issuerMemberId = item.issuerMemberId
    let issuerUserName = item.issuerUserName
    console.log("toIntentCustomer", item)
    wx.navigateTo({
      url: '/member/mine_infoshop/mine_infoshop?issuerMemberId=' + issuerMemberId + "&issuerUserName=" + issuerUserName,
    })
  }

})