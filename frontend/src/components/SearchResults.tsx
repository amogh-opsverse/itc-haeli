import React, { useState } from "react";
import "../styles/search.css";

// Assuming that each user has an id, name, and other attributes
interface User {
  username: string;
  name: string;
  email: string;
  hygiene: string;
  sleepTime: string;
  smoking: string;
  pets: string;
  personality: string;
  gender: string;
  major: string;
  university: string;
  bio: string;
  imgUrl: string;
}

interface SearchResultsProps {
  results: User[];
  onToggleView: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onToggleView,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openDetailedView = (user: User) => {
    console.log("user attributes from detailed view", user.username);
    setSelectedUser(user);
  };

  const closeDetailedView = () => {
    setSelectedUser(null);
  };

  function getSleepTimeDescription(sleepTime: any) {
    switch (sleepTime) {
      case "1":
        return "Before 9pm";
      case "2":
        return "9pm-11pm";
      case "3":
        return "11pm-1am";
      case "4":
        return "1am-3am";
    }
  }

  //update view to show similarity score for each user.
  return (
    <>
      <div>
        <button
          onClick={onToggleView}
          className="mt-4 mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* {showResults ? "Go back to search filter" : "Show results"} */}
          Back
        </button>
      </div>
      <hr className="flame border border-t mt-8" />
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: "225px", overflowY: "auto" }}
      >
        <div className="flex flex-wrap justify-between items-start mb-8">
          {results.map((user) => (
            <div
              key={user.username}
              className=" border-black p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg"
              onClick={() => openDetailedView(user)}
            >
              {/* <h3
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              {user.name}
            </h3>

            <h3
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              {user.username}
            </h3> */}
              <div className="rounded-full mb-16 h-24 w-24 mx-auto mb-4 ">
                <img
                  //src={profPic}
                  src={user.imgUrl}
                  alt="Profile"
                  className="rounded-full h-full w-full object-cover"
                />
              </div>
              <h3
                className="font-semibold mb-2 text-white"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  letterSpacing: "0.05em",
                  textShadow:
                    "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
                }}
              >
                {user.name}
              </h3>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">
                User: {selectedUser.username}{" "}
              </h2>
              <div className="rounded-full mb-16 h-24 w-24 mx-auto mb-4 ">
                <img
                  //src={profPic}
                  src={selectedUser.imgUrl}
                  alt="Profile"
                  className="rounded-full h-full w-full object-cover"
                />
              </div>
              <h3>Name: {selectedUser.name}</h3>
              <h3>Bio: {selectedUser.bio}</h3>
              <h3>Email: {selectedUser.email}</h3>
              <h3>Personality: {selectedUser.personality}</h3>
              <h3>Hygiene: {selectedUser.hygiene}</h3>
              <h3>University: {selectedUser.university}</h3>
              <h3>Major: {selectedUser.major}</h3>
              <h3>
                Sleep Time: {getSleepTimeDescription(selectedUser.sleepTime)}
              </h3>
              <h3>Smokes: {selectedUser.smoking}</h3>
              <h3>Has Pets: {selectedUser.pets}</h3>
              {/* Render more detailed user attributes here */}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
                onClick={closeDetailedView}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* <div>
          <button
            onClick={onToggleView}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
        </div> */}
      </div>
    </>
  );
};

export default SearchResults;
