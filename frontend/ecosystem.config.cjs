module.exports = {
  apps: [{
    name: "alzera-porto",
    cwd: "C:/laragon/www/Porto-terbaru/frontend",
    script: "node_modules/vite/bin/vite.js",
    args: "--host",
    interpreter: "node",
    autorestart: true,
    restart_delay: 3000,
    env: {
      NODE_ENV: "development"
    }
  }]
}
