var app = getApp();
var api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 3, //设置最多6张图片

    allImg: [],
    imgShow: [],
    ishuxin:false,
    howmuchzhungxiuimage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("预算报价的参数=",options)
    try{
    var Initialdata = JSON.parse(options.imgarr)
    }catch{
console.log("转换失败")
    }
    var that = this
    that.setData({
      imgarr: Initialdata,
      imgur: app.globalData.imgur
    })

    //查询装修需要话费多少钱广告图
    let howmuchdata = {
      rootId: 85,
    }
    api.newget('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', howmuchdata, 'GET', function (e) {
          that.setData({
            advdata: e.data
          })

    })
    api.request('/rest/dataDictionaryApi/dataDictionary?typegroupCode=web_huxing',{}, 'GET', function (e) {
      that.setData({
huxindata:e.data
      })
    })
  },


  onShow: function () {
    var that = this
    that.data.myTime = setInterval(function () {
      var thousandNum = Math.floor(Math.random() * 90000 + 10000);
      var thousandNumrengon = Math.floor(Math.random() * 90000 + 10000);
      var thousandNumsheji = Math.floor(Math.random() * 9000 + 1000);
      var thousandNumzhijian = Math.floor(Math.random() * 9000 + 1000);
      //将总金额转换为字符串
      var zongprice = thousandNum + thousandNumrengon + thousandNumsheji + thousandNumzhijian
      var strnumber = zongprice.toFixed(0)
      var numThreearr = strnumber.split('')
      that.setData({
        thousandNum: thousandNum,
        thousandNumrengon: thousandNumrengon,
        thousandNumsheji: thousandNumsheji,
        thousandNumzhijian: thousandNumzhijian,
        zongprice: zongprice,
        numThreearr: numThreearr
      })
    }, 500)


    //获取最近预约的列表
    api.request('/rest/tWebYuyueControllerApi/list?limitNum=20', {}, 'GET', function (e) {
      var msgList = []
      e.data.forEach(function (v, k) {
        if (v.createDate != null) {
          var timex = v.createDate
          // var year =timex.split('')[0]+timex.split('')[1]+timex.split('')[2]+timex.split('')[3];
          var month = timex.split('')[5] + timex.split('')[6];
          var day = timex.split('')[8] + timex.split('')[9];
          var name = v.name
          var timeStr = month + '月' + day + '日'
          msgList.push({ time: timeStr, name: name })
        }
      })
      that.setData({
        msgList: msgList
      })
    })
  },



  onHide: function (e) {
    clearInterval(this.data.myTime);

  },
  onUnload: function () {
    clearInterval(this.data.myTime);
  },


/**
 * 
 *    上传户型图
 * 
 * 
 */

  chooseImage: function () {
    var that = this;
    if(that.data.imgShow.length==3||that.data.allImg.length==3){
wx.showToast({
  title: '最多上传三张',
  icon:'none',
  duration:10000
})
return false;
    }
    var imgShowarr = that.data.imgShow;
    var imgshowlength = that.data.imgShow.length;
    var count = that.data.count - imgshowlength; //设置最多3张图片
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '加载中',
        })
        console.log(res)
        var topres = res
        topres.tempFilePaths.forEach(function(v,k){
      console.log(v)
      wx.uploadFile({
        url: app.globalData.upurl + '/rest/memberCenter/imageUpload',
        filePath: v,
        name: 'file',
        header: {
          "content-type": "multipart/form-data",
          'X-AUTH-TOKEN': app.globalData.token
        },
        formData: {
          "user": "test",
        },
        success(resson) {
          
          console.log(resson)
          if (resson.statusCode == 401) {
            wx.hideLoading({
  
            })
            app.obtaintoken()
            wx.showToast({
              title: '上传失败，请重新选择',
              icon: 'none',
              duration: 1500
            })
          } else {
            wx.hideLoading({
            })
            let topImage = that.data.allImg
            console.log(topImage)
            topImage.push(resson.data)
            that.setData({
              allImg: topImage
            })
            imgShowarr.push(v);
            that.setData({
              imgShow: imgShowarr
            })
           
          
         
            
          }
  
        }
      })
    })
      }
    })
  },
  // 删除图片
  deleteImage(e) {
    let self = this;
    let index = e.target.dataset.index;
    let imgShow = self.data.imgShow;
    let allImg = self.data.allImg;
    allImg.splice(index, 1);
    imgShow.splice(index, 1);
    this.setData({
      imgShow: imgShow,
      allImg: allImg
    })
  },
  
  previewImage: function (e) {
    console.log(this.data.files)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },


