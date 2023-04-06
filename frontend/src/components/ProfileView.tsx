import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

// Assuming that each user has an id, name, and other attributes
interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
}

interface RecommendationsResultsProps {
  //results: User[];
  loggedInUser: any;
  onToggleView: () => void;
}

//define mutation query to update the profile
const USER_DETAILS = gql`
  fragment UserDetails on User {
    username
    name
    bio
    email
  }
`;

//make sure the mutation exists in the backend
const UPDATE_USER = gql`
  mutation UserRecommendations($input: UserRecs) {
    recommendUsers(input: $input) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

//displays the logged in users profile info and handles edit feature functionality ()
//when the user edits their profile, the edit profile resolver is called which takes the newly
//updated user, executes the recommender (with the updated user obj and its attrs) to update the
//the recommendations document in mongodb with the newly recommended list of users under the same username (find and update)
const ProfileView: React.FC<RecommendationsResultsProps> = ({
  loggedInUser,
  onToggleView,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateUser, updatedUser] = useMutation(UPDATE_USER);

  const openDetailedView = (user: User) => {
    console.log("user attributes from detailed view", user.name);
    setSelectedUser(user);
  };

  //can implement a useEffect instead of passing it from the home component

  const closeDetailedView = () => {
    setSelectedUser(null);
  };

  const [recommendations, setRecommendations] = useState<User[] | any>([]);

  //edit the logged in user :
  const editProfile = async () => {
    console.log("profile being edited", loggedInUser);
    try {
      const input = {
        //this variable has to match the defined parameter accepted by the resolver
        username: loggedInUser,
      };
      console.log("username rec view", input);
      //execute the mutation query to return a list of recommended users for the logged in user
      let recdUsers = await updateUser({
        variables: { input }, //the input has to match the input schema type defined in backend
      });
      // console.log("refreshed recommended list of users: ", recommendedUsers);
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

  //fetch recommended users upon initial page load

  return (
    <div className="flex  flex-col h-full">
      <div className="flex flex-wrap justify-between items-start mb-8">
        {recommendations.map((user: any) => (
          <div
            key={user.username}
            className="border border-2 border-black p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => openDetailedView(user)}
          >
            <h3>{user.name}</h3>

            {/* Render other user attributes here */}
          </div>
        ))}
      </div>

      {selectedUser && ( //if selectedUser exists, the following component will be rendered
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{selectedUser.name}</h2>
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
          onClick={editProfile}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* {showResults ? "Go back to search filter" : "Show results"} */}
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
