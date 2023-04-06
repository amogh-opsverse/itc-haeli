// Layout.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import React from "react";
import { Link } from "react-router-dom";
//import Navbar from './Navbar';
import "./signup.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-50 shadow-md z-10"> */}
      <nav className="fixed top-0 left-0 w-full bg-blue-500 bg-opacity-20 shadow-md z-10 border-4 border-black">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <Link
              to="/"
              className="text-lg font-semibold text-blue-800 hover:text-blue-600"
            >
              <h1
                className="text-4xl font-bold text-white border border-blue-800 border-4 rounded p-2 outline-blue"
                style={{
                  WebkitTextStroke: "2px #2563EB", // Adjust the stroke width and color as needed
                }}
              >
                hæli
              </h1>
            </Link>
          </div>
          <div>
            <Link
              to="/about"
              className="text-lg font-semibold text-blue-800 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;
