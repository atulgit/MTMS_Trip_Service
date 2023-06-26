module.exports = {
    apps: [
      {
        name: "MTMS1",
        script: "./index.js",
        instances: 1,
        max_memory_restart: "300M",
        // Logging
        out_file: "./out.log",
        error_file: "./error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "json",
        // Env Specific Config
        // env_production: {
        //   NODE_ENV: "production",
        //   PORT: 8080,
        //   DB_HOST: 'localhost',
        //   exec_mode: "cluster_mode",
        // },
        // env_development: {
        //   NODE_ENV: "development",
        //   PORT: 8080,
        //   DB_HOST: 'localhost',
        //   watch: true,
        //   watch_delay: 3000,
        //   ignore_watch: [
        //     "./node_modules",
        //     "./app/views",
        //     "./public",
        //     "./.DS_Store",
        //     "./package.json",
        //     "./yarn.lock",
        //     "./samples",
        //     "./src"
        //   ],
        // },
      },
    ],
  };