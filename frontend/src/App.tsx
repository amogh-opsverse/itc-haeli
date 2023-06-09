import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLightbulb,
  faSearch,
  faSignIn,
  faUserPlus,
  faSignInAlt,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
//import "./styles/tailwind.css";
import "./styles/tailwind.css";
import { useEffect, useState } from "react";
import "./styles/transitions.css";

import { Link } from "react-router-dom";
import backgroundPic from "./assets/thanatopsis.jpg";

function App() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set the component to visible after a delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000); // Adjust the delay as needed

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {/* <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-95 shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-800">hæli</h1>
          </div>
          <div>
            <Link
              to="/about"
              className="text-lg font-semibold text-blue-800 hover:text-blue-600"
            >
              About
            </Link>
          </div>
        </div>
      </nav> */}

      <div className="transition-wrapper backdrop-blur-sm">
        {!visible && <div className="transition-background-entry"></div>}
        <div className={`transition-content ${visible ? "visible" : ""}`}></div>
        <div
          className="min-h-screen flex items-center justify-center bg-center bg-cover"
          style={{
            backgroundImage: `url(${backgroundPic})`,
          }}
        >
          <div className="bg-blue-400 p-8  bg-opacity-30 rounded-lg shadow-md w-full max-w-md mx-auto border border-black">
            <h2
              className="text-2xl font-semibold mb-4 text-center text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Welcome
            </h2>

            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 opacity-61 hover:opacity-75 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-400 text-white font-bold rounded hover:from-blue-400 hover:via-blue-300 hover:to-blue-200 transition-all"
              >
                Search Roommates
              </Link>
              {/* <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-white font-bold rounded hover:from-blue-400 hover:via-blue-300 hover:to-blue-200 transition-all"
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
