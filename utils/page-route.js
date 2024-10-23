

class allAction{
  //所有楼层公告事件接收器
  onAction (event) {
    console.log("event", event)
    var eventType = event.eventType
    var position = event.position
    var source = event.source
    var newmore = event.moretype //判断是否是右侧的更多
    if (eventType == "detail") {
      this.processDetailEvent(position, source)
    } else if (eventType == "banner") {
      this.processBannerEvent(position, source)
    } else if (eventType == "filter") {
      this.processFilterEvent(position, source)
    } else if (eventType == "subtitle") {
      this.processSubtitleEvent(position, source)
    } else if (eventType == "build") {
      this.processBuildEvent(position, source)
    } else if (eventType == "more" || eventType == "moreRight") {
      this.processMoreEvent(position, source, eventType)
    } else if (eventType == "vr") {
      this.processVrEvent(position, source)
    } else if (eventType == "moreVr") {
      this.processMoreVrEvent(position, source)
    } else if (eventType == "topBanner") {
      this.processTopBannerEvent(position, source)
    } else if (eventType == "topMenu") {
      this.processTopMenuEvent(position, source)
    } else if (eventType == "moreVideo") {
      this.processMoreVideoEvent(position, source)
    } else if (eventType == "videoFilter") {
      this.processVideoFilterEvent(position, source)
    }else if (eventType == "activityMore"){
      this.processActivityMore(position)
    }else if(eventType == "advMore"){
      this.processAdvlist(source)
    }else if(eventType=='brandBanner'){
      this.processAdvbrandList(position, source)
    }
  }

