export const errorHandler = {
  handleError(error, page) {
    console.error(error);
    
    // 网络错误处理
    if (error.errMsg && error.errMsg.includes('request:fail')) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      });
      return;
    }

    // 权限错误处理
    if (error.code === 403) {
      wx.showToast({
        title: '没有权限',
        icon: 'none'
      });
      return;
    }

    // 其他错误统一提示
    wx.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    });
  },

  showLoading(page) {
    page.setData({ loading: true });
  },

  hideLoading(page) {
    page.setData({ loading: false });
  }
};
