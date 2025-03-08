/**
 * 认证工具类
 */
const AUTH_KEY = 'user_token';

module.exports = {
  /**
   * 检查用户是否已登录
   */
  checkAuth() {
    return !!wx.getStorageSync(AUTH_KEY);
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
  setToken(token) {
    wx.setStorageSync(AUTH_KEY, token);
  },

  /**
   * 清除用户Token
   */
  clearToken() {
    wx.removeStorageSync(AUTH_KEY);
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
