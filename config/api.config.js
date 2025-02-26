const ENV = {
  dev: 'http://localhost:3000',
  prod: 'https://api.example.com'
};

const config = {
  baseUrl: ENV.dev,
  timeout: 5000,
  header: {
    'content-type': 'application/json'
  }
};

module.exports = config;
