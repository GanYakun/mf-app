// components/floor-item-evaluate/index.js
var api = require("../../utils/api.js")
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        newVal.adImageList.list.push({
          "tag": null,
          "createName": "尹丹",
          "createBy": "yindan",
          "createDate": "2020-12-10 11:16:30",
          "updateName": "尹丹",
          "updateBy": "yindan",
          "updateDate": "2020-12-10 14:12:34",
          "sysOrgCode": "A01A01A01",
          "sysCompanyCode": "A01",
          "bpmStatus": "1",
          "memberId": 36,
          "title": "盛夏梦之镜",
          "audited": 1,
          "topImage": "ff808081764a35a101764aa613500025,ff808081764a35a101764aa613ba0026,ff808081764a35a101764aa615de002a,ff808081764a35a101764aa615170027,ff808081764a35a101764aa615530028,ff808081764a35a101764aa615ad0029,ff808081764a35a101764aa615fc002b,ff808081764a35a101764aa616d5002c,ff808081764a35a101764aa6173e002d",
          "contributeOrederBy": null,
          "orderValue": 103,
          "praise": 3093,
          "browseNum": 5158,
          "pictureList": null,
          "contention": "<p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556133053710.jpg\" style=\"\" title=\"1607568556133053710.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556149076405.jpg\" style=\"\" title=\"1607568556149076405.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556706009630.jpg\" style=\"\" title=\"1607568556706009630.jpg\"/></p><p style=\"text-align: center;\"><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556374033484.jpg\" style=\"\" title=\"1607568556374033484.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556549017944.jpg\" style=\"\" title=\"1607568556549017944.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556675086207.jpg\" style=\"\" title=\"1607568556675086207.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557012011969.jpg\" style=\"\" title=\"1607568557012011969.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568556803039657.jpg\" style=\"\" title=\"1607568556803039657.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557553025404.jpg\" style=\"\" title=\"1607568557553025404.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557231099090.jpg\" style=\"\" title=\"1607568557231099090.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557243847881.jpg\" style=\"\" title=\"1607568557243847881.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557275062429.jpg\" style=\"\" title=\"1607568557275062429.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557403096635.jpg\" style=\"\" title=\"1607568557403096635.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557401085877.jpg\" style=\"\" title=\"1607568557401085877.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557443076529.jpg\" style=\"\" title=\"1607568557443076529.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557452024629.jpg\" style=\"\" title=\"1607568557452024629.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557473045318.jpg\" style=\"\" title=\"1607568557473045318.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557486038625.jpg\" style=\"\" title=\"1607568557486038625.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557502096312.jpg\" style=\"\" title=\"1607568557502096312.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557679063155.jpg\" style=\"\" title=\"1607568557679063155.jpg\"/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"//wj.100good.cn/ueditor/ueditor/jsp/upload/image/20201210/1607568557978061748.jpg\" style=\"\" title=\"1607568557978061748.jpg\"/></p><p><br/></p><p><br/></p>",
          "memberName": "张丽芸",
          "up": 0,
          "briefContent": "或许每个女生都一个关于盛夏的美好回忆，摇曳的电扇、窗外的蝉鸣、唇齿间哈密瓜的清香。\r\n一瓶冰镇汽水，阵雨之后凉爽的风，还有那男孩远去的身影。",
          "topImageList": [{
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAXr8SAALcRESqxE0249.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110045ohqp6hkdoqdzmhml"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOABP1kAARXjLJxO80722.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110052uuj48moojo8ol7b1"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAerTiAATLjvTkfXw376.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110101h5u8v78apy78p51u"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAfEp2AAIOjYGjsYI931.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110116izr68c28yronr77c"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQSAMHVwAAE8cscE8QU641.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110124wehuc35aed3bw33e"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAJcOoAAQcBohT0sc954.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110059ktq5itqmnn1xtmwz"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAFXTFAAKrBRMbxHM045.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110119ue18ezeovefe1ovo"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQSAHHFrAAIIaPxSvrU254.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110122gy87f4vrv85kxv8d"
          }, {
            "imagePath": "group1/M00/00/DD/dDf7E1_RjQOAcMyfAAImqWWZRZs272.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "110118iv5vxu6xbhomb644"
          }],
          "contributeReviewList": null,
          "auditedName": null,
          "reviewNum": 3,
          "jinghua": 1,
          "remen": 1,
          "top": 1,
          "recommend": 1,
          "reviewList": [{
            "createName": null,
            "createBy": null,
            "createDate": null,
            "updateName": null,
            "updateBy": null,
            "updateDate": null,
            "sysOrgCode": null,
            "sysCompanyCode": null,
            "bpmStatus": null,
            "isShow": 1,
            "memberId": 176,
            "pictures": null,
            "beMemberId": 36,
            "orderValue": 0,
            "contributeId": 101,
            "contributeReviewId": null,
            "memberName": "Sakura",
            "up": 0,
            "beContent": null,
            "contributeTitle": null,
            "beMemberName": null,
            "childRevieFlag": null,
            "beCreateTime": "2020-12-14 15:31:38",
            "memberLogoImage": {
              "imagePath": "group1/M00/00/CD/dDf7E1-2IESAFnaOAAAP1FCB8gc374.jpg",
              "searchName": null,
              "urlPath": null,
              "searchId": null,
              "imageId": null,
              "searchRootId": null,
              "fileName": "Sakura"
            },
            "stamp": 0,
            "id": 61,
            "content": "我的"
          }, {
            "createName": null,
            "createBy": null,
            "createDate": null,
            "updateName": null,
            "updateBy": null,
            "updateDate": null,
            "sysOrgCode": null,
            "sysCompanyCode": null,
            "bpmStatus": null,
            "isShow": 1,
            "memberId": 176,
            "pictures": null,
            "beMemberId": 36,
            "orderValue": 0,
            "contributeId": 101,
            "contributeReviewId": null,
            "memberName": "Sakura",
            "up": 0,
            "beContent": null,
            "contributeTitle": null,
            "beMemberName": null,
            "childRevieFlag": null,
            "beCreateTime": "2020-12-14 15:31:46",
            "memberLogoImage": {
              "imagePath": "group1/M00/00/CD/dDf7E1-2IESAFnaOAAAP1FCB8gc374.jpg",
              "searchName": null,
              "urlPath": null,
              "searchId": null,
              "imageId": null,
              "searchRootId": null,
              "fileName": "Sakura"
            },
            "stamp": 0,
            "id": 62,
            "content": "我的"
          }, {
            "createName": null,
            "createBy": null,
            "createDate": null,
            "updateName": null,
            "updateBy": null,
            "updateDate": null,
            "sysOrgCode": null,
            "sysCompanyCode": null,
            "bpmStatus": null,
            "isShow": 1,
            "memberId": 187,
            "pictures": null,
            "beMemberId": 36,
            "orderValue": 0,
            "contributeId": 101,
            "contributeReviewId": null,
            "memberName": "魏萌萌",
            "up": 0,
            "beContent": null,
            "contributeTitle": null,
            "beMemberName": null,
            "childRevieFlag": null,
            "beCreateTime": "2020-12-31 14:53:04",
            "memberLogoImage": {
              "imagePath": "group1/M00/00/CF/dDf7E1--Cq6ARWvGAAAY7Tkrz6M256.jpg",
              "searchName": null,
              "urlPath": null,
              "searchId": null,
              "imageId": null,
              "searchRootId": null,
              "fileName": "？？？？"
            },
            "stamp": 0,
            "id": 63,
            "content": "不错不错"
          }],
          "memberLogoImage": {
            "imagePath": "group1/M00/00/6D/dDf7E18hGviAX0LAAADIuHlfVCc013.jpg",
            "searchName": null,
            "urlPath": null,
            "searchId": null,
            "imageId": null,
            "searchRootId": null,
            "fileName": "张丽芸"
          },
          "pictureImageList": null,
          "seoTitle": null,
          "seoKeyword": null,
          "seoDescription": null,
          "stamp": 0,
          "typeName": null,
          "id": 101,
          "type": "2"
        })
        this.setData({
          _item: newVal
        })
        this.setCollapse()
      }
    },
    itemWidth: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        this.setData({
          _itemWidth: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item: null,
    imgur: app.globalData.imgur,
    _itemWidth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAction: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },

    onBannerTap: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.detail.position

      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },

    onPraiseTap: function(event) {
      let that = this
      let token = app.globalData.token
      let index = event.currentTarget.dataset.index
      let id = event.currentTarget.dataset.id
      that.setData({
        id: id,
      })
      if (event.currentTarget.dataset.isclick) {
        wx.showToast({
          title: '你已经点过赞了',
          icon: 'none'
        })
      } else {
        let data = {}
        let header = {
          'content-type': 'application/json',
          'X-AUTH-TOKEN': token
        }
        api.xpost('/rest/tWebContributeControllerApi/contributePraise?contributeId=' + id, data, 'PUT', header, function (e) {
          if (e.code == 200) {
            var listx = '_item.adImageList.list[' + index + '].isclick'
            var clicknum = '_item.adImageList.list[' + index + '].praise'
            that.setData({
              [listx]: true,
              [clicknum]: e.data
            })
            wx.showToast({
              title: e.message,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: e.message,
              icon: 'none'
            })
          }
        })
      }
    },

    meyaopingjia: function (e) {
      let that = this
      let contributeId = e.currentTarget.dataset.id
      let commentIndex = e.currentTarget.dataset.commentIndex
      that.setData({
        iosDialog22: true,
        contributeId: contributeId,
        commentIndex: commentIndex,
        isclicktab: true
      })
    },

    close: function (event) {
      this.setData({
        iosDialog22: false,
        isclicktab: false
      })
    },

    shurucontent: function (e) {
      console.log(e)
      this.setData({
        inputcontent: e.detail.value
      })
    },

    queding: function (e) {
      let that = this
      if (app.globalData.token == undefined) {
        let userinfoss = wx.getStorageSync('xuserixnfo')
        if (userinfoss == "") {
          that.setData({
            iosDialog1: true
          })
        } else {
          that.setData({
            iosDialog2: true
          })
        }
      } else {
        if (that.data.inputcontent == null) {
          wx.showToast({
            title: '请输入内容',
            icon: 'none',
            duration: 1500
          })
          return
        }
        let header = {
          'content-type': 'application/json',
          'X-AUTH-TOKEN': app.globalData.token
        }
        let data = {
          content: that.data.inputcontent,
          contributeId: that.data.contributeId
        }
        api.xpost('/rest/memberCenter/contributeReply', data, 'POST', header, (e) => {
          if (e.message == '未登录') {
            wx.showLoading({
              title: '加载中...',
              duration: 1500,
            });
          } else {
            wx.showToast({
              title: e.message,
              icon: 'none',
              duration: 1500
            })
          }
          that.setData({
            iosDialog22: false
          })
          let reviewResult = {
            content: that.data.inputcontent,
            memberName: getApp().globalData.uinfo.nick
          }
  
          let _item = this.data._item
          let adImageList = _item.adImageList
          let commentList = adImageList.list
          let commentIndex = that.data.commentIndex
          let commentItem = commentList[commentIndex]
          commentItem.reviewList.push(reviewResult)
          that.setData({
            _item: _item
          })
        })
      }
    },

    lookAllComment: function(event) {
      console.log("查看全部评论",this.data._item)
      var _item = this.data._item
      var name = _item.name
      var newsClass = _item.newsClass
      var newsClassId = newsClass ? newsClass.id:"" 

      wx.navigateTo({
        url: '/xpages/wordofmouth/wordofmouth?id=' + newsClassId + '&toptext=' + name,
      })
    },

    //判断是否显示全文
    setCollapse: function () {
      const query = this.createSelectorQuery();
      var that = this;
      var _item = this.data._item
      query.selectAll('.evaluate-content').boundingClientRect(function (rect) {
        rect.forEach((v, i) => {
          if (v.height > 66) { //判断高度,根据各种高度取折中
            _item.adImageList.list[i].collapse = true
            _item.adImageList.list[i].showCollapse = true
          }
        })
        that.setData({
          _item: _item
        })
      }).exec();
    },

    /**
     * 
     * 用户口碑点击全文显示完整评论的内容
     * 
     * 
     */
    textqueries: function (e) {
      let index = e.currentTarget.dataset.index
      var _item = this.data._item
      _item.adImageList.list[index].collapse = !_item.adImageList.list[index].collapse
      _item.adImageList.list[index].showCollapse = !_item.adImageList.list[index].collapse
      this.setData({
        _item: _item
      })
    },

    previewImage: function (e) {
      var index = e.currentTarget.dataset.index
      var topImageList = e.currentTarget.dataset.topimagelist
      var imgur = this.data.imgur
      var imgarr = []
      topImageList.forEach((v, k) => {
        imgarr.push(imgur + v.imagePath)
      });
      wx.previewImage({
        current: imgarr[index], // 当前显示图片的http链接
        urls: imgarr // 所有要预览的图片的地址集合 数组形式
      })
    }
  }
})
