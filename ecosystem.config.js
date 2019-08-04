// use this for linux deploys

// for windows: use pm2 start windows_api_deploy.js or windows_frontend_deploy.js
module.exports = {
  apps : [{
    name: 'zoo_api',
    script: './zoo_api/server/server.js',
    env_production: {
      NODE_ENV: "production",
    },
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    output: "api.out.log",
    error: "api.error.log",
    log: "api.log.log",
    log_type: 'json'
  },
  {
    name: 'zoo_frontend',
    script: 'start.js',
    cwd: './zoo_frontend/',
    args: 'zoo_frontend',
    env_production: {
      NODE_ENV: "production",
    },
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    output: "frontend.out.log",
    error: "frontend.error.log",
    log: "frontend.log.log",
    log_type: 'json'
  }]
};
