Component({
  data: {
    value: 'index',
    list: [
      { value: 'index', icon: 'home', ariaLabel: '首页' },
      { value: 'category', icon: 'app', ariaLabel: '类别' },
      { value: 'cart', icon: 'cart', ariaLabel: '购物车' },
      { value: 'user', icon: 'user', ariaLabel: '我的' },
    ],
  },

  methods: {
    onChange(e) {
      this.setData({
        value: e.detail.value,
        // 根据当前选中的索引，跳转对应的页面
        selectedIndex: e.detail.value,
        selectedPagePath: `/pages/${e.detail.value}/index`
      });
      // 触发页面切换事件
      // this.triggerEvent('change', { index: e.detail.value });
      wx.navigateTo({
        url: `/pages/white_system/${e.detail.value}/${e.detail.value}`,
        success: (res) => {
          console.log(`成功切换页面`);
        },
        fail: (res) => {
          console.log(`切换页面失败：${res.errMsg}`);
        }
      });
      console.log(e.detail.value);
    },
  },
});
