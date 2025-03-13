const apiConfig = require('../config/api.config.js');
const auth = require('./auth.js');

const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {}, needAuth = true } = options;
    
    // 构建请求头
    const requestHeader = { ...apiConfig.header, ...header };
    
    // 如果需要鉴权且有token，则添加到请求头
    if (needAuth && auth.checkAuth()) {
      requestHeader['Authorization'] = `Bearer ${auth.getToken()}`;
    }
    
    wx.request({
      url: `${apiConfig.baseUrl}${url}`,
      method,
      data,
      header: requestHeader,
      timeout: apiConfig.timeout,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，清除token并提示登录
          auth.clearToken();
          auth.loginWithPrompt();
          reject(res);
        } else {
          // 其他错误状态码
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

module.exports = {
  get: (url, data, options = {}) => request({ url, data, ...options }),
  post: (url, data, options = {}) => request({ url, data, method: 'POST', ...options }),
  put: (url, data, options = {}) => request({ url, data, method: 'PUT', ...options }),
  delete: (url, data, options = {}) => request({ url, data, method: 'DELETE', ...options })
}; 