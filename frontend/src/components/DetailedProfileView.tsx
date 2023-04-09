import React, { useEffect, useState, ChangeEvent } from "react";
import gql from "graphql-tag";
import { readAndCompressImage } from "browser-image-resizer";
import { useMutation } from "@apollo/react-hooks";
import Select from "react-select";
import "../styles/pulse.css";
import "./searchfilter.css";

//define types:
type HobbyOption = {
  value: string;
  label: string;
};

type MajorOption = {
  id: number;
  name: string;
};

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
  mutation EditUserProfile($input: UserEditProfile) {
    editUserProfile(input: $input) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

interface FormData {
  username: string;
  email: string;
  biography: string;
  image: string;
  university: string;
  major: string;
  sleepTime: string;
  cleanliness: string;
  smoking: string;
  guests: string;
  pets: string;
  hobbies: string[];
}

interface University {
  name: string;
}

//displays the logged in users profile info and handles edit feature functionality ()
//when the user edits their profile, the edit profile resolver is called which takes the newly
//updated user, executes the recommender (with the updated user obj and its attrs) to update the
//the recommendations document in mongodb with the newly recommended list of users under the same username (find and update)
const DetailedProfileView: React.FC<RecommendationsResultsProps> = ({
  loggedInUser,
}) => {
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateUser, updatedUser] = useMutation(UPDATE_USER);

  // const openDetailedView = (user: User) => {
  //   console.log("user attributes from detailed view", user.name);
  //   setSelectedUser(user);
  // };

  // //can implement a useEffect instead of passing it from the home component

  // const closeDetailedView = () => {
  //   setSelectedUser(null);
  // };

  //console.log("logged in user biography", loggedInUser.bio);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: 300, // Set the fixed width for the control
      color: "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      width: 300, // Set the fixed width for the menu
    }),
    option: (provided: any) => ({
      ...provided,
      color: "black",
    }),
  };

  const [recommendations, setRecommendations] = useState<User[] | any>([]);
  const [majors, setMajors] = useState<MajorOption[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  // const [formData, setFormData] = useState<FormData>({
  //   username: loggedInUser["data"]["userLogin"].username,
  //   email: loggedInUser["data"]["userLogin"].email,
  //   biography: loggedInUser["data"]["userLogin"].bio,
  //   image: loggedInUser["data"]["userLogin"].imgUrl,
  //   university: loggedInUser["data"]["userLogin"].university,
  //   major: loggedInUser["data"]["userLogin"].major,
  //   sleepTime: loggedInUser["data"]["userLogin"].sleepTime,
  //   cleanliness: loggedInUser["data"]["userLogin"].hygiene,
  //   smoking: loggedInUser["data"]["userLogin"].smoking,
  //   guests: loggedInUser["data"]["userLogin"].guests,
  //   pets: loggedInUser["data"]["userLogin"].pets,
  //   hobbies: loggedInUser["data"]["userLogin"].hobbies,
  // });
  const [formData, setFormData] = useState<FormData>({
    username: loggedInUser["data"]["userLogin"].username,
    email: loggedInUser["data"]["userLogin"].email,
    biography: "",
    image: "",
    university: "",
    major: "",
    sleepTime: "",
    cleanliness: "",
    smoking: "",
    guests: "",
    pets: "",
    hobbies: loggedInUser["data"]["userLogin"].hobbies,
  });

  const hobbiesOptions: HobbyOption[] = [
    { value: "reading", label: "Reading" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "traveling", label: "Traveling" },
    { value: "cooking", label: "Cooking" },
    // Add more hobbies options here
  ];

  useEffect(() => {
    // const fetchMajors = async () => {
    //   try {
    //     const response = await fetch("https://your-api-url.com/majors");
    //     const data = await response.json();
    //     setMajors(data);
    //   } catch (error) {
    //     console.error("Error fetching majors:", error);
    //   }
    // };

    // const fetchUniversities = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://universities.hipolabs.com/search?country=United States"
    //     );
    //     const universities = await response.json();
    //     setUniversities(universities);
    //   } catch (error) {
    //     console.error("Error fetching universities:", error);
    //   }
    // };
    const fetchMajors = async () => {
      try {
        const response = await fetch(
          "https://fivethirtyeight.datasettes.com/fivethirtyeight.json?sql=select++Major+as+name%2C+rowid+as+id+from+%5Bcollege-majors%2Fmajors-list%5D+order+by+Major+limit+200"
        );
        const data = await response.json();
        setMajors(data.rows);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/University?limit=3002&order=name",
          {
            headers: {
              "X-Parse-Application-Id":
                "Ipq7xXxHYGxtAtrDgCvG0hrzriHKdOsnnapEgcbe", // This is the fake app's application id
              "X-Parse-Master-Key": "HNodr26mkits5ibQx2rIi0GR9pVCwOSEAkqJjgVp", // This is the fake app's readonly master key
            },
          }
        );
        const universities = await response.json();
        console.log(universities);
        setUniversities(universities.results);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchMajors();
    fetchUniversities();
  }, [0]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const config = {
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        autoRotate: true,
        debug: true,
      };

      try {
        const optimizedImage = await readAndCompressImage(file, config);
        const reader = new FileReader();
        reader.readAsDataURL(optimizedImage);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setFormData({ ...formData, image: reader.result });
          } else {
            throw new Error("Error uploading image");
          }
        };
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    }
  };

  //edit the logged in user :
  const editProfile = async () => {
    console.log("profile being edited", loggedInUser);
    try {
      //the mutation resolver will find the user obj by the passed in username and then update the attributes along with it
      const input = {
        //this variable has to match the defined parameter accepted by the resolver
        username: formData.username,
        email: formData.email,
        biography: formData.biography,
        image: formData.image,
        university: formData.university,
        major: formData.major,
        sleepTime: formData.sleepTime,
        cleanliness: formData.cleanliness,
        smoking: formData.smoking,
        guests: formData.guests,
        pets: formData.pets,
        hobbies: formData.hobbies,
      };
      console.log("username rec view", input);
      //execute the mutation query to return a list of recommended users for the logged in user
      let updatedUser = await updateUser({
        variables: { input }, //the input has to match the input schema type defined in backend
      });
      // console.log("refreshed recommended list of users: ", recommendedUsers);
      console.log(
        "recommended list of users: ",
        updatedUser,
        updatedUser.data.recommendUsers
      );
      setRecommendations(updatedUser.data.recommendUsers); //useState setter to set the returned recommendations
    } catch (error) {
      console.error("Error fetching recommended users:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    console.log("name:", name, " ", "and value", value);
    console.log("form data", formData);
    setFormData({ ...formData, [name]: value });
  };

  const handleHobbiesChange = (selectedOptions: any) => {
    if (selectedOptions.length > 3) {
      // If more than 3 options are selected, show a message or handle the situation as needed
      alert("You can only select up to 3 hobbies.");
      console.log("hobbies", formData.hobbies);
      return;
    } else {
      const selectedHobbies = selectedOptions.map(
        (option: any) => option.value
      );
      setFormData({ ...formData, hobbies: selectedHobbies });
      console.log("hobbies", formData.hobbies);
    }
  };

  return (
    //replace this with the profile info page view with a button that updates the user info
    <div className="flex flex-col h-full">
      <div className="justify-between items-center ">
        <h3
          className="text-2xl font-semibold text-center text-white"
          style={{
            fontFamily: "Roboto, sans-serif",
            letterSpacing: "0.05em",
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          Edit Profile
        </h3>
      </div>
      <hr className="flame border border-black mt-8" />

      {/* <form
        onSubmit={editProfile}
        className=" bg-blue-500 bg-opacity-20 p-6 border-black border-2 rounded-lg shadow-lg w-full max-w-md mx-auto"
        style={{
          marginTop: "2rem", // Adjust this value according to the height of the navbar
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
        }}
      > */}
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <div
          className="overflow-y-auto max-h-screen pt-10"
          style={{
            // marginTop: "2rem", // Adjust this value according to the height of the navbar
            maxHeight: "calc(100vh - 10rem)",
            // scrollbarWidth: "thin",
            // scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Bio:
            </label>

            <div>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
                style={{ backgroundColor: "rgba(240, 240, 240, 0.8)" }}
              />
            </div>
          </div>

          <br />
          <div className="mb-4">
            <label
              htmlFor="ppic"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Profile Image:{" "}
            </label>

            <input
              type="file"
              onChange={handleImageUpload}
              className="mt-1 p-1 w-full border border-gray-300 rounded"
            />
          </div>
          <br />
          <div className="mb-4">
            <label
              htmlFor="hobbies"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Hobbies:
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Select<HobbyOption, true>
                options={hobbiesOptions}
                isMulti
                onChange={handleHobbiesChange}
                placeholder="select upto 3 hobbies"
                maxMenuHeight={formData.hobbies.length < 3 ? 300 : 0} // Set maxMenuHeight to 0 to disable scrolling when 3 hobbies are selected
                value={hobbiesOptions.filter((option) =>
                  formData.hobbies.includes(option.value)
                )}
                styles={customStyles}
              />
            </div>
          </div>
          <br />
          <div className="select-container mb-4">
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
              University:
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="university"
                value={formData.university}
                onChange={handleChange}
              >
                {/* Add university options here */}
                <option value="">Select a university</option>
                {universities.map((university, index) => (
                  // <option key={university.country} value={university.name}>
                  <option key={index} value={university.name}>
                    {university.name}
                  </option>
                ))}
                {/* <option value="university1">University 1</option>
          <option value="university2">University 2</option> */}
              </select>
            </div>
          </div>
          <br />
          <div className=" mb-4">
            <label
              htmlFor="major"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Major:
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="major"
                value={formData.major}
                onChange={handleChange}
              >
                <option value=""></option>
                {majors.map((major) => (
                  <option key={major.id} value={major.name}>
                    {major.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <br />
          <div className=" mb-4">
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
              Sleep Time:{" "}
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="sleepTime"
                value={formData.sleepTime}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="1">Before 9pm</option>
                <option value="2">9pm - 11pm</option>
                <option value="3">11pm - 1am</option>
                <option value="4">1am - 3am</option>
              </select>
            </div>
          </div>

          <br />
          <div className=" mb-4">
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
              Hygiene:{" "}
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="cleanliness"
                value={formData.cleanliness}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="OFTEN">often</option>
                <option value="SOMETIMES">sometimes</option>
                <option value="NEVER">never</option>
              </select>
            </div>
          </div>
          <br />
          <div className=" mb-4">
            <label
              htmlFor="smoke"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Guests:{" "}
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="OFTEN">often</option>
                <option value="SOMETIMES">sometimes</option>
                <option value="NEVER">never</option>
              </select>
            </div>
          </div>
          <br />

          {/* <div className="space-y-4 text-gray-800"> */}
          <div className="mb-4">
            <label
              htmlFor="smoke"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Smoking
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="smoking"
                value={formData.smoking}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </div>
          <br />

          <div className="mb-4">
            <label
              htmlFor="pets"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Pets
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                className="filter-select mb-2 transparent-dropdown"
                name="pets"
                value={formData.pets}
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </div>

          <button
            onClick={editProfile}
            className="bg-blue-800 text-gray-100 px-4 py-2 rounded hover:bg-gray-700 font-semibold"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedProfileView;
