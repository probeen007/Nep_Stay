module.exports = {
  apps: [{
    name: 'nep-stay-backend',
    script: './src/server.js',
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