  processDetailEvent (position,source){
    var type = source.type
    var newsClass = source.newsClass
    if (type == "1" || type=="3") {
      //普通楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj : []
      var item = list[position]

      var xcxpage = item.xcxpage
      var id = item.contentId
      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var pagetitle = ""
      var url = item.url
      var modelName = item.modelName
      console.log('模型名字',modelName)
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          let xcxpageurl = xcxpage.split('?')
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData+'&source='+encodeURIComponent(JSON.stringify(source)) 
            //categoryId只限产品部分，筛选时候用得倒，可能是cid
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '/xpages/h5page/h5page?url=' + url,
        })
      }
    } else if (type == "2") {
      //大礼包楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj : []
      var item = list[position]

      var id = item.id
      var promotionsContent = item.promotionsContent
      var buyItAlone = item.buyItAlone
      var promotionsperiod = item.promotionsPeriod
      wx.navigateTo({
        url: '/xpages/currentactivity/currentactivity?Giftbag=' + id + '&miaoshu=' + encodeURIComponent(promotionsContent) + '&buyItAlone=' + buyItAlone + '&promotionsperiod=' + promotionsperiod,
      })
     } 
     //else if (type == "3") {
    //   //当期活动楼层
    //   var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
    //   var list = listObj && listObj.proList ? listObj.proList : []
    //   var item = list[position]

    //   var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
    //   var objectId = item.pid
    //   var typeId = 0
    //   var itemName = item.itemName
    //   var productName = item.productName
    //   var cid = item.cid
    //   var typeofpurchase = 'dangqi'

    //   wx.navigateTo({
    //     url: '/xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + "&NeworderType=" + 2,
    //   })
    // } 
    else if (type == "4") {
      //限时抢购楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj && listObj.proList ? listObj.proList : []
      var item = list[position]

      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var pid = item.pid
      var itemname = item.productName
      var productname = item.productName
      var cid = item.cid

      let params = {
        promotionsType: 1,
      }
      api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', params, 'GET', function (e) {
        let promotionsId = e.data[0].id
        let data = {
          objectId: pid,
          newsClassId: newclassid,
          typeId: 0,
          extendData: {
            // promotionsId: "81", //促销id
            promotionsId : promotionsId,
            promotionsType: 1,
          }
        }

        let isgonnengdata = {
          itemName: itemname,
          productName: productname,
          cid: cid
        }

        wx.navigateTo({
          url: '/xpages/shop/shop?buytype=4' + '&buydata=' + JSON.stringify(data) + '&isgonnengdata=' + JSON.stringify(isgonnengdata)
        })
      })
    } else if (type == "5") {
      //样品特卖楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj && listObj.proList ? listObj.proList : []
      var item = list[position]

      var objectId = item.pid
      var typeId = 0
      var itemName = item.itemName
      var productName = item.productName
      var cid = item.cid
      var typeofpurchase = 'dangqi'
      wx.navigateTo({
        url: '/xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + '&NeworderType=' + 3,
      })
    } else if (type == "6") {
      //细节、头条楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj ? listObj : []
      var item = list[position]

      var xcxpage = item.xcxpage
      var id = item.contentId
      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var pagetitle = item.name
      var url = item.url
      var modelName = item.modelName
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          let xcxpageurl = xcxpage.split('?')
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
            //categoryId只限产品部分，筛选时候用得倒，可能是cid
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '/xpages/h5page/h5page?url=' + url,
        })
      }
    } else if (type == "7") {
      //实体门店楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj && listObj.list ? listObj.list : []
      var item = list[position]

      var imgarr = item.thumbnailsPath
      var title = item.name
      wx.navigateTo({
        url: '../../xpages/storedetails/storedetails?imgarr=' + imgarr + '&title=' + title,
      })
    } else if (type == "8") {
      //全案设计楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj && listObj.list ? listObj.list : []
      var item = list[position]

      var id = item.id
      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "155")
      wx.navigateTo({
        url: '/xpages/allhouse_detail/allhouse_detail?id=' + id + '&newsClassId=' + newclassid,
      })
    } else if (type == "9") {
      //装修流程图楼层
      var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
      var list = listObj && listObj ? listObj : []
      var item = list[position]

      var xcxpage = item.xcxpage
      var id = item.contentId
      var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var pagetitle = item.name
      var url = item.url
      var modelName = item.modelName
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      if (xcxpage) {
        if (modelName == 'mallItemSkuVO') {
          let xcxpageurl = xcxpage.split('?')
          wx.navigateTo({
            url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
            //categoryId只限产品部分，筛选时候用得倒，可能是cid
          })
        } else {
          wx.navigateTo({
            url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
          })
        }
      } else if (url) {
        wx.navigateTo({
          url: '/xpages/h5page/h5page?url=' + url,
        })
      }
    } else if (type == "10") {
      //用户口碑楼层,无详情
    }
  }


  processBannerEvent(position,source){
    var type = source.type
    var newsClass = source.newsClass
    //这里统一判定为接口返回banner图的结构是一致的,
    //防止接口里面banner图返回的结构不一致时导致报错,可以根据type分开判断
    var list = source.bannerList ? source.bannerList : []
    var item = list[position]
    var xcxpage = item.xcxpage //跳转到页面的页面路径
    var id = item.contentId
    var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
    // var specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
    var url = item.url
    var modelName = item.modelName
    var extendData = item.extendData
    if(!extendData || !this.isJson(extendData)) {
      extendData="{}"
    }

    if (xcxpage) {
      if (modelName == 'mallItemSkuVO') {
        var xcxpageurl = xcxpage.split('?')
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      }
    } else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  }

  processFilterEvent(position,source){
    var type = source.type
    var newsClass = source.newsClass
    var listObj = source.filterList ? source.filterList : (source.filterList1 ? source.filterList1 : (source.filterList2 ? source.filterList2 : null))
    var list = listObj && listObj ? listObj : []
    var item = list[position]
    var modelName = item.modelName ? item.modelName : (newsClass ? newsClass.modelName : '')

    if (modelName == "tWebPerfectHome") {
      var name = item.searchName
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")

      var id = item.id
      if (newsclassid == '128') {
        //精装房
        var extenddata = {
          searchOption: id,
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
        })
      } else if (newsclassid == "127") {
        //毛坯房
        let extenddata = {
          searchOption: id,
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
        })
      } else if (newsclassid == "129") {
        //精选组合
        var extendData = {
          searchOption: id,
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/selected/selected?id=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData) + '&chioceid=' + id
        })
      }
    } else if (modelName == "tWebCustomFurn") {
      //定制
      var name = item.searchName
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var id = item.id
      wx.navigateTo({
        url: '/pages/customized_home/customized_home?id=' + id + '&newsClassId=' +
          newsclassid
      })
    } else if (modelName == "mallItemSkuVO") {
      console.log("产品", source);
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var id = item.id
      var cname = item.cname
      if(newsclassid == 223) {
        //本月爆款筛选条件被点击
        if(item.parentCid == 0) {
          item.pid = id
        } else {
          item.pid = item.parentCid
          item.parentCid = 0
        }

        var catItem = item
        var catItemStr = "{}"
        if(catItem) {
          catItemStr = encodeURIComponent(JSON.stringify(catItem))
        }

        wx.navigateTo({
          url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + '&cname=' + cname + '&catItem=' + catItemStr,
        })
      } else {
        wx.navigateTo({
          url: '/xpages/classification/classification?id=' + id + "&cname=" + cname + '&ScreeningFloors=' + 0,
        })
      }
    } else if (modelName == "tWebDesignerDecorator") {
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var modelname = item.modelName
      var xcxpage = item.xcxpage
      var id = item.contentId
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      wx.navigateTo({
        url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
      })
    } else {
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var modelname = item.modelName
      var xcxpage = item.xcxpage
      var id = item.contentId
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      wx.navigateTo({
        url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
      })
    }
  }

  processSubtitleEvent (position, source) {
    var type = source.type
    var newsClass = source.newsClass

    var list = source.subTitleList ? source.subTitleList : []
    var item = list[position]

    var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
    var modelName = item.modelName
    var xcxpage = item.xcxpage
    var id = item.contentId
    var hometitle = item.name
    var url = item.url
    var extendData = item.extendData
    if(!extendData || !this.isJson(extendData)) {
      extendData="{}"
    }

    if (xcxpage) {
      if (modelName == 'mallItemSkuVO') {
        let xcxpageurl = xcxpage.split('?')
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + newsclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newsclassid + "&extendData=" + extendData
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      }
    } else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  }

  processBuildEvent (position, source) {
    var type = source.type
    var newsClass = source.newsClass

    var list = source.buildList ? source.buildList : []
    var item = list[position]

    var id = item.id
    var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")

    var id = item.id
    var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
    var name = item.searchName
    var extendData = {
      searchOption: id,
      designerId: ""
    }
    wx.navigateTo({
      url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData)
    })
  }

  processMoreEvent (position, source, eventType) {
    var type = source.type
    console.log(eventType)
    var newsClass = source.newsClass
    var newsclassid = newsClass && newsClass.id ? `${newsClass.id}` : ""
    var modelName = newsClass ? newsClass.modelName : ''
    var name = source ? source.name : ''

    if (modelName == "tWebPerfectHome") {
      if (newsclassid == '128') {
        //精装房
        var extenddata = {
          searchOption: "",
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
        })
      } else if (newsclassid == "127") {
        //毛坯房
        let extenddata = {
          searchOption: "",
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/roughhouse/roughhouse?newsClassId=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extenddata) + '&index=' + 1
        })
      } else if (newsclassid == "129") {
        //精选组合
        var extendData = {
          searchOption: "",
          designerId: ""
        }
        wx.navigateTo({
          url: '/xpages/selected/selected?id=' + newsclassid + '&toptext=' + name + '&extendData=' + JSON.stringify(extendData) + '&chioceid='
        })
      }
    } else if (modelName == "tWebCustomFurn") {
      wx.navigateTo({
        url: '/pages/customized_home/customized_home?id=&newsClassId=' +
          newsclassid
      })
    } else if (modelName == "mallItemSkuVO") {
      console.log("mallItemSkuVO", newsclassid)
      var cid = ""
      if (newsclassid == 224) {
        //一线主材
        cid = "1"
      } else if (newsclassid == 184) {
        //国际软装
        cid = "2"
      } else if (newsclassid == 227) {
        //成品家具
        cid = "3"
      } else if (newsclassid == 228) {
        //家用电器
        cid = "4"
      } else if (newsclassid == 223) {
        //本月爆款
        wx.navigateTo({
          // 首页更多跳转到店长推荐
          url: '/pages/tab-classification/tab-classification?isRecommended=' + true,
        })
      } else if (newsclassid == 155) {
        //样品特卖
        wx.navigateTo({
          url: '/xpages/activitypage/activitypage?newsClassId=' + newsclassid + '&NeworderType=3&objectId=&categoryId=3',
        })
      }
      if (cid) {

        if (eventType == 'moreRight') {
          wx.navigateTo({
            // 首页更多跳转到对应的类别
            url: '/pages/tab-classification/tab-classification?cid=' + cid,
          })
        } else {
          wx.navigateTo({
            url: '/xpages/classification/classification?id=' + cid + '&cname=' + name + '&ScreeningFloors=' + 0,
          })
        }

      }
    } else if (modelName == "tWebPhysicalStore") {
      wx.navigateTo({
        url: '/xpages/phystroes/phystroes?newsClassId=' + newsclassid,
      })
    } else if (modelName == "tWebContribute") {
      wx.navigateTo({
        url: '/xpages/wordofmouth/wordofmouth?newsClassId=' + newsclassid,
      })
    } else if (modelName == "tWebDesignerDecorator") {
      var relationId = newsClass ? newsClass.relationId : ""
      wx.navigateTo({
        url: '/xpages/allhouse/allhouse?id=' + newsclassid + '&relationid=' + relationId + '&toptext=' + name
      })
    }
   
    else {
      var newsclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
      var modelname = item.modelName
      var xcxpage = item.xcxpage
      var id = item.contentId
      var extendData = item.extendData
      if(!extendData || !this.isJson(extendData)) {
        extendData="{}"
      }

      wx.navigateTo({
        url: xcxpage + '?newsClassId=' + newsclassid + '&objectId=' + id + "&extendData=" + extendData,
      })
    }
  }

  processMoreVrEvent (position, source) {
    wx.navigateTo({
      url: '/xpages/storevr/storevr',
    })
  }

   // 跳转到活动列表页
   processActivityMore(position ){
    wx.navigateTo({
      url: '/xpages/activitypage/activitypage?NeworderType='+position,
      // options = {newsClassId: "155", NeworderType: "3", objectId: "undefined", categoryId: "3"}
    })
   }

   //跳转到广告图列表页
   processAdvlist(source){
    wx.navigateTo({
      url: '/xpages/adv_list/adv_list?source='+encodeURIComponent(JSON.stringify(source)),
      // options = {newsClassId: "155", NeworderType: "3", objectId: "undefined", categoryId: "3"}
    })
   }

  processVrEvent (position, source) {
    var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
    var list = listObj ? listObj.list : []
    var item = list[position]
    var roam = item.roam
    wx.navigateTo({
      url: '/xpages/h5page/h5page?url=' + roam,
    })
  }

  processTopBannerEvent (position, source) {
    var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
    var list = listObj ? listObj : []
    var item = list[position]

    var indexType = item.indexType
    var modelName = item.modelName
    var xcxpage = item.xcxpage
    var contentId = item.contentId
    var newsClassId = item.indexType
    var name = item.name
    var url = item.url
    var extendData = item.extendData
    if(!extendData || !this.isJson(extendData)) {
      extendData="{}"
    }

    if (xcxpage) {
      if (modelName == 'mallItemSkuVO') {
        let xcxpageurl = xcxpage.split('?')
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + newsClassId + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + contentId + '&categoryId=' + newsClassId + "&extendData=" + extendData 
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newsClassId + '&objectId=' + contentId + "&extendData=" + extendData,
        })
      }
    } else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  }

  processTopMenuEvent (position, source) {
    var listObj = source.adImageList ? source.adImageList : (source.adImageList1 ? source.adImageList1 : null)
    var list = listObj ? listObj : []
    var item = list[position]

    let imgarr = item.imageVoList
    let ids = item.id
    let relationid = item.relationId
    let toptext = item.name
    let url = item.url
    let xcxModelName = item.xcxModelName //小程序模型，根据模型跳转
    if (ids == 144) {
      //无忧售后
      wx.navigateTo({
        url: '../../xpages/aftersale/aftersale?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (xcxModelName == 'stmd') {
      //实体门店
      wx.navigateTo({
        url: '../../xpages/phystroes/phystroes?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (ids == 146) {
      //生活细节
      wx.navigateTo({
        url: '../../xpages/fitforlife/fitforlife?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (ids == 147) {
      //装修效果图
      wx.navigateTo({
        url: '../../xpages/designsketch/designsketch?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (ids == 148) {
      //最新活动
      wx.navigateTo({
        url: '../../xpages/newactivity/newactivity?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (xcxModelName == 'yhkb') {
      //用户口碑
      wx.navigateTo({
        url: '../../xpages/wordofmouth/wordofmouth?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (xcxModelName == "mp") {
      //毛坯房
      wx.redirectTo({
        url: '../../xpages/roughhouse/roughhouse?newsClassId=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (xcxModelName == "wztw") {
      //生活场景
      wx.navigateTo({
        url: '../../xpages/newactivity/newactivity?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
      // wx.navigateTo({
      //   url: '../../xpages/homeencyclopedia/homeencyclopedia?id='+ids+'&relationid='+relationid,
      // })
    } else if (xcxModelName == 'jzf') {
      // 精装房
      wx.navigateTo({
        url: '../../xpages/roughhouse/roughhouse?newsClassId=' + ids,
      })
    } else if (ids == 129) {
      //全屋精选
      wx.navigateTo({
        url: '../../xpages/selected/selected?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    } else if (xcxModelName == 'qasj') {
      //全案设计
      wx.navigateTo({
        url: '../../xpages/allhouse/allhouse?id=' + ids + '&relationid=' + relationid + '&toptext=' + toptext,
      })
    }
    //家居百科
    else if (ids == 150) {
      wx.navigateTo({
        url: '../../xpages/newactivity/newactivity?id=' + ids + '&toptext=' + toptext,
      })
      //视频专栏
    } else if (ids == 151) {
      wx.navigateTo({
        url: '../../xpages/videocolumn/videocolumn?id=' + ids + '&toptext=' + toptext,
      })
    }
    //成品家具
    else if (ids == 227) {
      var id = 3
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + id + "&cname=" + toptext + '&ScreeningFloors=' + 0,
      })
    }
    //今日头条
    else if (ids == 154) {
      wx.navigateTo({
        url: '../../xpages/todaysheadlines/todaysheadlines?id=' + ids + '&toptext=' + toptext,
      })
    }
    //预算报价
    else if (ids == 203) {
      wx.navigateTo({
        url: '../../xpages/budgetquotation/budgetquotation?id=' + ids + '&toptext=' + toptext + '&imgarr=' + JSON.stringify(imgarr)
      })
    }

    //一线主材
    else if (ids == 224) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 1 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //一线主材
    else if (ids == 383) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 1 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //国际软装
    else if (ids == 184) {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + 2 + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //本月爆款
    else if (xcxModelName == 'bybk') {
      let index = source.adImageList.findIndex(obj => obj.xcxModelName == 'bybk')
      let name = source.adImageList[index].name
      var id = 0 //类目id   首页为0adImageList
      var cname = name //名字
      wx.navigateTo({
        url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + "&cname=" + cname
      })
    } else if (ids == 226) {
      wx.navigateTo({
        url: '/pages/customized_home/customized_home?ids=226',
      })
    }

    //家用电器
    else if (ids == 228) {
      let id = 4
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + id + '&cname=' + toptext + '&ScreeningFloors=' + 0,
      })
    }

    //定制家装
    else if (ids == 226) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  }

  onVideoInit (event) {
    var that = this
    var items = event.detail.items
    var listHeight = event.detail.listHeight
    that.setData({
      videoItems: items,
      videoListHeight: listHeight
    })
  }

  processAdvbrandList(position, source){
    console.log(position,source)
    var item = source[position]
    var newsClass = source.newsClass
    console.log(item)
    var xcxpage = item.xcxpage //跳转到页面的页面路径
    var id = item.contentId
    var newclassid = item.indexType ? item.indexType : (newsClass && newsClass.id ? `${newsClass.id}` : "")
    // var specialtypes = e.currentTarget.dataset.specialtypes //specialtypes为2时是当期活动，1为限时抢购 3为样品特卖
    var url = item.url
    var modelName = item.modelName
    var extendData = item.extendData
    if(!extendData || !this.isJson(extendData)) {
      extendData="{}"
    }
    if(modelName == 'xcx' && xcxpage){
      wx.navigateToMiniProgram({
        appId: id,
        path: xcxpage,
        extraData: {},//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。
        envVersion: 'release',
        success(res) {
          app.log('打开其他小程序的回调',res)
        }
      })
    }
    else if (xcxpage) {
      if (modelName == 'mallItemSkuVO') {
        var xcxpageurl = xcxpage.split('?')
        wx.navigateTo({
          url: xcxpageurl[0] + '?newsClassId=' + newclassid + '&NeworderType=' + xcxpageurl[1] + '&objectId=' + id + '&categoryId=' + newclassid + "&extendData=" + extendData
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
      } else {
        wx.navigateTo({
          url: xcxpage + '?newsClassId=' + newclassid + '&objectId=' + id + "&extendData=" + extendData,
        })
      }
    } else if (url) {
      wx.navigateTo({
        url: '../../xpages/h5page/h5page?url=' + url,
      })
    }
  }
}
// const allAction = new allAction()
module.exports = allAction
// export {allAction};