// businesscard/internal-member-list/internal-member-list.js
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    qcappnoshare:true,
    newFtpUrl:app.globalData.newFtpUrl,
    firstindex:0,
    secondindex:0,
    thirdlyindex:0,
    pickerShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      this.getmemberListByIsEmployee()
      this.getMemberListByIsEmployeeCount()
      // this.getDataDictionary()
      this.getDepartmentList()
    }, 1000);
    
  },
  //查询部门列表
  async getDepartmentList(){
    let params = {
      typegroupCode:'designer_department'
    }
    let getDepartmentList = await requestCenter.getDepartmentList(params)
    console.log('getDepartmentList',getDepartmentList)
    // getDataDictionary.unshift({typename:'',typecode:''})
    this.setData({
      getDepartmentList:getDepartmentList[0].children,
      mineDepart: getDepartmentList[0]
    })    
  },
  
  //查询部门列表
  async getDataDictionary(){
    
    let params = {
      typegroupCode:'designer_department'
    }
    let getDataDictionary = await requestCenter.getDataDictionary(params)
    console.log('getDataDictionary',getDataDictionary)
    // getDataDictionary.unshift({typename:'',typecode:''})
    this.setData({
      getDataDictionary:getDataDictionary,
     
    })
      
    },
    

  async getMemberListByIsEmployeeCount(){
    let params={
     
    }
    let getMemberListByIsEmployeeCount = await requestCenter.getMemberListByIsEmployeeCount(params)
    console.log("getMemberListByIsEmployeeCount", getMemberListByIsEmployeeCount)
    this.setData({
      count:getMemberListByIsEmployeeCount
    })
  },
  async getmemberListByIsEmployee(){
    this.setData({
      isShowLoding:true
    })
    let params = {
      departmentId:this.data.orgTypeid||'',
      employeeName:this.data.name||'',  //员工名字
      startTime:this.data.startTime||'', //开始时间
      endTime:this.data.endTime||'', //结束时间
      orderField:this.data.sort||'',  //(brokercount:经纪人,bmcount:报名,yxcount:意向)
      orderType	:this.data.sortType||'' //排序方式（asc升序，desc降序）
    }
    let getmemberListByIsEmployee = await requestCenter.getmemberListByIsEmployee(params)
    this.setData({
      list:getmemberListByIsEmployee,
      isShowLoding:false
    })
  },

  //开始时间
  startTime(e){
    let startTime = e.detail.value
    if(this.data.endTime&&startTime>this.data.endTime){
      app.showToastMessage('开始时间大于结束时间,请重新选择')
      return false
    }
    this.setData({
      startTime:startTime
    })
    if(this.data.endTime){
      this.getmemberListByIsEmployee()
    }
    
  },

  //结束时间
  endTime(e){
    let endTime = e.detail.value
    if(this.data.startTime&&endTime<this.data.startTime){
      app.showToastMessage('结束时间大于开始时间,请重新选择')
      return false
    }
    this.setData({
      endTime:endTime
    })
    if(this.data.startTime){
      this.getmemberListByIsEmployee()
    }
    
  },

 

  //员工搜索
  search(e){
    this.setData({
      name:e.detail.value
    })
    this.getmemberListByIsEmployee()
  },


  scrrenTap(e){
    console.log(e)
    let type = e.currentTarget.dataset.type
    let sortType = ''
    if(type=='brokerCount'){
      this.setData({
        brokercountAsc:this.data.brokercountAsc?false:true,
        brokercountDesc:this.data.brokercountAsc?true:false,
      })
      sortType = this.data.brokercountAsc?'desc':'asc'
    }else if(type=='subscribeCount'){
        this.setData({
          bmcountAsc:this.data.bmcountAsc?false:true,
          bmcountDesc:this.data.bmcountAsc?true:false,
        })
        sortType = this.data.bmcountAsc?'desc':'asc'
    }else if(type=='customerCount'){
      this.setData({
        yxcountAsc:this.data.yxcountAsc?false:true,
        yxcountDesc:this.data.yxcountAsc?true:false,
      })
      sortType = this.data.yxcountAsc?'desc':'asc'
    }
    this.setData({
      sort:type,
      sortType:sortType
    })
    this.getmemberListByIsEmployee()
  },

  //内部会员点击
  listTap(e){
      let memberListByIsEmployeeCount = this.data.count || {}
      if(!memberListByIsEmployeeCount.ISLEADER) {
        return
      }
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/businesscard/Potentialcustomers/Potentialcustomers?id='+id,
      })
  },

  //重置所有筛选数据
  reset(){
    this.setData({
      brokercountAsc:false,
      bmcountAsc:false,
      yxcountAsc:false,
      sortType:'',
      sort:'',
      searchValue:'',
      deptName:'',
      startTime:'',
      endTime:'',
      orgTypeid:'',
      name:''
    })
    this.getmemberListByIsEmployee()
  },






   //部门选择
  //  depTap(e){
  //   let index = e.detail.value
  //   this.setData({
  //     dept:this.data.getDataDictionary[index].typecode,
  //     deptName:this.data.getDataDictionary[index].typename,
  //   })
  //   this.getmemberListByIsEmployee()
  // },
  //选择弹窗
  clickdepar(){
    this.setData({
      pickerShow:true
    })
  },
  pickercarend1(e){
    // console.log(e.detail.value[0])
    let index = e.detail.value[0]
    console.log("第一项",index)
    this.setData({
      firstindex:index
    })
  },
  pickercarend2(e){
    let index = e.detail.value[0]
    console.log("第二项",index)
    this.setData({
      secondindex:index
    })
  },
  pickercarend3(e){
    let index = e.detail.value[0]
    console.log("第三项",index)
    this.setData({
      thirdlyindex:index
    })
  },
  clickcancel(){
    this.setData({
      pickerShow:false
    })
  },
  clickItem(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      deptName:e.currentTarget.dataset.departname,
      orgTypeid:e.currentTarget.dataset.id,
      pickerShow:false
    })
    console.log("departName"+e.currentTarget.dataset.departname+"orgTypeid"+e.currentTarget.dataset.id)
    this.getmemberListByIsEmployee()
  },
  clicksub(){
    console.log('确认！')
    let firstindex = this.data.firstindex;
    let secondindex = this.data.secondindex;
    let thirdlyindex = this.data.thirdlyindex;
    let list = this.data.getDepartmentList;
    let orgTypeid = list[firstindex].id;
    let departName = list[firstindex].departName;
    if (list[firstindex].children != null && list[firstindex].children[secondindex] ) {
      orgTypeid = list[firstindex].children[secondindex].id;
      departName = list[firstindex].children[secondindex].departName;
      console.log('来到第二级')
      if (list[firstindex].children[secondindex].children != null && list[firstindex].children[secondindex].children[thirdlyindex]) {
        orgTypeid = list[firstindex].children[secondindex].children[thirdlyindex].id;
        departName = list[firstindex].children[secondindex].children[thirdlyindex].departName;
        console.log('来到第三级')
      }
    }
    this.setData({
      deptName:departName,
      orgTypeid:orgTypeid,
      pickerShow:false
    })
    this.getmemberListByIsEmployee()
    console.log("departName"+departName+"orgTypeid"+orgTypeid)

  },

  onDepartChange: function(event) {
    console.log("onDepartChange", event)
    let deptName = event.detail.deptName
    let orgTypeid = event.detail.orgTypeid
    this.setData({
      deptName:deptName,
      orgTypeid:orgTypeid,
      pickerShow:false
    })
    this.getmemberListByIsEmployee()
  }






})