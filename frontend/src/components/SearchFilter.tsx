import React, { useState } from "react";

//setting type
import "../styles/pulse.css";
import "./searchfilter.css";
import { setActiveSearch } from "../redux/actions/searchActions";
import { useDispatch } from "react-redux";
interface SearchFilterProps {
  //for the state function to be passed from the home page
  onSearchAttributesChange: (attributes: any) => void;
  onToggleView: () => void;
  signedInUser: any;
}

//const SearchFilter: React.FC<SearchFilterProps> = ({
const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchAttributesChange,
  onToggleView,
  signedInUser,
}) => {
  // const [searchTerm, setSearchTerm] = useState("");

  const [filterAttributes, setFilterAttributes] = useState({
    Hygiene: "",
    Pets: "",
    Smoking: "",
    Guests: "",
    SleepTime: "",
    Personality: "",
    University: false,
    Gender: false,
  });

  const [collapsed, setCollapsed] = useState(true);

  const handleCheckboxAttributeChange = (e: any) => {
    setFilterAttributes({
      ...filterAttributes,
      [e.target.name]: e.target.checked, //set the user's university if checked
    });
  };

  const handleAttributeChange = (e: any) => {
    setFilterAttributes({
      ...filterAttributes,
      [e.target.name]: e.target.value,
    });
    console.log("");
  };

  const dispatch = useDispatch(); //redux dispatch

  const handleSearchClick = () => {
    // console.log("Search Term:", searchTerm);
    console.log("Filter Attributes:", filterAttributes);
    onSearchAttributesChange(filterAttributes); //executing the function passed in as prop from Home page
    dispatch(setActiveSearch("local"));
    onToggleView(); //toggle the search results
  };

  return (
    <div
      className="flex flex-col h-full backdrop-blur-md"
      style={{ maxHeight: "345px", overflowY: "auto" }}
    >
      <div className="justify-between items-center mb-4">
        <h3
          className="text-2xl font-semibold mb-4 text-center text-white"
          style={{
            fontFamily: "Roboto, sans-serif",
            letterSpacing: "0.05em",
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          Search
        </h3>
      </div>
      <hr className=" border-t" />

      <hr className="border border-black mb-8" />
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: "209px", overflowY: "auto" }}
      >
        <div className="flex justify-center">
          <div className="filter-attributes space-y-4 flex-1 overflow-y-auto max-w-lg">
            {/* <h4 className="font-semibold mb-4 text-center">Preferences:</h4> */}
            <div className="flex">
              <div className="w-1/2 pr-8">
                <label
                  htmlFor="university"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Match University
                </label>
                <input
                  type="checkbox"
                  checked={filterAttributes.University}
                  onChange={handleCheckboxAttributeChange}
                  id="university"
                  name="University"
                  className="ml-2 align-middle"
                />
              </div>
              <div className="w-1/2 pr-8">
                <label
                  htmlFor="gender"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Match Gender
                </label>
                <input
                  type="checkbox"
                  checked={filterAttributes.Gender}
                  onChange={handleCheckboxAttributeChange}
                  id="gender"
                  name="Gender"
                  className="ml-2 align-middle"
                />
              </div>
            </div>
            <br />
            {/* <hr className="border-t border-black mb-8" /> */}
            <hr className="flame border-t" />

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center"> */}
            <div className="filter-container">
              <div className="filter-grid">
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="pets"
                    className="filter-label"
                    // className="font-semibold mb-2 text-white"
                    // style={{
                    //   fontFamily: "Roboto, sans-serif",
                    //   letterSpacing: "0.05em",
                    //   textShadow:
                    //     "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                    // }}
                  >
                    Pets:
                  </label>

                  <select
                    id="pets"
                    name="Pets"
                    value={filterAttributes.Pets}
                    onChange={handleAttributeChange}
                    // className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent max-w-xs"
                    className="filter-select mb-4 transparent-dropdown"
                  >
                    <option value=""></option>
                    <option value="yes">yea</option>
                    <option value="no">nay</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="smoke"
                  className="filter-label"
                  // className="font-semibold mb-2 text-white"
                  // style={{
                  //   fontFamily: "Roboto, sans-serif",
                  //   letterSpacing: "0.05em",
                  //   textShadow:
                  //     "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  // }}
                >
                  Smoke:
                </label>
                <select
                  id="smoke"
                  name="Smoking"
                  value={filterAttributes.Smoking}
                  onChange={handleAttributeChange}
                  // className="w-full px-3 py-2 border border-gray-300 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent max-w-xs"
                  className="filter-select mb-4 transparent-dropdown"
                >
                  <option value=""></option>
                  <option value="yes">yea</option>
                  <option value="no">nay</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                {/* <h4 className="font-semibold mb-2">Sleep time:</h4> */}
                <label
                  htmlFor="sleep"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Sleep time:
                </label>
                <select
                  name="SleepTime"
                  value={filterAttributes.SleepTime}
                  onChange={handleAttributeChange}
                  className="filter-select mb-4 transparent-dropdown"
                >
                  <option value=""></option>
                  <option value="1">Before 9pm</option>
                  <option value="2">9pm - 11pm</option>
                  <option value="3">11pm - 1am</option>
                  <option value="4">1am - 3am</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="hygiene"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Hygiene:
                </label>
                <select
                  name="Hygiene"
                  value={filterAttributes.Hygiene}
                  onChange={handleAttributeChange}
                  className="filter-select mb-4 transparent-dropdown"
                >
                  <option value=""></option>
                  <option value="OFTEN">often</option>
                  <option value="SOMETIMES">sometimes</option>
                  <option value="NEVER">never</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="guests"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Guests:
                </label>
                <select
                  name="Guests"
                  value={filterAttributes.Guests}
                  onChange={handleAttributeChange}
                  className="filter-select mb-4 transparent-dropdown"
                >
                  <option value=""></option>
                  <option value="OFTEN">often</option>
                  <option value="SOMETIMES">sometimes</option>
                  <option value="NEVER">never</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="personality"
                  className="font-semibold mb-2 text-white"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.05em",
                    textShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Personality:
                </label>
                <select
                  name="Personality"
                  value={filterAttributes.Personality}
                  onChange={handleAttributeChange}
                  className="filter-select mb-4 transparent-dropdown"
                >
                  <option value=""></option>
                  <option value="introvert">introvert</option>
                  <option value="extrovert">extrovert</option>
                  <option value="ambivert">ambivert</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={handleSearchClick}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Show Results
        </button>
      </div>
      <br />
    </div>
  );
};

export default SearchFilter;
