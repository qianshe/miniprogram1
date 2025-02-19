// app.js
App({

  globalData: {
    systemType: null, // 新增系统类型标识
    userInfo: null

  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
})
