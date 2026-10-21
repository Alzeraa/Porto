module.exports = {
  apps: [{
    name: "alzera-porto",
    cwd: "C:/Reavlenia Arezha/Porto/frontend",
    script: "node_modules/vite/bin/vite.js",
    args: "--host 127.0.0.1",
    interpreter: "node",
    autorestart: true,
    restart_delay: 3000,
    env: {
      NODE_ENV: "development"
    }
  }]
}
