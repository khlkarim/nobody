import { NavLink } from "react-router";

export function Navbar() {
  return (
    <div className="navcontainer">
      <div className="box"><b>nobody</b></div>
      <div className="navbar">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `navlink ${isActive ? "underline" : ""}`
          }
        >
          rooms
        </NavLink>

        <NavLink
          to="/user"
          className={({ isActive }) =>
            `navlink ${isActive ? "underline" : ""}`
          }
        >
          profile
        </NavLink>

        <NavLink
          to="/auth/logout"
          className={({ isActive }) =>
            `navlink ${isActive ? "underline" : ""}`
          }
        >
          logout
        </NavLink>
      </div>
    </div>
  );
}
