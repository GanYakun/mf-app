// 函数节流


//防止多次重复点击  （函数节流）
// function throttle(fn, gapTime) {
//   if (gapTime == null || gapTime == undefined) {
//     gapTime = 1000
//   }
 
//   let _lastTime = null
 
//   // 返回新的函数
//   return function (e) {
//     console.log(this)
//     let _nowTime = + new Date()
//     if (_nowTime - _lastTime > gapTime || !_lastTime) {
//       // fn.apply(this, arguments)   //将this和参数传给原函数
//       fn(this,e)    //上方法不可行的解决办法 改变this和e
//       _lastTime = _nowTime
//     }
//   }
// }
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300 ;//间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context,arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args);
    }, gapTime);
  };
}
module.exports = {
  throttle,
  debounce
}