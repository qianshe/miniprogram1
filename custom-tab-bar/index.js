// Components/tabBar/tabBar.js
const app = getApp()
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#d32f2f",
    backgroundColor: "#ffffff",
    list: []
  },

  attached() {
    this.updateTabList(getApp().globalData.systemType || 'red')
  },

  methods: {
    updateTabList(systemType) {
      const tabConfig = {
        white: {
          list: [
            {
              pagePath: "/pages/white_system/index/index",
              text: "首页",
              icon: "home"
            },
            {
              pagePath: "/pages/white_system/category/category",
              text: "分类",
              icon: "app"
            },
            {
              pagePath: "/pages/white_system/user/user",
              text: "个人中心",
              icon: "user"
            }
          ]
        },
        red: {
          list: [
            {
              pagePath: "/pages/red_system/index/index",
              text: "首页",
              icon: "home"
            },
            {
              pagePath: "/pages/red_system/user/user",
              text: "个人中心",
              icon: "user"
            }
          ]
        }
      }

      const config = tabConfig[systemType]
      this.setData({
        list: config.list,
        color: config.color,
        selectedColor: config.selectedColor
      })
    },

    switchTab(e) {
      console.log(e)
      // const { path: url, index } = e.detail
      const { path: url, index } = e.currentTarget.dataset

      console.log(url)
      console.log(e.currentTarget.dataset)

      wx.switchTab({
        url: url.startsWith('/') ? url : `/${url}`, // 双重保障路径格式,
        success: (res) => {
          this.setData({
            selected: index
          });
        },
        fail: (err) => {
          console.error('Tab switch failed:', err);
        }
      });
    }
  }
})