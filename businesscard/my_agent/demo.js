import deviceUtil from '../../utils/device-utils'
// <image class="img" src="${srcdata.imgsrc}"></image>

const wxml = (srcdata) =>
  `
<view class="container">
<view class="topview">
<image class="brandLogPath" mode="aspectFit" src="${srcdata.brandLogPath}"></image>
</view>
<view class="middle">
<image class="middle" mode="aspectFit" src="${srcdata.brokerBackgroundImagePath}"></image>
</view>
<view class="bottomview">
<view class="usermessage">
<view class="usermessagebox">
<image class="hedimage" src="${srcdata.hedimg}"></image>
<view>
<text class="username">` + srcdata.name + `</text>
<text class="remask">${srcdata.remask?srcdata.remask:''}</text>
</view>
</view>
</view>

<view class="iconview">
    <view class="phoneandaddress">
    <image class="phoneicon" mode="aspectFit" src="${srcdata.phoneicon}"></image>
    <text class ="phonetext">${srcdata.phone}</text>
    </view>
    <view class="phoneandaddress">
    <image class="adressicon" mode="aspectFit" src="${srcdata.addressicon}"></image>
    <text class ="addresstext">${srcdata.address}</text>
    </view>
</view>

</view>


<view class ="weixinImageview">
    <view class="qrcview">
        <image class="qrcode" src="${srcdata.qrcode}"></image>
        <text class="tips">长按识别二维码成为木菲美家专属经纪人</text>
    </view>
    <view class="qrcview">
        <image class="qrcode" src="${srcdata.officialAccountImgCodePath}"></image>
        <text class="tips">识别二维码关注公众号动态获取收益进度</text>
    </view>
</view>

</view>
`

/* <view class="qrcview">
<image class="qrcode" src="${srcdata.qrcode}"></image>
<text class="tips">长按识别二维码成为木菲美家专属经纪人</text>
</view> */
const style = (pagesize) => {
  console.log(pagesize)
  // pagesize.sizewidth
  let pagewidth = deviceUtil.rpx2px(750)
  let pageheight = deviceUtil.rpx2px(1500)
  return {
    container: {
      width: pagewidth,
      height: pageheight,
      backgroundColor: '#fff',
      // backgroundColor:'pink',
    },
    topview: {
      width: pagewidth,
      height: deviceUtil.rpx2px(135),
    },
    middle: {
      width: pagewidth,
      height: deviceUtil.rpx2px(694),
    },
    bottomview: {
      width: pagewidth,
      height: deviceUtil.rpx2px(230),
    //   backgroundColor:'pink',
      flexDirection: 'row',
      alignItems: 'center'
    },
    usermessage: {
      width: deviceUtil.rpx2px(350),
      height: deviceUtil.rpx2px(200),
    //   backgroundColor: '#00ff00',
    },
    usermessagebox:{
      width: deviceUtil.rpx2px(350),
      height: deviceUtil.rpx2px(200),
      flexDirection: 'row',
    //   backgroundColor: '#00ff00',
    },
    hedimage: {
      width: deviceUtil.rpx2px(138),
      height: deviceUtil.rpx2px(128),
      borderRadius: deviceUtil.rpx2px(64),
      top: deviceUtil.rpx2px(39),
      left: deviceUtil.rpx2px(33)
    },
    username: {
      width: deviceUtil.rpx2px(160),
      top: deviceUtil.rpx2px(58),
      left: deviceUtil.rpx2px(67),
      height: deviceUtil.rpx2px(100),
      fontSize: deviceUtil.rpx2px(35),
      fontWeight: 'bold',
      color: '#000',
    },
    remask: {
      height: deviceUtil.rpx2px(100),
      width: deviceUtil.rpx2px(160),
      marginLeft: deviceUtil.rpx2px(67),
      marginTop: deviceUtil.rpx2px(20),
      color: '#666',
      fontSize: deviceUtil.rpx2px(23),
      lineHeight:deviceUtil.rpx2px(30)
    },
    qrcview:{
      width:deviceUtil.rpx2px(280),
      height: deviceUtil.rpx2px(360),
      justifyContent:'center',
      alignItems:'alignItems',
      marginLeft: deviceUtil.rpx2px(38),
      // backgroundColor:'pink',
      marginTop:deviceUtil.rpx2px(0),
    },
    qrcode:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(180),
      // marginTop:deviceUtil.rpx2px(-30),
    },
    tips:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(60),
      textAlign:'center',
      fontSize: deviceUtil.rpx2px(20),
      marginTop:deviceUtil.rpx2px(20),
      color:'#000',
    },
    phoneandaddress:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(50),
      fontSize: deviceUtil.rpx2px(23),
      marginTop:deviceUtil.rpx2px(27),
      color:'#000',
      marginLeft:deviceUtil.rpx2px(30),
      marginTop:deviceUtil.rpx2px(10),
      flexDirection: 'row',
    },
    phoneicon:{
      width:deviceUtil.rpx2px(30),
      height: deviceUtil.rpx2px(30),
    },
    adressicon:{
      width:deviceUtil.rpx2px(40),
      height: deviceUtil.rpx2px(40),
    },
    phonetext:{
      width:deviceUtil.rpx2px(260),
      height: deviceUtil.rpx2px(50),
      marginLeft:deviceUtil.rpx2px(30)
    },
    addresstext:{
      width:deviceUtil.rpx2px(280),
      height: deviceUtil.rpx2px(80),
      marginLeft:deviceUtil.rpx2px(10),
      lineHeight:deviceUtil.rpx2px(30),
    //   backgroundColor: '#00ff00',
    },
    brandLogPath:{
      width:deviceUtil.rpx2px(239),
      height: deviceUtil.rpx2px(98),
      top:deviceUtil.rpx2px(22),
      left:deviceUtil.rpx2px(42)
    },
    iconview:{
        top:deviceUtil.rpx2px(10),
    },
    weixinImageview:{
        width: pagewidth,
        height: deviceUtil.rpx2px(390),
        backgroundColor:'#f8f8f8',
        flexDirection: 'row',
        alignItems:'alignItems',
        zIndex:'9999',
        paddingBottom:deviceUtil.rpx2px(65)

    }
  }
}



module.exports.wxml = wxml
module.exports.style = style