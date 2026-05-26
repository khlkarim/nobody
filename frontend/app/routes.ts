import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/rooms/rooms.tsx"),
  route("/user/*", "routes/user/profile.tsx"),
  route("/user/edit/*", "routes/user/edit.tsx"),

  route("/auth/login/*", "routes/auth/login.tsx"),
  route("/auth/logout/*", "routes/auth/logout.tsx"),
  route("/auth/register/*", "routes/auth/register.tsx"),

  route("/sim", "routes/sim.tsx"),
  route("/simulation/*", "routes/simulation/main.tsx"),
] satisfies RouteConfig;
