import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import MenuExpanded from "./MenuExpanded";
import { useState } from "react";

const RootLayout = () => {
  const [state, setState] = useState(false);

  // this is a TODO atm
  // The existing codebase used some external javascript that toggles the existence of a
  // css class on the parent body html tag, based on the css class the body has, the button
  // gets hidden and the menu sheet/drawer gets shown, and vice-versa
  const toggleMenu = () => {};

  return (
    <div id="wrapper">
      <header id="header">
        <div className="inner">
          <Link to="/" className="logo">
            <span className="symbol">
              <img src="/logo.svg" alt="logo" />
            </span>
            <span className="title">Tuah</span>
          </Link>

          {/* Navigation */}
          <nav>
            <ul>
              <li>
                <a href="#menu" onClick={toggleMenu}>
                  Menu
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <MenuExpanded />

      <Outlet />

      <Footer />
    </div>
  );
};

export default RootLayout;
