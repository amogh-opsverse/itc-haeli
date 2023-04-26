import backgroundPic from "../assets/thanatopsis.jpg";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
const About = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      <div className="bg-blue-400 p-8 bg-opacity-30 backdrop-blur-md rounded-lg shadow-md w-full max-w-2xl mx-auto border border-black">
        <Link to="/" className="position: relative top-2 right-2 text-blue">
          <FiX size={34} />
        </Link>
        <h2
          className="text-4xl font-semibold mb-4 text-center text-white"
          style={{
            fontFamily: "Roboto, sans-serif",
            letterSpacing: "0.05em",
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          About the Project
        </h2>

        <div style={{ maxHeight: "309px", overflowY: "auto" }}>
          {/* <p
            className="text-left text-white font-bold text-2xl"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            An Ode to Hæli:
          </p> */}
          <p
            className="text-left text-white font-medium text-m"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            In Icelandic, "hæli" is a noun that translates to "shelter" or
            "protection". It refers to a place or situation that provides safety
            from adverse weather, danger, or any other threatening conditions
          </p>
          <br />
          <p
            className="text-left text-white font-bold text-2xl"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            Credits:
          </p>
          <p
            className="text-left text-white font-medium text-m"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            <a
              href="https://www.linkedin.com/in/amoghprak/"
              target="_blank"
              className="hover:text-slate-300"
            >
              {" "}
              Amogh Prakash{" "}
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/chirayu-rai/"
              target="_blank"
              className="hover:text-slate-300"
            >
              {" "}
              Chirayu Rai{" "}
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/gerardosolisit/"
              target="_blank"
              className="hover:text-slate-300"
            >
              {" "}
              Gerardo Solis{" "}
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/andy-diep/"
              target="_blank"
              className="hover:text-slate-300"
            >
              {" "}
              Andy Diep{" "}
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/sararosec/"
              target="_blank"
              className="hover:text-slate-300"
            >
              {" "}
              Sara Cozart{" "}
            </a>
          </p>
          <br />
          <p
            className="text-left text-white font-bold text-2xl"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            Our Tech Stack:
          </p>
          <p
            className="text-left text-white font-medium text-m"
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            This project is based off the MERN stack, along with a graphql
            implementation as middleware for easier querying, as well as redis
            for caching user data. The recommendation system also utilizes
            tensor flow.js, allowing for more accurate pairing between users.
          </p>
          <br />
          <p
            className="text-white font-bold text-2xl "
            style={{
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.05em",
              textShadow:
                "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
          >
            A{" "}
            <a
              className="underline hover:text-slate-300 visited:text-slate-500"
              href="https://www.notion.so/ITC-Comp-b4d08e53ca72495da9999d2753a419a7?pvs=4"
              target="_blank"
            >
              link
            </a>{" "}
            to our documentation
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
