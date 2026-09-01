import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/profile", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setProfile(result.response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <h1 className="text-lg font-semibold flex justify-center my-[3%]">
        User Profile
      </h1>
      <div className="bg-teal-500 w-[50vw] h-[50vh] mx-[25%]">
        {profile && (
          <>
            <h1 className="font-serif ml-[5rem] pt-[2rem]">Name: {profile.username}</h1>
          </>
        )}
      </div>
    </>
  );
};

export default UserProfile;
