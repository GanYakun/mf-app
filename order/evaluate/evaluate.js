// order/evaluate/evaluate.js
const app = getApp()
import requestCenter from "../../http/request-center" 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ftpUrl:app.globalData.newFtpUrl,
    evaIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNum:options.orderNum
    })
      this.getAppraiseLabel()
  },

  //查询评价页面数据
  async getAppraiseLabel(){
    let getAppraiseLabel = await requestCenter.getAppraiseLabel()
    this.setData({
      evaluateArr:getAppraiseLabel
    })
  },

  //满意和不满意
  isSatisfied(e){
    this.setData({
      evaIndex:e.target.dataset.type||e.currentTarget.dataset.type
    })
  },

  //评价输入事件
  evaInput(e){
    this.setData({
      wordLength:e.detail.value.length,
      content:e.detail.value
    })
  },

  //评价标签点击事件
  evaItem(e){
    let evaIndex = this.data.evaIndex
    let arr = this.data.indexArr&&this.data.indexArr[evaIndex]?this.data.indexArr[evaIndex]:[]
    let currntIndex = arr.indexOf(e.currentTarget.dataset.index)
    if(currntIndex!=-1){
      arr.splice(currntIndex,1)
    }else{
      arr.push(e.currentTarget.dataset.index)
    }
    
    this.setData({
      [`indexArr[${evaIndex}]`]:arr
    })
  },

  //提交评价
  evaSub(){
    let evaIndex = this.data.evaIndex
    let labArr = (this.data.evaluateArr[evaIndex].labelTags).split(',')
    let indexArr = this.data.indexArr[evaIndex]
    let newArr = []
    if(indexArr&&indexArr.length>0){
      for(let i = 0;i<indexArr.length;i++){
        newArr.push(labArr[indexArr[i]])
      }
    }
    console.log(newArr)
    let params = {
      orderId:this.data.orderNum,
      title:this.data.evaluateArr[evaIndex].title,
      labelTags:newArr&&newArr.length>0?newArr.join(','):'',
      content:this.data.content||''
    }
    let postOrderAppraise = requestCenter.postOrderAppraise(params)
    app.showToastMessage('评价成功')
    let timer = setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1500);
  },
  
})