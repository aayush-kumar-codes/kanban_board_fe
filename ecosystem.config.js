module.exports = {
    apps: [
      {
        name: "task_kanban",
        script: "serve",
        env: {
          PM2_SERVE_PATH: "./dist",
          PM2_SERVE_PORT: 3004,
          NODE_ENV: "production",
        },
      },
    ],
  };
  