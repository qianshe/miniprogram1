const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 输入用户名
   */
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  /**
   * 输入密码
   */
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 登录
   */
  login() {
    const { username, password } = this.data
    
    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    this.setData({
      isLoading: true
    })

    // 模拟登录请求
    setTimeout(() => {
      this.setData({
        isLoading: false
      })

      // 为了演示，这里使用简单的用户名/密码：admin/admin
      if (username === 'admin' && password === 'admin') {
        // 登录成功，保存登录状态
        // app.setAdminInfo({
        //   username: 'admin',
        //   role: '超级管理员'
        // })
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        // 跳转到管理员首页
        wx.reLaunch({
          url: '/pages/admin/index/index'
        })
      } else {
        // 登录失败
        wx.showToast({
          title: '用户名或密码错误',
          icon: 'none'
        })
      }
    }, 1000)
  }
}) 