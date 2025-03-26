const { api } = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    orderInfo: null,
    loading: true,
    errorMessage: '',
    isLoggedIn: false,
    userId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取订单号参数
    if (options.orderNo) {
      this.setData({
        orderNo: options.orderNo
      });
      
      // 检查登录状态
      this.checkLoginStatus();
      
      // 获取订单信息
      this.loadOrderInfo(options.orderNo);
    } else if (options.q) {
      // 处理二维码扫描场景
      try {
        // 解码URL
        const url = decodeURIComponent(options.q);
        // 从URL中提取订单号
        const match = url.match(/orderNo=([A-Za-z0-9]+)/);
        if (match && match[1]) {
          const orderNo = match[1];
          this.setData({ orderNo });
          
          // 检查登录状态
          this.checkLoginStatus();
          
          // 获取订单信息
          this.loadOrderInfo(orderNo);
        } else {
          this.setData({
            loading: false,
            errorMessage: '无效的二维码'
          });
        }
      } catch (error) {
        console.error('解析二维码参数失败:', error);
        this.setData({
          loading: false,
          errorMessage: '无效的二维码'
        });
      }
    } else {
      this.setData({
        loading: false,
        errorMessage: '缺少订单号参数'
      });
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const isLoggedIn = auth.checkAuth();
    
    this.setData({
      isLoggedIn,
      userId: isLoggedIn ? auth.getUserInfo().id : null
    });
  },

  /**
   * 加载订单信息
   */
  loadOrderInfo(orderNo) {
    this.setData({
      loading: true,
      errorMessage: ''
    });
    
    // 调用订单详情API
    api.getOrderDetail(orderNo)
      .then(data => {
        // 格式化金额，将分转为元
        if (data.totalAmount) {
          data.totalAmount = (data.totalAmount / 100).toFixed(2);
        }
        
        if (data.items && data.items.length > 0) {
          data.items = data.items.map(item => ({
            ...item,
            price: (item.price / 100).toFixed(2)
          }));
        }
        
        this.setData({
          orderInfo: {
            ...data,
            // 检查是否已经绑定到当前用户
            isBinded: this.data.isLoggedIn && data.userId === this.data.userId
          },
          loading: false
        });
      })
      .catch(err => {
        console.error('获取订单信息失败:', err);
        this.setData({
          loading: false,
          errorMessage: err.message || '获取订单信息失败'
        });
      });
  },

  /**
   * 登录操作
   */
  login() {
    // 调用登录授权
    auth.loginWithPrompt(() => {
      // 登录成功后，更新登录状态
      this.checkLoginStatus();
      
      // 刷新订单信息
      if (this.data.orderNo) {
        this.loadOrderInfo(this.data.orderNo);
      }
    });
  },

  /**
   * 绑定订单
   */
  bindOrder() {
    if (!this.data.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '正在绑定...'
    });
    
    // 调用绑定订单接口
    api.bindOrder(this.data.orderNo, this.data.userId)
      .then(() => {
        wx.hideLoading();
        
        wx.showToast({
          title: '绑定成功',
          icon: 'success'
        });
        
        // 刷新订单状态
        this.setData({
          'orderInfo.isBinded': true,
          'orderInfo.userId': this.data.userId
        });
      })
      .catch(err => {
        wx.hideLoading();
        
        wx.showToast({
          title: err.message || '绑定失败',
          icon: 'none'
        });
      });
  },

  /**
   * 查看订单详情
   */
  viewOrder() {
    wx.navigateTo({
      url: `/pages/order/detail/detail?orderNo=${this.data.orderNo}`
    });
  },

  /**
   * 重试
   */
  retry() {
    if (this.data.orderNo) {
      this.loadOrderInfo(this.data.orderNo);
    }
  }
}); 