Page({
  data: {
    orderItems: [],
    totalAmount: '0.00',
    address: null,
    remarks: '',
    loading: false,
    defaultAddress: {
      userName: '张三',
      telNumber: '13800138000',
      provinceName: '广东省',
      cityName: '深圳市',
      countyName: '南山区',
      detailInfo: '科技园路888号',
      fullAddress: '广东省深圳市南山区科技园路888号'
    }
  },

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromCart', (data) => {
      this.setData({
        orderItems: data.selectedItems,
        totalAmount: data.totalAmount
      })
    })
    // 设置默认地址
    if (!this.data.address) {
      this.setData({
        address: this.data.defaultAddress
      })
    }
  },

  selectAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          address: {
            userName: res.userName,
            telNumber: res.telNumber,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            fullAddress: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
          }
        })
      },
      fail: (err) => {
        console.error('选择地址失败：', err)
      }
    })
  },

  onRemarksChange(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  submitOrder() {
    if (!this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    // 构建订单数据
    const orderData = {
      items: this.data.orderItems,
      totalAmount: this.data.totalAmount,
      address: this.data.address,
      remarks: this.data.remarks,
      createTime: new Date().getTime(),
      orderStatus: 'pending' // 添加订单状态
    }

    // TODO: 后续接入云函数
    // 模拟提交订单
    setTimeout(() => {
      this.setData({ loading: false })
      wx.showToast({
        title: '订单提交成功',
        icon: 'success',
        success: () => {
          // 延迟返回，确保用户看到提示
          setTimeout(() => {
            // 跳转到订单列表页面
            wx.redirectTo({
              url: '../list/list',
              success: () => {
                // 返回上一页并刷新购物车
                const pages = getCurrentPages()
                const cartPage = pages[pages.length - 2]
                if (cartPage && cartPage.loadCartItems) {
                  cartPage.loadCartItems()
                }
              }
            })
          }, 1500)
        }
      })
    }, 1000)
  }
})
