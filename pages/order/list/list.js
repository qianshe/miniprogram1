import { errorHandler } from '../../../utils/errorHandler';

Page({
  data: {
    orders: [],
    loading: false,
    currentTab: '0',
    statusMap: {
      'pending': '待付款',
      'paid': '待发货',
      'shipping': '已发货',
      'completed': '已完成',
      'cancelled': '已取消'
    }
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders(this.data.currentTab);
  },

  onTabsChange(e) {
    const { value } = e.detail;
    this.setData({ 
      currentTab: value 
    });
    this.loadOrders(value);
  },

  loadOrders(status = '0') {
    this.setData({ loading: true });
    // 模拟加载订单数据
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORDER001',
          items: [
            {
              id: 1,
              name: 'iPhone 15 Pro Max',
              price: 9999.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
            }
          ],
          totalAmount: '9999.00',
          createTime: '2024-01-20 12:00:00',
          status: 'pending'
        },
        {
          id: 'ORDER002',
          items: [
            {
              id: 2,
              name: 'MacBook Pro M3',
              price: 18999.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
            },
            {
              id: 3,
              name: 'AirPods Pro',
              price: 1999.00,
              quantity: 2,
              image: 'https://tdesign.gtimg.com/mobile/demos/example3.png'
            }
          ],
          totalAmount: '22997.00',
          createTime: '2024-01-19 15:30:00',
          status: 'paid'
        },
        {
          id: 'ORDER003',
          items: [
            {
              id: 4,
              name: 'iPad Air',
              price: 4799.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example4.png'
            }
          ],
          totalAmount: '4799.00',
          createTime: '2024-01-18 09:15:00',
          status: 'shipping'
        },
        {
          id: 'ORDER004',
          items: [
            {
              id: 5,
              name: 'Apple Watch Series 9',
              price: 3299.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example5.png'
            }
          ],
          totalAmount: '3299.00',
          createTime: '2024-01-17 16:45:00',
          status: 'completed'
        },
        {
          id: 'ORDER005',
          items: [
            {
              id: 6,
              name: 'Magic Keyboard',
              price: 999.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example6.png'
            },
            {
              id: 7,
              name: 'Magic Mouse',
              price: 699.00,
              quantity: 1,
              image: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
            }
          ],
          totalAmount: '1698.00',
          createTime: '2024-01-16 14:20:00',
          status: 'cancelled'
        }
      ];

      // 根据状态过滤订单
      let filteredOrders = mockOrders;
      if (status === '1') { // 待付款
        filteredOrders = mockOrders.filter(order => order.status === 'pending');
      } else if (status === '2') { // 已完成
        filteredOrders = mockOrders.filter(order => order.status === 'completed');
      }

      this.setData({
        orders: filteredOrders,
        loading: false
      });
    }, 500);
  },

  onOrderTap(e) {
    const { orderid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/detail?id=${orderid}`,
      fail (err) {
        errorHandler({
          page: 'order-list',
          error: err,
          method: 'navigateTo'
        });
      }
    });
  }
});
