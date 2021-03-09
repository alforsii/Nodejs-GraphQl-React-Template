import React from "react";
import { NavLink } from "react-router-dom";
// import { Icon, Navbar, NavItem } from "react-materialize";
import "./MyNavbar.css";

export default function MyNavbar() {
  return (
    <nav style={{ position: "fixed", left: 0, top: 0 }}>
      <div className="nav-wrapper blue" style={{ paddingLeft: 20 }}>
        <NavLink to="/" className="brand-logo">
          GraphQl React Nodejs
        </NavLink>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
