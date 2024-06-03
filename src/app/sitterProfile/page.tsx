import React from "react";

const SitterProfile = () => {
  return (
    <div>
      <a
        href="/sitterProfile/createProfile"
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Create Profile
      </a>

      <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-blue-600">
        Browse Profile
      </button>
    </div>
  );
};

export default SitterProfile;
