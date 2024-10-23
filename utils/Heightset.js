class calculation{
  constructors(){
    let pageMessage = wx.getSystemInfoSync()
    let capsuleMessage = wx.getMenuButtonBoundingClientRect()
    console.log('页面的信息', pageMessage)
    console.log('胶囊按钮的信息', capsuleMessage)
    let ratio = 750 / pageMessage.windowWidth;
    let gap = capsuleMessage.top - pageMessage.statusBarHeight //胶囊按钮到状态栏的高度
    let menuHeight = capsuleMessage.height //右上角胶囊按钮的高度
    console.log(gap)
    let titleBarHeight = gap * 2 + menuHeight + 4 //标题栏高度
    let navHeight = Math.ceil((pageMessage.statusBarHeight + titleBarHeight) * ratio)
    // that.setData({
    //   navHeight: Math.ceil((pageMessage.statusBarHeight + titleBarHeight) * ratio),
    //   leftboxTop: Math.ceil(capsuleMessage.top * ratio),
    //   leftboxleft: Math.ceil((pageMessage.windowWidth - capsuleMessage.right) * ratio),
    //   leftboxHeight: Math.ceil(capsuleMessage.height * ratio),
    //   leftBoxWidth: Math.ceil(capsuleMessage.width * ratio),
    //   statusBarHeight: Math.ceil(pageMessage.statusBarHeight * ratio)
    // })
    return ({navHeight:navHeight})
  }
}
const calculationfun = new calculation()
module.exports = { calculationfun }