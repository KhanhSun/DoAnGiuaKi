const path = require("path");

const ROOT = path.join(__dirname, "../..");

const FRONTEND = path.join(ROOT, "frontend");
const VIEWS = path.join(FRONTEND, "layouts");
const ROUTES = path.join(ROOT, "backend", "routes");

module.exports = {
  ROOT,
  FRONTEND,
  VIEWS,
  ROUTES,
};
