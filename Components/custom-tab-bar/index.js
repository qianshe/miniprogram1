// Components/tabBar/tabBar.js
Component({
  data: {
    index: 0,
    list: [],
    ready: false
  },

  lifetimes: {
    created() {
      console.log('tabBar created');
    },

    attached() {
      console.log('tabBar attached');
      this.initTabBar();
    },

    ready() {
      console.log('tabBar ready');
      this.setData({ ready: true });
    },

    detached() {
      console.log('tabBar detached');
    }
  },

  pageLifetimes: {
    show() {
      console.log('tabBar page show');
      if (this.data.ready) {
        const app = getApp();
        const systemType = app.globalData.systemType || 'white';
        this.updateTabList(systemType);
      }
    }
  },

  methods: {
    initTabBar() {
      const app = getApp();
      const systemType = app.globalData.systemType || 'white';
      this.updateTabList(systemType);
    },

    updateTabList(systemType) {
      if (!systemType) {
        console.warn('systemType is undefined, using default "white"');
        systemType = 'white';
      }
      
      const tabConfig = {
          list: [
            {
              pagePath: "/pages/index/index",
              text: "首页",
              icon: "home"
            },
            {
              pagePath: "/pages/goods/category/category",
              text: "分类",
              icon: "app"
            },
            {
              pagePath: "/pages/user/user",
              text: "个人中心",
              icon: "user"
            }
          ]
      };
      const app = getApp();
      
      this.setData({
        list: tabConfig.list,
        index: app.globalData.currentTabIndex || 0
      });
    },

    onChange(e) {
      const index = e.detail.value;
      const page = this.data.list[index];
      
      if (!page || !page.pagePath) {
        console.error('Invalid page at index:', index);
        return;
      }

      const app = getApp();
      app.globalData.currentTabIndex = index;
    
      wx.switchTab({
        url: page.pagePath,
        fail: (err) => {
          console.error('Tab switch failed:', err);
        }
      });
    }
  }
})