# 殡葬/婚庆服务平台小程序

## 项目简介
提供红白事服务的一站式小程序平台，集成商品展示、购物车、订单管理等功能。

## 项目结构
### 核心功能
#### 白事服务模块
- 殡葬流程步骤指导（见[`processSteps`](pages/white_system/index/index.js)）
- 服务轮播图展示

#### 红事服务模块
- 婚礼/满月酒等庆典流程管理（见[`events`](pages/red_system/index/index.js)）
- 事件步骤跟踪

#### 通用功能
- 商品详情查看（支持模拟数据展示，见[`getGoodsDetail`](pages/goods/detail/detail.js)）
- 用户信息管理（见[`userInfo`](pages/user/user.js)）
- 自定义导航栏（使用[TD组件库](package.json)）

### 部署说明
1. 环境要求
   - Node.js >= 16.x
   - 微信开发者工具
   - 小程序账号（需配置合法域名）

2. 安装依赖
   ```bash
   npm install --production

3. 项目配置

    - 在微信开发者工具中导入项目目录
    - 在project.private.config.json中配置：
    ```json
    {
        "projectname": "miniprogram1",
        "setting": {
            "skylineRenderEnable": true  # 启用新渲染引擎
        }
    }
4. 运行项目

    - 工具菜单栏 -> 构建npm
    - 点击"编译"按钮启动开发模式

### 注意事项
- API接口需替换为真实服务地址（当前使用模拟数据）
- 用户系统需要配置微信开放平台权限
- 分类页路径需根据系统类型（红/白）自动切换