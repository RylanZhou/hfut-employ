let getImageCache = (key, url) => {
  return new Promise((resolve, reject) => {
    const path = wx.getStorageSync(key)
    if (path) {
      resolve(path)
    } else {
      wx.downloadFile({
        url: url,
        success: function (res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager();
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              success(res) {
                wx.setStorageSync(key, res.savedFilePath)
                resolve(res.savedFilePath)
              },
              fail(res) {
                console.log(res);
                wx.showToast({
                  title: "文件缓存空间已满,请转到 我的-设置 页面清理图片缓存", //弹出窗口
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            reject(res.statusCode)
          }
        }
      })
    }
  })
}

module.exports = {
  getImageCache
}