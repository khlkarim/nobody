import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth/login/*", "routes/auth/login.tsx"),
  route("/auth/register/*", "routes/auth/register.tsx"),
  route("/rooms/*", "routes/rooms/rooms.tsx"),
  route("/profile/:id", "routes/profile/profile.tsx"),
  route("/auth/logout/*", "routes/auth/logout.tsx"),
  route("/simulation/*", "routes/simulation/main.tsx"),
  route("/sim", "routes/sim.tsx"),
] satisfies RouteConfig;
