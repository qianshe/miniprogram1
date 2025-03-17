const apiConfig = require('../config/api.config.js');
const auth = require('./auth.js');

const request = async (options = {}, retryCount = 0) => {
  const { url, method = 'GET', data = {}, header = {}, needAuth = true } = options;
  
  const requestUrl = `${apiConfig.baseUrl}${url}`;
  
  // 构建请求头
  const requestHeader = { ...apiConfig.header, ...header };
  
  // 如果需要鉴权且有token，则添加到请求头
  if (needAuth && auth.checkAuth()) {
    requestHeader['Authorization'] = `Bearer ${auth.getToken()}`;
  }

  try {
    // 将wx.request包装为Promise并等待结果
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: requestUrl,
        method,
        data,
        header: requestHeader,
        timeout: apiConfig.timeout,
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });

    // 处理HTTP状态码错误
    if (response.statusCode !== 200) {
      console.error('HTTP状态码错误:', {
        url: requestUrl,
        statusCode: response.statusCode,
        data: response.data
      });
      const error = new Error('HTTP请求失败');
      error.statusCode = response.statusCode;
      error.response = response.data;
      throw error;
    }

    // 获取业务响应数据
    const responseData = response.data;
    console.log('解析后的业务数据:', responseData);

    // 特殊处理401认证失败的业务状态码
    if (responseData.code === 401) {
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

    // 处理业务状态码
    if (responseData.code !== 200) {
      console.error('业务错误:', {
        url: requestUrl,
        code: responseData.code,
        message: responseData.message,
        data: responseData.data
      });
      const error = new Error(responseData.message || '请求失败');
      error.code = responseData.code;
      error.data = responseData.data;
      throw error;
    }

    // 返回完整的响应数据结构
    return responseData;

  } catch (err) {
    // 处理网络错误
    if (err.errMsg && err.errMsg.includes('request:fail')) {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 2000
      });
      const error = new Error('网络请求失败');
      error.type = 'network';
      throw error;
    }
    
    // 如果是业务错误，直接抛出
    if (err.statusCode) {
      throw err;
    }

    // 其他未知错误
    console.error('请求错误:', err);
    const error = new Error(err.message || '未知错误');
    error.type = 'unknown';
    throw error;
  }
};

module.exports = {
  get: (url, data, options = {}) => request({ url, data, ...options }),
  post: (url, data, options = {}) => request({ url, data, method: 'POST', ...options }),
  put: (url, data, options = {}) => request({ url, data, method: 'PUT', ...options }),
  delete: (url, data, options = {}) => request({ url, data, method: 'DELETE', ...options })
};
