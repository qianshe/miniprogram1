const { api } = require('../../../utils/api.js');

Page({
  data: {
    id: '',
    loading: true,
    goods: null,
    quantity: 1,
    showSkuPopup: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ id });
      this.loadGoodsDetail(id);
    }
  },

  async loadGoodsDetail(id) {
    try {
      this.setData({ loading: true });
      const goods = await api.getProductDetail(id);
      
      const goodsData = {
        ...goods,
        displayTime: goods.createdTime.replace('T', ' ').slice(0, 16),
        image: goods.imageUrl || 'https://tdesign.gtimg.com/mobile/demos/default_goods.png',
        images: goods.imageUrl ? [goods.imageUrl] : ['https://tdesign.gtimg.com/mobile/demos/default_goods.png']
      };
      
      this.setData({
        goods: goodsData,
        loading: false
      });
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  // 修改商品数量
  onQuantityChange(e) {
    const quantity = e.detail.value;
    this.setData({ quantity });
  },

  // 打开SKU弹窗
  showSkuPopup() {
    this.setData({ showSkuPopup: true });
  },

  // 关闭SKU弹窗
  closeSkuPopup() {
    this.setData({ showSkuPopup: false });
  },

  // 加入购物车
  addToCart() {
    if (!this.data.goods) return;
    
    // 检查库存
    if (this.data.quantity > this.data.goods.stock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      });
      return;
    }

    // 获取购物车数据
    let cartList = wx.getStorageSync('cartList') || [];
    
    // 查找是否已存在该商品
    const existingIndex = cartList.findIndex(item => item.id === this.data.goods.id);
    
    if (existingIndex > -1) {
      // 已存在则更新数量
      cartList[existingIndex].quantity += this.data.quantity;
    } else {
      // 不存在则添加新商品
      cartList.push({
        id: this.data.goods.id,
        name: this.data.goods.name,
        price: this.data.goods.price,
        image: this.data.goods.image,
        quantity: this.data.quantity
      });
    }

    // 保存购物车数据
    wx.setStorageSync('cartList', cartList);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    this.closeSkuPopup();
  },

  // 预览图片
  previewImage(e) {
    const { current } = e.currentTarget.dataset;
    wx.previewImage({
      current,
      urls: this.data.goods.images
    });
  }
});
