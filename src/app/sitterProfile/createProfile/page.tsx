import React from "react";

const CreateProfile = () => {
  return (
    <div>
      <p>new profile</p>
      <form className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block mb-1 font-medium text-gray-700"
          >
            Name:
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block mb-1 font-medium text-gray-700"
          >
            City:
            <input
              type="text"
              name="city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your city"
            />
          </label>
        </div>
        <div className="mb-4">
          <label
            htmlFor="rate"
            className="block mb-1 font-medium text-gray-700"
          >
            Rate:
            <input
              type="text"
              name="city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your rate"
            />
          </label>
        </div>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreateProfile;
