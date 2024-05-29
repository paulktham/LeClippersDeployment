import React from "react";

const Timing = ({ addInputs }) => {
  return (
    <div>
      <input
        type="text"
        className="bg-gray-500 border border-gray-100 text-white"
        placeholder="time-start"
      />
      -
      <input
        type="text"
        className="bg-gray-500 border border-gray-100 text-white"
        placeholder="time-end"
      />
      <button onClick={addInputs}>Add</button>
    </div>
  );
};

export default Timing;
