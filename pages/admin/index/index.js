const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    adminInfo: {
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      name: '管理员',
      role: '超级管理员'
    },
    modules: [
      {
        id: 'order',
        name: '订单管理',
        icon: '/assets/images/icon-order.png',
        path: '/pages/admin/order/list/list'
      },
      {
        id: 'product',
        name: '产品管理',
        icon: '/assets/images/icon-product.png',
        path: '/pages/admin/product/list/list'
      },
      {
        id: 'user',
        name: '用户管理',
        icon: '/assets/images/icon-user.png',
        path: '/pages/admin/user/list/list'
      },
      {
        id: 'category',
        name: '分类管理',
        icon: '/assets/images/icon-category.png',
        path: '/pages/admin/category/list/list'
      },
      {
        id: 'stats',
        name: '数据统计',
        icon: '/assets/images/icon-stats.png',
        path: '/pages/admin/stats/index/index'
      },
      {
        id: 'setting',
        name: '系统设置',
        icon: '/assets/images/icon-setting.png',
        path: '/pages/admin/setting/index/index'
      }
    ],
    // 今日数据统计
    todayStats: {
      orders: 28,
      sales: 3680.50,
      users: 15,
      visits: 246
    },
    // 待处理事项
    pendingTasks: {
      newOrders: 12,
      outOfStock: 3,
      feedbacks: 5,
      refunds: 2
    },
    // 销售额走势（最近7天）
    salesTrend: [
      { date: '05-01', amount: 2180.50 },
      { date: '05-02', amount: 3240.00 },
      { date: '05-03', amount: 2980.50 },
      { date: '05-04', amount: 3680.50 },
      { date: '05-05', amount: 4210.00 },
      { date: '05-06', amount: 3180.50 },
      { date: '05-07', amount: 3680.50 }
    ],
    // 销售排行榜（前5名）
    topProducts: [
      { id: 101, name: '产品1', sales: 58, amount: 1740.00, thumb: 'https://img.yzcdn.cn/vant/cat.jpeg' },
      { id: 102, name: '产品2', sales: 42, amount: 1260.00, thumb: 'https://img.yzcdn.cn/vant/cat.jpeg' },
      { id: 103, name: '产品3', sales: 36, amount: 1080.00, thumb: 'https://img.yzcdn.cn/vant/cat.jpeg' },
      { id: 104, name: '产品4', sales: 29, amount: 870.00, thumb: 'https://img.yzcdn.cn/vant/cat.jpeg' },
      { id: 105, name: '产品5', sales: 24, amount: 720.00, thumb: 'https://img.yzcdn.cn/vant/cat.jpeg' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 这里应该获取管理员信息和权限
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
    // 获取最新数据
    this.loadTodayStats()
    this.loadPendingTasks()
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
    // 刷新数据
    this.loadTodayStats()
    this.loadPendingTasks()
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
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
   * 加载今日统计数据
   */
  loadTodayStats() {
    // 这里应该从API获取今日统计数据
    // 模拟API请求
    setTimeout(() => {
      this.setData({
        todayStats: {
          orders: Math.floor(Math.random() * 50) + 10,
          sales: (Math.random() * 5000 + 1000).toFixed(2),
          users: Math.floor(Math.random() * 30) + 5,
          visits: Math.floor(Math.random() * 500) + 100
        }
      })
    }, 500)
  },

  /**
   * 加载待处理事项
   */
  loadPendingTasks() {
    // 这里应该从API获取待处理事项数据
    // 模拟API请求
    setTimeout(() => {
      this.setData({
        pendingTasks: {
          newOrders: Math.floor(Math.random() * 20) + 1,
          outOfStock: Math.floor(Math.random() * 10),
          feedbacks: Math.floor(Math.random() * 10),
          refunds: Math.floor(Math.random() * 5)
        }
      })
    }, 500)
  },

  /**
   * 打开模块
   */
  openModule(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path
    })
  },

  /**
   * 查看今日订单
   */
  viewTodayOrders() {
    wx.navigateTo({
      url: '/pages/admin/order/list/list?date=today'
    })
  },

  /**
   * 查看待处理订单
   */
  viewPendingOrders() {
    wx.navigateTo({
      url: '/pages/admin/order/list/list?status=pending'
    })
  },

  /**
   * 查看缺货产品
   */
  viewOutOfStockProducts() {
    wx.navigateTo({
      url: '/pages/admin/product/list/list?stock=low'
    })
  },

  /**
   * 查看用户反馈
   */
  viewFeedbacks() {
    wx.navigateTo({
      url: '/pages/admin/feedback/list/list'
    })
  },

  /**
   * 查看退款申请
   */
  viewRefunds() {
    wx.navigateTo({
      url: '/pages/admin/refund/list/list'
    })
  },

  /**
   * 查看产品详情
   */
  viewProduct(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goods/detail/detail?id=${id}`
    })
  },

  /**
   * 退出登录
   */
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出管理员账号吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          // app.logout()
          
          // 返回登录页
          wx.reLaunch({
            url: '/pages/admin/login/login'
          })
        }
      }
    })
  }
}) 