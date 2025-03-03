const ENV = {
  dev: 'http://localhost:8080',
  prod: 'https://localhost'
};

const config = {
  baseUrl: ENV.dev,  // 当前使用开发环境
  timeout: 10000,    // 超时时间增加到10秒
  header: {
    'content-type': 'application/json'
  }
};

module.exports = config;
