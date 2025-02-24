// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: '/images/default-avatar.png',
      nickName: '',
    },
    hasUserInfo: false,
    isAdmin: false,
  },
  onLoad() {
    this.checkLoginStatus();
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const userInfo = this.data.userInfo || {}
    userInfo.avatarUrl = avatarUrl
    this.setData({
      userInfo
    })
    // 更新缓存
    wx.setStorageSync('userInfo', userInfo)
  },
  onInputNickname(e) {
    const { value } = e.detail
    const userInfo = this.data.userInfo || {}
    userInfo.nickName = value
    this.setData({
      userInfo
    })
    // 更新缓存
    wx.setStorageSync('userInfo', userInfo)
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // 更新缓存
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },

  toIndexHome(e) {
    // 将页面栈清空，跳转到首页
    getApp().globalData.currentTabIndex = 0
    wx.redirectTo({
      url: '/pages/index_home/index_home'
    })
  },
  // 检查用户是否为管理员
  checkUserRole() {
    // 这里需要根据你的业务逻辑判断用户身份
    // 示例：从本地存储或服务器获取用户角色
    const userRole = wx.getStorageSync('userRole');
    this.setData({
      isAdmin: userRole === 'admin'
    });
  },

  // 跳转到购物车页面
  toShoppingCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    });
  },

  // 跳转到订单列表页面
  toOrders() {
    wx.navigateTo({
      url: '/pages/order/list/list'
    });
  },

  // 跳转到反馈页面
  toFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 管理员生成订单页面
  toCreateOrder() {
    if (this.data.isAdmin) {
      wx.navigateTo({
        url: '/pages/order/create/create'
      });
    } else {
      wx.showToast({
        title: '无权限访问，调试阶段可跳转，上线时请删除',
        icon: 'none'
      });
      wx.navigateTo({
        url: '/pages/order/create/create'
      });

    }
  },

  login(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户信息后的用途
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('登录失败：', err);
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        });
      }
    });
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
      return true;
    }
    return false;
  }
})
