const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

Page({
  data: {
    phone: '',
    password: '',
    loading: false,
    systemType: 'white', // 默认为白事系统
    themeColor: '#333333', // 默认主题色
  },

  onLoad() {
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

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录
  async login() {
    const { phone, password } = this.data;
    
    // 表单验证
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ loading: true });
    
    try {
      // 调用登录接口
      const res = await request.post('/api/user/login', {
        phone,
        password
      }, { needAuth: false });
      
      if (res.code === 200 && res.data) {
        // 保存token
        auth.setToken(res.data.token);
        
        // 保存用户信息
        const userInfo = res.data.userInfo || {};
        wx.setStorageSync('userInfo', userInfo);
        
        // 更新全局用户信息
        const app = getApp();
        app.globalData.userInfo = userInfo;
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 返回上一页或首页
        setTimeout(() => {
          wx.navigateBack({
            fail: () => {
              wx.switchTab({
                url: '/pages/index_home/index_home'
              });
            }
          });
        }, 1500);
      } else {
        wx.showToast({
          title: res.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('登录失败:', err);
      wx.showToast({
        title: '登录失败，请稍后重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 微信一键登录
  wxLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: async (res) => {
        const userInfo = res.userInfo;
        
        this.setData({ loading: true });
        
        try {
          // 调用微信登录接口
          const loginRes = await request.post('/api/user/wx-login', {
            userInfo
          }, { needAuth: false });
          
          if (loginRes.code === 200 && loginRes.data) {
            // 保存token
            auth.setToken(loginRes.data.token);
            
            // 保存用户信息
            wx.setStorageSync('userInfo', userInfo);
            
            // 更新全局用户信息
            const app = getApp();
            app.globalData.userInfo = userInfo;
            
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            
            // 返回上一页或首页
            setTimeout(() => {
              wx.navigateBack({
                fail: () => {
                  wx.switchTab({
                    url: '/pages/index_home/index_home'
                  });
                }
              });
            }, 1500);
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
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 返回
  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/index_home/index_home'
        });
      }
    });
  }
}); 