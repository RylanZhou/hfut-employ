export const get = (url, data = {}) =>
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: (response) => {
        if (response.data.error) {
          reject(response.data.error)
        }
        resolve(response.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })

export const post = (url, data) =>
  new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      success: (response) => {
        if (response.data.error) {
          reject(response.data.error)
        }
        resolve(response.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
