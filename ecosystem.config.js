module.exports = {
    apps: [
      {
        name: "api-gateway",
        script: "./dist/apps/task-manager-services/main.js", // Ruta relativa desde la raíz
        cwd: "./", // Directorio de trabajo
        watch: ["apps/api-gateway"],
        env: {
          NODE_ENV: "development"
        }
      },
      {
        name: "user-service",
        script: "./dist/apps/user-service/main.js",
        watch: ["apps/user-service"]
      },
      {
        name: "task-service",
        script: "./dist/apps/task-service/main.js",
        watch: ["apps/task-service"]
      }
    ]
  };