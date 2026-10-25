module.exports = {
  apps: [
    {
      name: 'porto-backend',
      cwd: './backend',
      script: 'src/app.js',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      }
    },
    {
      name: 'porto-frontend',
      cwd: './frontend',
      script: './node_modules/vite/bin/vite.js',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};