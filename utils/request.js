const apiConfig = require('../config/api.config.js');

const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options;
    
    wx.request({
      url: `${apiConfig.baseUrl}${url}`,
      method,
      data,
      header: { ...apiConfig.header, ...header },
      timeout: apiConfig.timeout,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
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
  get: (url, data) => request({ url, data }),
  post: (url, data) => request({ url, data, method: 'POST' }),
  put: (url, data) => request({ url, data, method: 'PUT' }),
  delete: (url, data) => request({ url, data, method: 'DELETE' })
};
