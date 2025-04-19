module.exports = {
  apps: [
    {
      name: 'bbb-web-v3-production',
      script: 'node server',
      // watch: [".next"],
      // Delay between restart
      // watch_delay: 1000,
      ignore_watch: ['node_modules'],
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
  ],
};
