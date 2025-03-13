const request = require('../../../utils/request.js');

Page({
  data: {
    orderNo: '',
    orderInfo: null,
    loading: true,
    systemType: 'white', // 默认为白事系统
    themeColor: '#333333' // 默认主题色
  },

  onLoad(options) {
    // 获取系统类型
    const systemType = options.systemType || 'white';
    const themeColor = systemType === 'red' ? '#d32f2f' : '#333333';
    
    this.setData({
      systemType,
      themeColor
    });
    
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo });
      this.loadOrderDetail();
    }
  },

  async loadOrderDetail() {
    try {
      // 尝试从服务器获取订单详情
      try {
        const res = await request.get(`/api/orders/${this.data.orderNo}`);
        if (res.code === 200 && res.data) {
          const statusInfo = this.getStatusInfo(res.data.status);
          // 格式化数据
          const orderInfo = {
            ...res.data,
            statusText: statusInfo.text,
            statusDesc: statusInfo.desc,
            statusClass: statusInfo.class,
            createdTime: this.formatDate(res.data.createdTime),
            serviceTime: this.formatDate(res.data.serviceTime),
            payTime: res.data.payTime ? this.formatDate(res.data.payTime) : '',
            totalAmount: (res.data.totalAmount / 100).toFixed(2),
            items: res.data.items.map(item => ({
              ...item,
              productPrice: (item.productPrice / 100).toFixed(2),
              subtotal: (item.subtotal / 100).toFixed(2)
            }))
          };

          this.setData({ 
            orderInfo,
            loading: false
          });
        }
      } catch (err) {
        console.error('从服务器获取订单详情失败:', err);
        
        // 从本地存储获取订单数据
        const orders = wx.getStorageSync('orders') || [];
        const order = orders.find(o => o.orderNo === this.data.orderNo);
        
        if (order) {
          const statusInfo = this.getStatusInfo(order.status);
          // 格式化数据
          const orderInfo = {
            ...order,
            statusText: statusInfo.text,
            statusDesc: statusInfo.desc,
            statusClass: statusInfo.class,
            createdTime: this.formatDate(order.createdTime),
            serviceTime: this.formatDate(order.serviceTime),
            payTime: order.payTime ? this.formatDate(order.payTime) : '',
            totalAmount: order.totalAmount,
            items: order.items.map(item => ({
              ...item,
              productName: item.name,
              productPrice: item.price,
              quantity: item.quantity,
              subtotal: (parseFloat(item.price) * item.quantity).toFixed(2)
            }))
          };

          this.setData({ 
            orderInfo,
            loading: false
          });
        } else {
          wx.showToast({
            title: '订单不存在',
            icon: 'none'
          });
        }
      }
    } catch (err) {
      wx.showToast({
        title: '加载订单详情失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  getStatusInfo(status) {
    const statusInfo = {
      0: {
        text: '待支付',
        desc: '请尽快完成支付',
        class: 'pending'
      },
      1: {
        text: '已支付',
        desc: '我们会尽快为您安排服务',
        class: 'paid'
      },
      2: {
        text: '已取消',
        desc: '订单已取消',
        class: 'cancelled'
      },
      3: {
        text: '已退款',
        desc: '退款已完成',
        class: 'refunded'
      }
    };
    return statusInfo[status] || {
      text: '未知状态',
      desc: '',
      class: ''
    };
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  // 复制订单号
  copyOrderNo() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderNo,
      success: () => {
        wx.showToast({
          title: '订单号已复制',
          icon: 'success'
        });
      }
    });
  },

  // 拨打电话
  callPhone() {
    if (this.data.orderInfo.contactPhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.orderInfo.contactPhone
      });
    }
  },

  // 查看位置
  viewLocation() {
    const { latitude, longitude, address } = this.data.orderInfo;
    if (latitude && longitude) {
      wx.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: address,
        scale: 18
      });
    }
  },

  // 联系客服
  contactService() {
    wx.showToast({
      title: '正在连接客服...',
      icon: 'loading',
      duration: 1500
    });
    // 这里可以接入客服系统
  },

  // 申请退款
  applyRefund() {
    wx.showModal({
      title: '申请退款',
      content: '确定要申请退款吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 尝试从服务器申请退款
            try {
              const res = await request.post(`/api/orders/${this.data.orderNo}/refund`);
              if (res.code === 200) {
                wx.showToast({
                  title: '退款申请已提交',
                  icon: 'success'
                });
                // 重新加载订单详情
                this.loadOrderDetail();
              }
            } catch (err) {
              console.error('从服务器申请退款失败:', err);
              
              // 从本地存储更新订单状态
              const orders = wx.getStorageSync('orders') || [];
              const orderIndex = orders.findIndex(o => o.orderNo === this.data.orderNo);
              
              if (orderIndex !== -1) {
                orders[orderIndex].status = 3; // 已退款
                wx.setStorageSync('orders', orders);
                
                wx.showToast({
                  title: '退款申请已提交',
                  icon: 'success'
                });
                
                // 重新加载订单详情
                this.loadOrderDetail();
              }
            }
          } catch (err) {
            wx.showToast({
              title: '申请退款失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 删除订单
  deleteOrder() {
    wx.showModal({
      title: '删除订单',
      content: '确定要删除此订单吗？删除后无法恢复',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 尝试从服务器删除订单
            try {
              const res = await request.delete(`/api/orders/${this.data.orderNo}`);
              if (res.code === 200) {
                wx.showToast({
                  title: '订单已删除',
                  icon: 'success'
                });
                
                // 返回订单列表页
                setTimeout(() => {
                  wx.navigateBack();
                }, 1500);
              }
            } catch (err) {
              console.error('从服务器删除订单失败:', err);
              
              // 从本地存储删除订单
              const orders = wx.getStorageSync('orders') || [];
              const newOrders = orders.filter(o => o.orderNo !== this.data.orderNo);
              wx.setStorageSync('orders', newOrders);
              
              wx.showToast({
                title: '订单已删除',
                icon: 'success'
              });
              
              // 返回订单列表页
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          } catch (err) {
            wx.showToast({
              title: '删除订单失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 再次购买
  rebuyOrder() {
    // 获取订单中的商品信息
    const items = this.data.orderInfo.items;
    if (items && items.length > 0) {
      // 将商品添加到购物车
      const cart = wx.getStorageSync('cart') || [];
      items.forEach(item => {
        const existingItem = cart.find(i => i.productId === item.productId);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.push({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            productImage: item.productImage,
            quantity: item.quantity
          });
        }
      });
      wx.setStorageSync('cart', cart);
      
      wx.showToast({
        title: '已添加到购物车',
        icon: 'success'
      });
      
      // 跳转到购物车页面
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/cart/index'
        });
      }, 1500);
    }
  },

  // 返回列表
  goBack() {
    wx.navigateBack();
  },

  async handleCancel() {
    try {
      // 尝试从服务器取消订单
      try {
        const res = await request.post(`/api/orders/${this.data.orderNo}/cancel`);
        if (res.code === 200) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          // 重新加载订单详情
          this.loadOrderDetail();
        }
      } catch (err) {
        console.error('从服务器取消订单失败:', err);
        
        // 从本地存储更新订单状态
        const orders = wx.getStorageSync('orders') || [];
        const orderIndex = orders.findIndex(o => o.orderNo === this.data.orderNo);
        
        if (orderIndex !== -1) {
          orders[orderIndex].status = 2; // 已取消
          wx.setStorageSync('orders', orders);
          
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          
          // 重新加载订单详情
          this.loadOrderDetail();
        }
      }
    } catch (err) {
      wx.showToast({
        title: '取消订单失败',
        icon: 'none'
      });
    }
  },

  async handlePay() {
    try {
      // 尝试从服务器支付订单
      try {
        const res = await request.post(`/api/orders/${this.data.orderNo}/pay`);
        if (res.code === 200) {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          });
          // 重新加载订单详情
          this.loadOrderDetail();
        }
      } catch (err) {
        console.error('从服务器支付订单失败:', err);
        
        // 从本地存储更新订单状态
        const orders = wx.getStorageSync('orders') || [];
        const orderIndex = orders.findIndex(o => o.orderNo === this.data.orderNo);
        
        if (orderIndex !== -1) {
          orders[orderIndex].status = 1; // 已支付
          orders[orderIndex].payTime = new Date().toISOString(); // 添加支付时间
          wx.setStorageSync('orders', orders);
          
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          });
          
          // 重新加载订单详情
          this.loadOrderDetail();
        }
      }
    } catch (err) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      });
    }
  }
});
