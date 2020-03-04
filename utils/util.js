function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

/*获取当前页url*/
function getCurrentPageUrl() {
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  let options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  let urlWithArgs = url + '?'
  for (let key in options) {
    let value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

function checknull(data, tip) {
  if (data == '') {
    wx.showToast({
      title: tip, //弹出窗口
      icon: 'success',
      duration: 2000
    })
    return true
  } else return false
}

module.exports = {
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}

function imageUtil(e) {
  let imageSize = {}
  let originalWidth = e.detail.width //图片原始宽
  let originalHeight = e.detail.height //图片原始高
  let originalScale = originalHeight / originalWidth //图片高宽比
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function(res) {
      let windowWidth = res.windowWidth
      let windowHeight = res.windowHeight
      let windowscale = windowHeight / windowWidth //屏幕高宽比
      if (originalScale < windowscale) {
        //图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
        imageSize.imageWidth = windowWidth
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth
      } else {
        //图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
        imageSize.imageHeight = windowHeight
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight
      }
    }
  })
  return imageSize
}

module.exports = {
  imageUtil: imageUtil
}
