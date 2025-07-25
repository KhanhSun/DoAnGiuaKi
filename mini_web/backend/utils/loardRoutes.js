const fs = require("fs");
const path = require("path");

function loadRoutes(app, routesPath, prefix = "/api") {
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const routeName = file.replace(".js", "");
      const routePath = `${prefix}/${routeName}`;
      try {
        const routeModule = require(path.join(routesPath, file));
        if (typeof routeModule !== "function") {
          throw new Error(`Không export router từ ${file}`);
        }
        app.use(routePath, routeModule);
        console.log(`✅ Route loaded: ${routePath}`);
      } catch (err) {
        console.error(`❌ Route ${file} lỗi: ${err.message}`);
      }
    }
  });
}

module.exports = loadRoutes;
