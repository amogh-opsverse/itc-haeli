import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

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

interface RecommendationsResultsProps {
  loggedInUser: String;
  onToggleView: () => void;
}

//define mutation query to fetch the results
const USER_DETAILS = gql`
  fragment UserDetails on User {
    username
    name
    bio
    email
    similarity
    imgUrl
  }
`;

//define a fragment
// const REC_USER_DETAILS = gql`
//   fragment SimilarityScore on Similarity {
//     similarity
//   }
// `;

//make sure the mutation exists in the backend
const RECOMMEND_USERS = gql`
  mutation UserRecommendations($input: UserRecs) {
    recommendUsers(input: $input) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

const Recommendations: React.FC<RecommendationsResultsProps> = ({
  loggedInUser,
  onToggleView,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [recommendUsers, recommendedUsers] = useMutation(RECOMMEND_USERS);

  const openDetailedView = (user: User) => {
    console.log("user attributes from detailed view", user.name);
    setSelectedUser(user);
  };

  //can implement a useEffect instead of passing it from the home component

  const closeDetailedView = () => {
    setSelectedUser(null);
  };

  const refreshRecs = () => {
    //implment the refresh
    //requests the latest list of recommendations from the backend
  };

  const [recommendations, setRecommendations] = useState<User[] | any>([]);

  //refresh the recommended user list:
  const refreshRecommendations = async () => {
    try {
      const input = {
        //this variable has to match the defined parameter accepted by the resolver
        username: loggedInUser,
      };
      console.log("username rec view", input);
      //execute the mutation query to return a list of recommended users for the logged in user
      let recdUsers = await recommendUsers({
        variables: { input }, //the input has to match the input schema type defined in backend
      });
      console.log("refreshed recommended list of users: ", recommendedUsers);
      console.log(
        "recommended list of users: ",
        recdUsers,
        recdUsers.data.recommendUsers
      );
      setRecommendations(recdUsers.data.recommendUsers); //useState setter to set the returned recommendations
    } catch (error) {
      console.error("Error fetching recommended users:", error);
    }
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

  //fetch recommended users upon initial page load
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const input = {
          //this variable has to match the defined parameter accepted by the resolver
          username: loggedInUser,
        };
        console.log("username rec view", input);
        //execute the mutation query to return a list of recommended users for the logged in user
        let recdUsers = await recommendUsers({
          variables: { input }, //the input has to match the input schema type defined in backend
        });
        console.log("recommended list of users: ", recommendedUsers);
        console.log(
          "recommended list of users: ",
          recdUsers,
          recdUsers.data.recommendUsers
        );
        setRecommendations(recdUsers.data.recommendUsers); //useState setter to set the returned recommendations
      } catch (error) {
        console.error("Error fetching recommended users:", error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div
      className="flex  flex-col h-full"
      style={{ maxHeight: "340px", overflowY: "auto" }}
    >
      <div className="flex flex-wrap justify-between items-start mb-8">
        {recommendations.map((user: any) => (
          <div
            key={user.username}
            className=" p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg"
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
              {(parseFloat(user.similarity) * 100).toFixed(2)}% match
            </h3>

            {/* Render other user attributes here */}
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
            <h3>Hygiene: {selectedUser.username}</h3>
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
          onClick={refreshRecommendations}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* {showResults ? "Go back to search filter" : "Show results"} */}
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
