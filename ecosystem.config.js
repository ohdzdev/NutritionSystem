// use this for linux deploys

// for windows: use pm2 start windows_api_deploy.js or windows_frontend_deploy.js
module.exports = {
  apps : [{
    name: 'zoo_api',
    script: 'deploy_api.sh',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    output: "./api.out.log",
    error: "./api.error.log",
    log: "./api.log.log",
    exec_interpreter: "bash",
    exec_mode: "fork-mode"
  },
  {
    name: 'zoo_frontend',
    script: 'deploy_frontend.sh',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    output: "./frontend.out.log",
    error: "./frontend.error.log",
    log: "./frontend.log.log",
    "exec_interpreter": "bash",
    "exec_mode"  : "fork_mode"
  }]
};
