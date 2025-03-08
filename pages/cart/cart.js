const request = require('../../utils/request.js');
// const auth = require('../../utils/auth.js');

Page({
  data: {
    cartItems: [],
    allSelected: false,
    totalAmount: '0.00',
    selectedCount: 0,
    loading: false,
    maxQuantity: 99,
    minQuantity: 1,
    syncLoading: false 
  },

  onShow() {
    this.setData({ loading: true })
    this.loadCartItems()
  },

  async loadCartItems() {
    try {
      console.log('开始加载购物车数据');
      // let cartItems = wx.getStorageSync('cartList') || [];
      let cartItems = [];
      // 登录用户，从服务器获取购物车数据
      // const token = auth.getToken();
      if (cartItems.length === 0) {
        console.log('从服务器获取购物车数据');
        const res = await request.get('/api/cart/list', { userId: 1 });
        if (res.code === 200 && res.data) {
          cartItems = res.data.map(item => ({
            id: item.productId,
            name: item.productName,
            image: item.productImage,
            price: item.price,
            quantity: item.quantity,
          }));
          wx.setStorageSync('cartList', cartItems);
          console.log('服务器购物车数据:', cartItems);
        } else {
          console.error('获取购物车数据失败:', res);
        }
      }
      
      // 将价格分转换成元
      cartItems = cartItems.map(item => ({
        ...item,
        price: (parseFloat(item.price) / 100).toFixed(2)
      }));
      this.setData({
        cartItems,
        loading: false
      });
      this.updateTotalAmount();
    } catch (error) {
      console.error('加载购物车失败:', error);
      this.setData({ loading: false });
    }
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

  async updateQuantity(index, quantity) {
    try {
      quantity = parseInt(quantity) || 1;
      const cartItems = [...this.data.cartItems];
      const item = cartItems[index];
      
      // 更新本地数据
      cartItems[index].quantity = quantity;
      wx.setStorageSync('cartList', cartItems);
      
      // 同步到服务器
      if (auth.checkAuth()) {
        await request.put('/api/cart/update', {
          productId: item.id,
          quantity: quantity
        });
      }
      
      this.setData({ cartItems }, () => {
        this.updateTotalAmount();
      });
    } catch (error) {
      console.error('更新数量失败:', error);
    }
  },

  async deleteItem(e) {
    const { index } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const cartItems = [...this.data.cartItems];
            const item = cartItems[index];
            
            // 删除本地数据
            cartItems.splice(index, 1);
            wx.setStorageSync('cartList', cartItems);
            
            // 同步到服务器
            if (auth.checkAuth()) {
              await request.delete(`/api/cart/${item.id}`);
            }
            
            this.setData({ cartItems });
            this.updateTotalAmount();
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('删除商品失败:', error);
          }
        }
      }
    });
  },

  updateTotalAmount() {
    const selectedItems = this.data.cartItems.filter(item => item.selected);
    const total = selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    this.setData({
      totalAmount: total.toFixed(2),
      selectedCount: selectedItems.length,
      allSelected: selectedItems.length === this.data.cartItems.length && this.data.cartItems.length > 0
    });
  },

  checkout() {
    if (!auth.checkAuth()) {
      auth.loginWithPrompt();
      return;
    }

    const selectedItems = this.data.cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '正在创建订单'
    });
    
    const remainingItems = this.data.cartItems.filter(item => !item.selected);
    wx.setStorageSync('cartList', remainingItems);
    
    wx.navigateTo({
      url: '../order/confirm/confirm',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromCart', { 
          selectedItems,
          totalAmount: this.data.totalAmount
        });
        this.setData({
          cartItems: remainingItems
        }, () => {
          this.updateTotalAmount();
        });
      },
      fail: () => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  handleError(error) {
    console.error('购物车操作错误：', error);
    wx.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    });
  },

  async syncCartItemsWithServer(localCartItems) {
    if (this.data.syncLoading) return localCartItems;
    
    try {
      this.setData({ syncLoading: true });
      
      const productIds = localCartItems.map(item => item.id);
      if (productIds.length === 0) return [];
      
      const res = await request.post('/api/products/batch', { ids: productIds });
      
      if (res.code === 200 && res.data) {
        return localCartItems.map(cartItem => {
          const serverProduct = res.data.find(p => p.id === cartItem.id);
          if (serverProduct) {
            return {
              ...cartItem,
              price: serverProduct.price,
              name: serverProduct.name,
              image: serverProduct.imageUrl || cartItem.image,
              stock: serverProduct.stock
            };
          }
          return cartItem;
        });
      }
      return localCartItems;
    } catch (error) {
      console.error('同步购物车数据失败：', error);
      return localCartItems;
    } finally {
      this.setData({ syncLoading: false });
    }
  },
  
  async fetchCartFromServer() {
    try {
      const res = await request.get('/api/cart/list');
      if (res.code === 200 && res.data) {
        return res.data.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.productName,
          image: item.productImage,
          stock: item.stock || 999
        }));
      }
      return [];
    } catch (error) {
      console.error('获取服务器购物车数据失败：', error);
      return [];
    }
  },
  
  async syncCartToServer() {
    const token = auth.getToken();
    if (!token) return;
    
    try {
      console.log('开始同步购物车到服务器');
      const cartItems = this.data.cartItems;
      if (cartItems.length === 0) {
        console.log('购物车为空,清除服务器数据');
        await request.delete('/api/cart/clear');
        return;
      }
      
      const cartData = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: Math.round(parseFloat(item.price) * 100) // 转换为分
      }));
      
      console.log('同步的购物车数据:', cartData);
      await request.post('/api/cart/add', cartData);
      console.log('同步购物车成功');
    } catch (error) {
      console.error('同步购物车失败:', error);
    }
  },
  
  onHide() {
    this.syncCartToServer();
  },
  
  onUnload() {
    this.syncCartToServer();
  }
})
