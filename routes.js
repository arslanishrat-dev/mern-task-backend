const AuthRoutes = require("./routes/auth");
const DashboardRoutes = require("./routes/dashboard");
const CategoryRoutes = require("./routes/category");
const CarRoutes = require("./routes/car");

module.exports = function (app) {
  app.use("/api/auth", AuthRoutes);
  app.use("/api/dashboard", DashboardRoutes);
  app.use("/api/category", CategoryRoutes);
  app.use("/api/car", CarRoutes);
};
