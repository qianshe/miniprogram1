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

  login() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 获取用户信息的原因
      success: (res) => {
        // 获取用户信息成功
        const userInfo = res.userInfo;
        this.setData({
          userInfo,
          hasUserInfo: true
        });

        console.log('获取用户信息成功:', userInfo);
        // 将用户信息存储到本地
        wx.setStorageSync('userInfo', userInfo);
        // 更新全局用户信息
        const app = getApp();
        app.globalData.userInfo = userInfo;

        // 调用微信登录接口
        wx.login({
          success: (res) => {
            console.log('调用 wx.login 成功:', res);
            if (res.code) {
              this.setData({
                code: res.code
              });
              console.log('获取 code 成功:', res.code);

              // 向后端发送 code
              try {
                // 调用微信登录接口
                const loginRes = request.post('/api/auth/wx/login', {
                  userInfo,
                  code: res.code
                }, { needAuth: false });

                if (loginRes.code === 200 && loginRes.data) {
                  // 保存token
                  auth.setToken(loginRes.data.token);

                  wx.showToast({
                    title: '登录成功',
                    icon: 'success'
                  });
                 
                } else {
                  wx.showToast({
                    title: loginRes.message || '登录失败',
                    icon: 'none'
                  });
                }
              } catch (err) {
                console.error('微信登录失败:', err);
                wx.showToast({
                  title: '登录失败，请稍后重试',
                  icon: 'none'
                });
              } finally {
                this.setData({ loading: false });
              }

            } else {
              console.error('获取 code 失败:', res.errMsg);
            }
          },
          fail: (err) => {
            console.error('调用 wx.login 失败:', err);
          }
        });
      }
    });

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