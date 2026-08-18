module.exports = { apps: [ { name: "roblox-trader-bot", script: "./dist/index.js", instances: 1, autorestart: true, watch: false, max_memory_restart: "300M", env: { NODE_ENV: "production" } } ] };
