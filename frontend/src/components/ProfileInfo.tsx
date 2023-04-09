// ProfileSetup.tsx

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import internal from "stream";
import Select from "react-select";
import { GroupBase, OptionProps } from "react-select";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import backgroundPic from "../assets/thanatopsis.jpg";
import { readAndCompressImage } from "browser-image-resizer";

// import "./profileinfo.css";

type HobbyOption = {
  value: string;
  label: string;
};

type MajorOption = {
  id: number;
  name: string;
};
// type HobbyGroup = GroupBase<HobbyOption> & {
//   options: HobbyOption[];
// };

interface FormData {
  username: string;
  email: string;
  password: string;
  name: string;
  biography: string;
  image: string;
  university: string;
  gender: string;
  major: string;
  smoking: string;
  sleepTime: string;
  cleanliness: string;
  guests: string;
  pets: string;
  personality: string;
  hobbies: string[];
}

interface University {
  name: string;
  // country: string;
  // city?: string;
  // state?: string;
  // web_pages?: string[];
}

const USER_DETAILS = gql`
  fragment UserDetails on User {
    username
    # username
    email
    #firstName
    #vaccinated @client
  }
`;

const CREATE_PROFILE = gql`
  mutation CreateUserProfile($input: UserProfile!) {
    addUserProfile(input: $input) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

const ProfileInfo: React.FC = () => {
  const navigate = useNavigate();
  const [createProfile, newProfile] = useMutation(CREATE_PROFILE);

  //taking state userinput from signup page
  const location = useLocation();
  const input = location.state;
  console.log("stateUsername", input);

  const [formData, setFormData] = useState<FormData>({
    username: input["input"].username,
    email: input["input"].email,
    password: input["input"].password,
    name: "",
    biography: "",
    personality: "",
    gender: "",
    image: "",
    university: "",
    major: "",
    smoking: "",
    sleepTime: "",
    cleanliness: "",
    guests: "",
    pets: "",
    hobbies: [],
  });
  console.log("form data Username", formData.username);

  //const [majorsList, setMajors] = useState([]);
  const [majors, setMajors] = useState<MajorOption[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  //const [selectedHobbies, setSelectedHobbies] = useState([]);

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

  const hobbiesOptions: HobbyOption[] = [
    { value: "reading", label: "Reading" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "traveling", label: "Traveling" },
    { value: "cooking", label: "Cooking" },
    // Add more hobbies options here
  ];

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const {
        username,
        email,
        password,
        name,
        biography,
        personality,
        university,
        gender,
        image,
        major,
        smoking,
        sleepTime,
        cleanliness,
        guests,
        pets,
        hobbies,
      } = formData; //destructuring the data to be passed as a req in createUser
      //graphql req: input payload
      const input = {
        username, //this value has to be passed in from the signup flow to establish the relationship
        email,
        password,
        name,
        biography,
        personality,
        university,
        gender,
        image,
        major,
        smoking,
        sleepTime,
        cleanliness,
        guests,
        pets,
        hobbies,
        //createdAt,
      };
      const response = await createProfile({
        variables: { input }, //the input has to match the input schema type defined in backend
      });
      console.log("API response:", response.data);
      console.log("API response:", newProfile);

      //navigate("/profile-setup"); navigate to either login page or home page
      // You can handle the response data here, e.g., show success message, redirect, etc.
    } catch (error) {
      console.error("API error:", error);
      // Handle the error, e.g., show error message, etc.
    }
    console.log("Form submitted:", formData);
    console.log("image", formData.image);
    console.log("Form submitted:", formData);
    navigate("/login");
  };

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

  return (
    // <div className="bg-cover bg-black bg-center text-black-800 bg-fixed min-h-screen flex items-center justify-center">
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundPic})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-blue-500 bg-opacity-20 p-6 border-black border-2 rounded-lg shadow-lg w-full max-w-md mx-auto"
        style={{
          marginTop: "6rem", // Adjust this value according to the height of the navbar
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
        }}
      >
        <div
          className="overflow-y-auto max-h-screen pt-32"
          style={{
            // marginTop: "2rem", // Adjust this value according to the height of the navbar
            maxHeight: "calc(100vh - 10rem)",
            // scrollbarWidth: "thin",
            // scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
          }}
        >
          <div className="mb-4 ">
            <label
              htmlFor="name"
              className="font-semibold mb-2 text-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.05em",
                textShadow:
                  "0px 2px 4px rgba(0, 0, 0, 0.5), 0px 4px 6px rgba(0, 0, 0, 0.25)",
              }}
            >
              Name:{" "}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <br />
          <div className=" mb-4">
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
              Gender:{" "}
            </label>

            <select
              className="mt-1 p-1 w-full border border-gray-300 rounded"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="male">male</option>
              <option value="female">female</option>
              {/* <option value="3">11pm - 1am</option>
              <option value="4">1am - 3am</option> */}
            </select>
          </div>
          <br />
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
              Short Biography:{" "}
            </label>

            <div>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded h-32"
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
                className="mt-1 p-1 w-full border border-gray-300 rounded"
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
                className="mt-1 p-1 w-full border border-gray-300 rounded"
                name="major"
                value={formData.major}
                onChange={handleChange}
              >
                <option value="">Select a major</option>
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

            <select
              className="mt-1 p-1 w-full border border-gray-300 rounded"
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
          <br />
          <div className=" mb-4">
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
              Personality:{" "}
            </label>

            <select
              className="mt-1 p-1 w-full border border-gray-300 rounded"
              name="personality"
              value={formData.personality}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="introvert">introvert</option>
              <option value="extrovert">extrovert</option>
              <option value="ambivert">ambivert</option>
            </select>
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
              How often do you clean?
            </label>

            <select
              className="mt-1 p-1 w-full border font-greek border-gray-300 rounded"
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
              How often do you have guests over?:{" "}
            </label>

            <select
              className="mt-1 p-1 w-full border font-greek border-gray-300 rounded"
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
              Do you smoke?
            </label>
            <select
              className="mt-1 p-1 w-full border font-greek border-gray-300 rounded"
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
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
              Do you have pets?
            </label>
            <select
              className="mt-1 p-1 w-full border font-greek border-gray-300 rounded"
              name="pets"
              value={formData.pets}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gray-800 text-gray-100 px-4 py-2 rounded hover:bg-gray-700 font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
