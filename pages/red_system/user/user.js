Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    hasUserInfo: false
  },

  onLoad() {
    // 获取缓存的用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  onShow() {
    const app = getApp()
    app.globalData.systemType = 'red'
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().updateTabList('red')
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    })
    this.updateStorage()
  },

  onInputNickName(e) {
    const nickName = e.detail.value
    this.setData({
      'userInfo.nickName': nickName,
      hasUserInfo: true
    })
    this.updateStorage()
  },

  updateStorage() {
    wx.setStorageSync('userInfo', this.data.userInfo)
  }
}) 