// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      code: ''
    },
    hasUserInfo: false,
    isAdmin: false,
    systemType: 'white', // 默认为白事系统
    themeColor: '#333333', // 默认主题色
  },
  onLoad() {
    this.checkLoginStatus();
    this.checkUserRole();

    // 获取当前系统类型
    const app = getApp();
    const systemType = app.globalData.systemType || 'white';

    // 根据系统类型设置主题色
    const themeColor = systemType === 'red' ? '#d32f2f' : '#333333';

    this.setData({
      systemType,
      themeColor
    });
  },

  onShow() {
    // 获取当前系统类型并更新 tabBar
    const app = getApp();
    const systemType = app.globalData.systemType || 'white';

    // 根据系统类型设置主题色
    const themeColor = systemType === 'red' ? '#d32f2f' : '#333333';

    this.setData({
      systemType,
      themeColor
    });

    // 使用延迟更新 TabBar
    setTimeout(() => {
      if (typeof this.getTabBar === 'function') {
        const tabBar = this.getTabBar();
        if (tabBar && typeof tabBar.updateTabList === 'function') {
          tabBar.updateTabList(systemType);
        }
      }
    }, 100);

    // 检查登录状态
    this.checkLoginStatus();
  },

  toShoppingCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    });
  },

  toOrders() {
    wx.navigateTo({
      url: '/pages/order/list/list'
    });
  },

  toFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  toCreateOrder() {
    wx.navigateTo({
      url: '/pages/order/create/create'
    });
  },

  toIndexHome() {
    wx.switchTab({
      url: '/pages/index_home/index_home'
    });
  },

  async login() {
    try {
      // 获取用户信息
      const { userInfo } = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: resolve,
          fail: reject
        });
      });

      // 获取微信登录code
      const { code } = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      // 调用后端登录接口
      const loginRes = await request.post('/api/auth/wx/login', {
        userInfo,
        code
      }, { needAuth: false });

      if (loginRes.code === 200 && loginRes.data) {
        // 保存token和用户信息
        auth.setToken(loginRes.data.token, loginRes.data.refresh_token);
        wx.setStorageSync('userInfo', userInfo);

        // 更新页面状态
        this.setData({
          userInfo,
          hasUserInfo: true
        });

        // 更新全局用户信息
        const app = getApp();
        app.globalData.userInfo = userInfo;

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      } else {
        throw new Error(loginRes.message || '登录失败');
      }
    } catch (err) {
      console.error('登录失败:', err);
      wx.showToast({
        title: err.message || '登录失败，请稍后重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }

  },

  // 检查登录状态
  checkLoginStatus() {
    // 检查token是否存在
    if (auth.checkAuth()) {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo,
          hasUserInfo: true
        });
        return true;
      }
    }

    // 如果token不存在或用户信息不存在，则清除登录状态
    this.setData({
      hasUserInfo: false,
      userInfo: {
        avatarUrl: defaultAvatarUrl,
        nickName: '',
      }
    });
    return false;
  },

  // 检查用户角色
  checkUserRole() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.role === 'admin') {
      this.setData({
        isAdmin: true
      });
    }
  }
})
