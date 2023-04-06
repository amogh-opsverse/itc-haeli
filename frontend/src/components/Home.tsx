import React, { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import { useNavigate, useLocation } from "react-router-dom";
//import ProfileList from "./ProfileList";
import ProfileView from "./ProfileView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faLightbulb,
  faSearch,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import profPic from "../assets/profpic.jpg";
import "../styles/pulse.css";
import "./home.css";
//import "../styles/transitions.css";
import lightBackgroundPic from "../assets/oxbow.jpg";
import darkBackgroundPic from "../assets/catskills.jpg";
//import darkBackgroundPic from "../assets/darkcauter.jpg";
import SearchResults from "./SearchResults";
import Recommendations from "./Recommendations";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
}

//gql mutation query for the list of users based on the search query
//update this to include other
const USER_DETAILS = gql`
  fragment UserDetails on User {
    username
    name
    bio
    email
  }
`;

//make sure the mutation exists in the backend
const SEARCH_USERS = gql`
  mutation SearchUserProfile($input: UserSearch) {
    searchUsers(input: $input) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

const Home = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set the component to visible after a delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000); // Adjust the delay as needed

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [searchAttributes, setSearchAttributes] = useState<any>({});
  const [searchresults, setResults] = useState<User[]>([]); //the results are being passed to the SearchResults component as a prop
  const [collapsedSearch, setCollapsedSearch] = useState(true); //default state is hidden to be conditionally changed when buttons are clicked
  const [collapsedEdit, setCollapsedEdit] = useState(true);
  const [collapsedRecs, setCollapsedRecs] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [searchUsers, searchedUsers] = useMutation(SEARCH_USERS);

  const location = useLocation();
  const { signedUser } = location.state;

  const imgUrl = signedUser["data"]["userLogin"].imgUrl;
  const university = signedUser["data"]["userLogin"].university;
  const username = signedUser["data"]["userLogin"].username;
  //console.log("signedIn user imgUrl", signedUser["data"]["userLogin"].imgUrl);
  // console.log("searchAttributes", searchAttributes);

  const handleSearchAttributesChange = async (attributes: any) => {
    setSearchAttributes(attributes); //this will be set from the search filter react component
    //console.log("searchAttributes from searchFilter", searchAttributes);
    let searchUniversity = "";
    const {
      Guests,
      Hygiene,
      Personality,
      Pets,
      SleepTime,
      Smoking,
      University,
    } = attributes;
    if (University) {
      searchUniversity = university;
    } else {
      searchUniversity = "";
    }
    console.log("Guests search response:", typeof Guests);
    //making sure the input keys match the input fields defined in the schema
    const input = {
      guests: Guests,
      university: searchUniversity,
      hygiene: Hygiene,
      pets: Pets,
      smoke: Smoking,
      sleepTime: SleepTime,
      personality: Personality,
    };

    let searchedUsers1 = await searchUsers({
      variables: { input }, //the input has to match the input schema type defined in backend
    });
    // signedUserData = signedUser["userLogin"]
    console.log("API response for search results:", searchedUsers1.data);

    let searchResults = searchedUsers1.data.searchUsers.map((user: any) => ({
      username: user.username, // Replace 'id' with the appropriate property from the user object
      name: user.name, // Replace 'name' with the appropriate property from the user object
      email: user.email, // Replace 'email' with the appropriate property from the user object
      bio: user.bio, // Replace 'attributes' with the appropriate property from the user object
    }));
    console.log("searchResults structure", searchResults);
    //call the api to get the list of searched users

    setResults(searchResults);
  };

  const handleToggleView = () => {
    console.log("handle toggle view called");
    setShowResults(!showResults);
    console.log("show results value", showResults);
  };

  return (
    // <div className="container mx-auto px-4 py-6 min-h-screen">
    <div className="transition-wrapper">
      {!visible && <div className="transition-background"></div>}
      <div className={`transition-content ${visible ? "visible" : ""}`}>
        <div
          className="mx-auto px-4 py-6 min-h-screen bg-white overflow-y-auto"
          style={{
            backgroundImage: `url(${
              isDarkMode ? darkBackgroundPic : lightBackgroundPic
            })`,
          }}
        >
          <div className="p-4 ">
            <div
              className="relative w-full rounded-lg max-w-md mx-auto mt-16 mb-3 bg-blue-400 bg-opacity-20 flex flex-col items-center justify-around border-4 border-black"
              style={{ maxHeight: "300px" }}
            >
              <div
                className="text-center relative mb-10"
                style={{
                  marginTop: "6rem", // Adjust this value according to the height of the navbar
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
                }}
              >
                <div className="rounded-full mb-16 h-24 w-24 mx-auto mb-4 glow-blue">
                  <img
                    //src={profPic}
                    src={imgUrl}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover pulse"
                  />
                  <div
                    className="absolute bottom-0 right-0 text-blue-800 p-1 rounded-full"
                    style={{ transform: "translate(10%, 10%)" }}
                  >
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => {
                        if (!collapsedRecs) {
                          setCollapsedRecs(!collapsedRecs);
                        }
                        if (!collapsedSearch) {
                          setCollapsedSearch(!collapsedSearch);
                        }
                        setCollapsedEdit(!collapsedEdit);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mb-8">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    if (!collapsedRecs) {
                      setCollapsedRecs(!collapsedRecs); //setting rec view hidden to true
                    }
                    if (!collapsedEdit) {
                      setCollapsedEdit(!collapsedEdit);
                    }
                    setCollapsedSearch(!collapsedSearch); //and set the
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                <button
                  className="bg-blue-600 text-white rounded-full px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    if (!collapsedSearch) {
                      setCollapsedSearch(!collapsedSearch);
                    }
                    if (!collapsedEdit) {
                      setCollapsedEdit(!collapsedEdit);
                    }
                    setCollapsedRecs(!collapsedRecs);
                  }}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                </button>
                <button
                  className={`dark-mode-button p-2 rounded-full text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${
                    isDarkMode ? "text-white-500" : "text-white-500"
                  }`}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  title={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <FontAwesomeIcon icon={faSun} />
                  ) : (
                    <FontAwesomeIcon icon={faMoon} />
                  )}
                </button>
              </div>
            </div>

            <div
              className="relative w-full max-w-md mx-auto "
              style={{ maxHeight: "300px" }}
            >
              <div
                className={`absolute z-10  border-4 border-black w-full bg-blue-500 bg-opacity-20  p-6 rounded-lg shadow-lg transition-all duration-300 ${
                  collapsedSearch ? "hidden" : "block"
                }`}
              >
                {showResults ? (
                  <SearchResults
                    results={searchresults}
                    onToggleView={handleToggleView}
                  />
                ) : (
                  <SearchFilter
                    onSearchAttributesChange={handleSearchAttributesChange}
                    onToggleView={handleToggleView}
                    signedInUser={signedUser}
                  />
                )}
              </div>
              <div
                className={`absolute z-10 border-4 border-black w-full bg-blue-500 bg-opacity-20 p-6 rounded-lg shadow-lg transition-all duration-300 ${
                  collapsedRecs ? "hidden" : "block"
                }`}
              >
                <Recommendations
                  loggedInUser={username}
                  onToggleView={handleToggleView}
                />
              </div>
              <div
                className={`absolute z-10 border-4 border-black w-full bg-blue-500 bg-opacity-20 p-6 rounded-lg shadow-lg transition-all duration-300 ${
                  collapsedEdit ? "hidden" : "block"
                }`}
              >
                <ProfileView
                  loggedInUser={signedUser}
                  onToggleView={handleToggleView}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
