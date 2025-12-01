module.exports = {
  apps: [{
    name: 'api.yqfbtrip',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    // 日志配置
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // 自动重启配置
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    max_memory_restart: '500M',
    
    // 重启策略
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // 其他配置
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true
  }]
};

