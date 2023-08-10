const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        backend_url: "http://localhost:8080",
      },
    };
  }

  return {
    env: {
      backend_url: "http://localhost:8080",
    },
  };
};
