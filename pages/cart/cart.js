Page({
  data: {
    cartItems: [],
    allSelected: false,
    totalAmount: '0.00',
    selectedCount: 0,
    loading: false,
    maxQuantity: 99,  // 最大购买数量
    minQuantity: 1    // 最小购买数量
  },

  onShow() {
    this.setData({ loading: true })
    this.loadCartItems()
  },

  loadCartItems() {
    // TODO: 后续开启云函数时恢复以下代码
    // wx.cloud.callFunction({
    //   name: 'getCartItems',
    //   success: res => {
    //     this.setData({
    //       cartItems: res.result.data
    //     })
    //   }
    // })

    // 使用mock数据
    setTimeout(() => {  // 模拟加载延迟
      const mockCartItems = [
        {
          id: 1,
          name: '示例商品1',
          price: 99.00,
          quantity: 1,  // 改为quantity
          selected: true,
          image: 'https://tdesign.gtimg.com/mobile/demos/example2.png'
        },
        {
          id: 2,
          name: '示例商品2',
          price: 199.00,
          quantity: 2,  // 改为quantity
          selected: true,
          image: 'https://tdesign.gtimg.com/mobile/demos/example1.png'
        }
      ]

      this.setData({
        cartItems: mockCartItems,
        loading: false
      })
      this.updateTotalAmount()
    }, 500)
  },

  toggleSelect(e) {
    const index = e.currentTarget.dataset.index
    const selected = !this.data.cartItems[index].selected
    this.setData({
      [`cartItems[${index}].selected`]: selected
    })
    this.updateTotalAmount()
  },

  toggleSelectAll() {
    const allSelected = !this.data.allSelected
    const cartItems = this.data.cartItems.map(item => ({
      ...item,
      selected: allSelected
    }))
    this.setData({
      allSelected,
      cartItems
    })
    this.updateTotalAmount()
  },

  increaseQuantity(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.cartItems[index]
    if (item.quantity >= this.data.maxQuantity) {
      wx.showToast({
        title: `最多只能购买${this.data.maxQuantity}件`,
        icon: 'none'
      })
      return
    }
    this.updateQuantity(index, item.quantity + 1)
  },

  decreaseQuantity(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.cartItems[index]
    if (item.quantity <= this.data.minQuantity) {
      wx.showToast({
        title: `最少需要购买${this.data.minQuantity}件`,
        icon: 'none'
      })
      return
    }
    this.updateQuantity(index, item.quantity - 1)
  },

  updateQuantity(index, quantity) {
    // 确保quantity是数字
    quantity = parseInt(quantity) || 1
    
    this.setData({
      [`cartItems[${index}].quantity`]: quantity
    }, () => {
      this.updateTotalAmount()
    })
  },

  deleteItem(e) {
    const { index } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            loading: true
          })
          // 模拟删除操作
          setTimeout(() => {
            const cartItems = [...this.data.cartItems]
            cartItems.splice(index, 1)
            this.setData({
              cartItems,
              loading: false
            })
            this.updateTotalAmount()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }, 300)
        }
      }
    })
  },

  updateTotalAmount() {
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    const total = selectedItems.reduce((sum, item) => {
      // 确保price和quantity都是数字
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 0
      return sum + (price * quantity)
    }, 0)

    this.setData({
      totalAmount: total.toFixed(2),
      selectedCount: selectedItems.length,
      allSelected: selectedItems.length === this.data.cartItems.length && this.data.cartItems.length > 0
    })
  },

  checkout() {
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '正在创建订单'
    })
    
    // 模拟订单创建过程
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '../order/confirm/confirm',  // 更新路径
        success: (res) => {
          res.eventChannel.emit('acceptDataFromCart', { 
            selectedItems,
            totalAmount: this.data.totalAmount
          })
        },
        fail: () => {
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    }, 800)
  },

  // 添加错误处理方法
  handleError(error) {
    console.error('购物车操作错误：', error)
    wx.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    })
  }
})
