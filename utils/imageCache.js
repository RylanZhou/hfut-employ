const getImageCache = (key, url) =>
  wx.downloadFile({
    url,
    success: function(res) {
      if (res.statusCode === 200) {
        //console.log(key + '图片下载成功')
        const fs = wx.getFileSystemManager()
        fs.saveFile({
          tempFilePath: res.tempFilePath,
          success(res) {
            //console.log(key + '图片缓存成功')
            wx.setStorageSync(key, res.savedFilePath)
          }
        })
      }
    }
  })

module.exports = { getImageCache }
