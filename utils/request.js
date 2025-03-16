const apiConfig = require('../config/api.config.js');
const auth = require('./auth.js');

const request = async (options = {}, retryCount = 0) => {
  const { url, method = 'GET', data = {}, header = {}, needAuth = true } = options;
  
  // 构建请求头
  const requestHeader = { ...apiConfig.header, ...header };
  
  // 如果需要鉴权且有token，则添加到请求头
  if (needAuth && auth.checkAuth()) {
    requestHeader['Authorization'] = `Bearer ${auth.getToken()}`;
  }
  
  try {
    const res = await wx.request({
      url: `${apiConfig.baseUrl}${url}`,
      method,
      data,
      header: requestHeader,
      timeout: apiConfig.timeout
    });

    // 处理401未授权错误
    if (res.statusCode === 401) {
      // 如果是第一次尝试，先尝试刷新token
      if (retryCount === 0) {
        const newToken = await auth.refreshToken();
        if (newToken) {
          // 使用新token重试请求
          return request(options, retryCount + 1);
        }
      }
      
      // 刷新token失败或已经是重试，清除token并提示登录
      auth.clearToken();
      auth.loginWithPrompt();
      throw new Error('未授权，请重新登录');
    }

    // 处理其他错误状态码
    if (res.statusCode !== 200) {
      wx.showToast({
        title: res.data.message || '请求失败',
        icon: 'none'
      });
      throw new Error(res.data.message || '请求失败');
    }

    return res.data;
  } catch (err) {
    // 处理网络错误
    if (err.errMsg && err.errMsg.includes('request:fail')) {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    }
    throw err;
  }
};

module.exports = {
  get: (url, data, options = {}) => request({ url, data, ...options }),
  post: (url, data, options = {}) => request({ url, data, method: 'POST', ...options }),
  put: (url, data, options = {}) => request({ url, data, method: 'PUT', ...options }),
  delete: (url, data, options = {}) => request({ url, data, method: 'DELETE', ...options })
};
