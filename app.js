// app.js
App({

  globalData: {
    systemType: null, // 新增系统类型标识
    userInfo: null,
    currentTabIndex: 0
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // TODO: 后续开启云开发时取消注释
    // wx.cloud.init({
    //   env: 'your-env-id',
    //   traceUser: true
    // })
  },
})
