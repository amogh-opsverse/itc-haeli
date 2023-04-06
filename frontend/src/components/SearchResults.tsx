import React, { useState } from "react";

// Assuming that each user has an id, name, and other attributes
interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
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

  //update view to show similarity score for each user.
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-start mb-8">
        {results.map((user) => (
          <div
            key={user.username}
            className="border-4 border-black p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => openDetailedView(user)}
          >
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
            </h3>

            {/* Render other user attributes here */}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{selectedUser.name}</h2>
            <h3>User: {selectedUser.username}</h3>
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
      <div>
        <button
          onClick={onToggleView}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* {showResults ? "Go back to search filter" : "Show results"} */}
          Back
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
