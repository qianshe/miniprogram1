const AUTH = {
  isLoggedIn() {
    return !!wx.getStorageSync('token');
  },

  isAdmin() {
    return wx.getStorageSync('userRole') === 'admin';
  },

  checkAuth() {
    if (!this.isLoggedIn()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  async loginWithPrompt() {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        content: '需要登录才能继续操作',
        success: (res) => {
          if (res.confirm) {
            // 执行登录流程
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
          resolve(false);
        }
      });
    });
  }
};

export default AUTH;
