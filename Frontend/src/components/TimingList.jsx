import React from "react";

const TimingList = ({
  inputs,
  handleInputChange,
  addInputs,
  removeInputs,
  handleSubmission,
  navigate,
}) => {
  const onSubmit = () => {
    handleSubmission();
    navigate("/download");
  };

  return (
    <div className="bg-gray p-2 border border-red-50 flex justify-between bg-red-600 flex-col">
      <div>
        <p>timestamps:</p>
      </div>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            type="text"
            name="start"
            value={input.start}
            onChange={(e) => handleInputChange(index, e)}
            className="bg-gray-500 border border-gray-100 text-white"
            placeholder="time-start"
          />
          -
          <input
            type="text"
            name="end"
            value={input.end}
            onChange={(e) => handleInputChange(index, e)}
            className="bg-gray-500 border border-gray-100 text-white"
            placeholder="time-end"
          />
          <button onClick={addInputs}>Add</button>
          {inputs.length > 1 && (
            <button onClick={() => removeInputs(index)}>Delete</button>
          )}
        </div>
      ))}
      <div className="flex justify-evenly">
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TimingList;