/**
 * 
 * 房屋户型选择
 * 
 */
  huxinchioce:function(){
    var that = this
    that.setData({
      ishuxin:!that.data.ishuxin
    })
    api.request('/rest/dataDictionaryApi/dataDictionary?typegroupCode=web_huxing',{}, 'GET', function (e) {
      that.setData({
huxindata:e.data
      })
    })

  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    // this.setData({
    // allImg: this.data.allImg.concat(e.detail.urls[0])
    // });
    console.log('upload success', e.detail, e.detail.urls)

  },




  huxinchioceson(e){
    var that = this
    that.setData({
      inputValues:e.currentTarget.dataset.name,
      ishuxin:!that.data.ishuxin,
      inputTypecode:e.currentTarget.dataset.typecode
    })
  },



  /*
   * 
   * 
   * 提交装修预算
   * 
   */
  formSubmit: function (e) {
    console.log(e)

    console.log(e)
    let that = this
    let name = e.detail.value.callofduty
    let tel = e.detail.value.phone
    let area = e.detail.value.areacodes
    let houseStructure = that.data.inputTypecode
    
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (tel.length === 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (tel.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (!myreg.test(tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    let data = {
      name: name,
      tel: tel,
      area: area,
      memberId:app.globalData.shareid,
      houseStructure: houseStructure,
      hxImage:that.data.allImg.join(','),
      sourceType:'xcx',
      comePosition:'预算报价'
    }
    console.log('预约接口上传data',data)
    api.request('/rest/tWebYuyueControllerApi/doAddYuyue', data, 'PUT', function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: '恭喜您预约成功,客服热线：0871-68123333',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          inputValue: '',
          inputValues: '',
          allImg:[],
          imgShow:[]
        })
      } else {
        wx.showToast({
          title: '预约失败',
          icon: 'none',
          duration: 1500
        })
      }
    })

  },


  //拨打电话
  tophone: function (el) {
    let phone = el.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () { }
    })
  },

  bindPickerChange:function(e){
console.log(e)
let that = this
let index = e.detail.value
that.setData({
  inputValues:that.data.huxindata[index].typename,
  inputTypecode:that.data.huxindata[index].typecode
})
  },
  selectedbtn: function (e) {
    console.log("点击广告返回的数据", e)
    console.log("点击广告返回的详情id", +e.currentTarget.dataset.id)
    let xcxpage = e.currentTarget.dataset.xcxpage       //跳转到页面的页面路径
    //如果广告的标题为空
    if (e.currentTarget.dataset.hometitle != undefined) {
      var pagetitle = e.currentTarget.dataset.hometitle
    } else {
      var pagetitle = ''
    }
    let id = e.currentTarget.dataset.id
    let newclassid = e.currentTarget.dataset.newclassid
    let specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
    let url = e.currentTarget.dataset.url
    let modelName = e.currentTarget.dataset.modelname
    console.log('所有广告的点击事件的url', url,'页面路径',xcxpage)
    console.log('所有广告的点击事件newclassId', newclassid)
          if(xcxpage){
            console.log('走进了新版广告图的方法')
            if( modelName == 'mallItemSkuVO'){
              let xcxpageurl = xcxpage.split('?')
              console.log(xcxpageurl)
              wx.navigateTo({
                url: xcxpageurl[0]+'?newsClassId='+155+'&NeworderType='+xcxpageurl[1]+'&objectId='+id+'&categoryId='+newclassid
                //categoryId只限产品部分，筛选时候用得倒，可能是cid
             })
            }else{
              wx.navigateTo({
                url: xcxpage+'?newsClassId='+newclassid+'&objectId='+id,
             })
            }
        }
        else if (url) {
          wx.navigateTo({
            url: '/xpages/h5page/h5page?url=' + url,
          })
        }
  },

})