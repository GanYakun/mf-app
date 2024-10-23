import deviceUtil from '../../utils/device-utils'

const wxml = (srcdata) =>
  `
<view class="container">
<image class="shopImage" src="${srcdata.shopImg}"></image>
<image class="xsBg" src="${srcdata.xsBg}"></image>
<view class="priceAndTime">
<text class="symbol">¥</text>
<text class="price">${srcdata.price}</text>
<view class="timeBox">
<text class="endTime">距离结束还有：</text>
<text class="time">${srcdata.time}</text>
</view>
</view>
<text class="productName">${srcdata.productName}</text>
<view class="border"></view>
<view class="qrCode">
<image class="qrCodeImg" src="${srcdata.qrcode}"></image>
<view class="qrIntro">
<text class="qrIntroText">${srcdata.qrIntro}</text>
</view>
</view>
</view>
`
{/* <image class="shopImage" src="${srcdata.shopImg}"></image> */}
const style = () => {
  let pagewidth = deviceUtil.rpx2px(750)
  let pageheight = deviceUtil.rpx2px(1100)
  console.log(pagewidth)
  return {
    container: {
      width: pagewidth,
      height: pageheight,
      backgroundColor: '#fff',
    },
    shopImage:{
      width: pagewidth,
      height: deviceUtil.rpx2px(562)
    },
    xsBg:{
      width:pagewidth,
      height:deviceUtil.rpx2px(90)
    },
    priceAndTime:{
      width:deviceUtil.rpx2px(300),
      height:deviceUtil.rpx2px(90),
      color:'#ffffff',
      marginTop:deviceUtil.rpx2px(-45),
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingLeft:deviceUtil.rpx2px(30),
      paddingRight:deviceUtil.rpx2px(30)
    },
    timeBox:{
      width:deviceUtil.rpx2px(300),
      height:deviceUtil.rpx2px(90),
      textAlign:'center',
      fontSize:deviceUtil.rpx2px(22),
      color:'#ff6c00'
    },
    symbol:{
      width:deviceUtil.rpx2px(20),
      height:deviceUtil.rpx2px(90),
      color:'#ffffff',
      marginTop:deviceUtil.rpx2px(-20),
      fontSize:deviceUtil.rpx2px(24)
    },
    price:{
      width:deviceUtil.rpx2px(430),
      height:deviceUtil.rpx2px(90),
      color:'#ffffff',
      marginTop:deviceUtil.rpx2px(-45),
      fontSize:deviceUtil.rpx2px(36)
    },
    endTime:{
      width:deviceUtil.rpx2px(300),
      height:deviceUtil.rpx2px(40),
      marginTop:deviceUtil.rpx2px(-30),
    },time:{
      width:deviceUtil.rpx2px(300),
      height:deviceUtil.rpx2px(40),
      marginTop:deviceUtil.rpx2px(-10),
    },
    productName:{
      width:pagewidth,
      height:deviceUtil.rpx2px(50),
      color:'#333333',
      marginTop:deviceUtil.rpx2px(-35),
      marginLeft:deviceUtil.rpx2px(30),
    },
    border:{
      width:(pagewidth - deviceUtil.rpx2px(40)),
      height:deviceUtil.rpx2px(4),
      marginLeft:deviceUtil.rpx2px(20),
      backgroundColor:'#dddddd',
      marginTop:deviceUtil.rpx2px(10),
    },
    qrCode:{
      width:pagewidth - deviceUtil.rpx2px(60),
      height:pagewidth  - deviceUtil.rpx2px(60),
      marginTop:deviceUtil.rpx2px(20),
      marginLeft:deviceUtil.rpx2px(30),
      marginLeft:deviceUtil.rpx2px(30),
      flexDirection:'row',
      justifyContent:'space-between',
      
    },
    qrCodeImg:{
      width:(pagewidth/2) - deviceUtil.rpx2px(40),
      height:(pagewidth/2) - deviceUtil.rpx2px(40),
    },
    qrIntro:{
      width:(pagewidth/2) - deviceUtil.rpx2px(40),
      height:(pagewidth/2) - deviceUtil.rpx2px(40),

    },
    qrIntroText:{
      width:(pagewidth/2) - deviceUtil.rpx2px(40),
      height:(pagewidth/2) - deviceUtil.rpx2px(40),
      verticalAlign:'middle',

    }
  }
}



module.exports.wxml = wxml
module.exports.style = style