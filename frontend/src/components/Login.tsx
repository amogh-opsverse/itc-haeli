import React, { useState } from "react";
//import "../styles/tailwind.css";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLightbulb,
  faSearch,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
//import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import backgroundPic from "../assets/thanatopsis.jpg";

const USER_DETAILS = gql`
  fragment SignedInUserDetails on User {
    #id
    username
    imgUrl
    university
    email
    name
    #vaccinated @client
  }
`;

const VERIFY_USER = gql`
  mutation ValidateUser($input: UserInputLogin!) {
    userLogin(input: $input) {
      ...SignedInUserDetails
    }
  }
  ${USER_DETAILS}
`;

const LoginForm = () => {
  //implement for recommendations and userprofile page
  //const [modal, setModal] = useState(false);
  //const users = useQuery(GET_USERS);

  const navigate = useNavigate();

  const [validateUser, validatedUser] = useMutation(VERIFY_USER);
  //const validatedUser = useQuery(VERIFY_USER); //the response implies that the user has been validated in the backend

  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  //updates the formData above whenever a change is detected in the text field via user interaction
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Send data to the backend/API for login validation
    try {
      const { username, password } = formData; //destructuring the data to be passed as a req in createUser
      //graphql req: input payload
      const input = {
        username, //this value has to be passed in from the signup flow to establish the relationship
        password,
      };

      try {
        const signedUser = await validateUser({
          variables: { input }, //the input has to match the input schema type defined in backend
        });
        // signedUserData = signedUser["userLogin"]
        console.log("API response:", signedUser.data);
        navigate("/home", { state: { signedUser } });
      } catch (error) {
        console.error("API error:", error);
        alert("incorrect credentials");
        // Handle the error, e.g., show error message, etc.
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error, e.g., show error message, etc.
      //implement toastify
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-white-100 py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      {/* <div className="max-w-md w-full space-y-8 bg-white-900 p-6 rounded-lg shadow-lg"> */}

      <form
        onSubmit={handleSubmit}
        className="bg-blue-500 bg-opacity-20 p-8 border-4 border-black rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        <div className="mb-4">
          {/* <label
            htmlFor="username"
            className="block mb-2 font-semibold text-black-700"
          >
            Username:
          </label> */}
          <div>
            <h2
              className="text-2xl font-semibold mb-4 text-center text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Sign In
            </h2>
          </div>
          {/* <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="border-2 border-blue-500 p-2 rounded w-full focus:outline-none focus:border-blue-700"
            placeholder="username"
          /> */}
        </div>
        <hr className="border-1 border-black mb-8" />
        <div className="rounded-md shadow-sm -space-y-px mb-4">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="my-input appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-black placeholder-black-500 text-black-100 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              style={{ backgroundColor: "rgba(0, 235, 235, 0.5)" }}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              required
              onChange={handleChange}
              className="my-input appearance-none rounded-none relative block w-full px-3 py-2 border-2 border-black placeholder-black-500 text-black-100 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              style={{ backgroundColor: "rgba(0, 235 , 235, 0.5)" }}
            />
          </div>
        </div>

        {/* <div className="mb-4">
        
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="border-2 border-blue-500 p-2 rounded w-full focus:outline-none focus:border-blue-700"
            placeholder="password"
          />
        </div> */}

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 text-white mr-4 font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faSignIn} />
        </button>
        <Link
          to="/signup"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 text-white font-bold rounded hover:from-blue-400 hover:via-blue-300 hover:to-blue-200 transition-all"
        >
          {/* <FontAwesomeIcon icon={faUserPlus} /> */}
          Sign Up
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
