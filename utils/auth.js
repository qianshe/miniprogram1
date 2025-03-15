/**
 * 认证工具类
 */
const AUTH_KEY = 'user_token';
const REFRESH_KEY = 'refresh_token';
const EXPIRES_KEY = 'token_expires';

module.exports = {
  /**
   * 检查用户是否已登录
   */
  checkAuth() {
    const token = this.getToken();
    if (!token) return false;
    
    // 检查token是否过期
    const expires = wx.getStorageSync(EXPIRES_KEY);
    if (expires && Date.now() > expires) {
      this.clearToken();
      return false;
    }
    return true;
  },

  /**
   * 获取用户Token
   */
  getToken() {
    return wx.getStorageSync(AUTH_KEY);
  },

  /**
   * 保存用户Token
   */
  setToken(token, refreshToken, expiresIn = 7200) {
    wx.setStorageSync(AUTH_KEY, token);
    wx.setStorageSync(REFRESH_KEY, refreshToken);
    wx.setStorageSync(EXPIRES_KEY, Date.now() + expiresIn * 1000);
  },

  /**
   * 清除用户Token
   */
  clearToken() {
    wx.removeStorageSync(AUTH_KEY);
    wx.removeStorageSync(REFRESH_KEY);
    wx.removeStorageSync(EXPIRES_KEY);
  },

  /**
   * 刷新Token
   */
  async refreshToken() {
    const refreshToken = wx.getStorageSync(REFRESH_KEY);
    if (!refreshToken) {
      this.clearToken();
      return null;
    }

    try {
      const res = await wx.request({
        url: '/api/auth/refresh',
        method: 'POST',
        data: {
          refresh_token: refreshToken
        }
      });

      if (res.data && res.data.token) {
        this.setToken(res.data.token, res.data.refresh_token, res.data.expires_in);
        return res.data.token;
      }
      return null;
    } catch (err) {
      console.error('刷新Token失败:', err);
      this.clearToken();
      return null;
    }
  },

  /**
   * 提示用户登录
   */
  loginWithPrompt() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
};
