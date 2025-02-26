const request = require('../../../utils/request.js');

Page({
  data: {
    order: null,
    loading: true,
    statusMap: {
      'pending': '待付款',
      'paid': '待发货',
      'shipping': '已发货',
      'completed': '已完成',
      'cancelled': '已取消'
    }
  },

  onLoad(options) {
    const { id } = options
    this.loadOrderDetail(id)
  },

  loadOrderDetail(orderId) {
    this.setData({ loading: true });
    
    // 先尝试请求真实接口
    request.get(`/api/orders/${orderId}`)
      .then(res => {
        this.setData({
          order: res.data,
          loading: false
        });
      })
      .catch(() => {
        // 请求失败时使用mock数据
        const mockOrder = {
          id: orderId,
          items: [
            {
              id: 1,
              name: '商品1',
              price: 99.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
            }
          ],
          totalAmount: '99.00',
          createTime: '2024-01-20 12:00:00',
          status: 'pending',
          address: {
            userName: '张三',
            telNumber: '13800138000',
            fullAddress: '广东省深圳市南山区科技园路888号'
          },
          remarks: '请尽快发货'
        };

        wx.showToast({
          title: '当前使用演示数据',
          icon: 'none',
          duration: 2000
        });

        this.setData({
          order: mockOrder,
          loading: false
        });
      });
  }
})
