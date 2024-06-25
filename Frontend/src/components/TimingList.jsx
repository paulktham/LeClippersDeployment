import React, { useCallback, useEffect } from "react";

const TimingList = ({ inputs, setInputs, handleSubmission, videoDuration }) => {
  const validateTime = useCallback(
    (time) => {
      const [minutes, seconds] = time.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds;
      console.log(
        `Validating time: ${time} -> ${totalSeconds} against duration: ${videoDuration}`
      );
      return totalSeconds <= videoDuration;
    },
    [videoDuration]
  );

  const onSubmit = useCallback(() => {
    const allValid = inputs.every(
      (input) => validateTime(input.start) && validateTime(input.end)
    );
    console.log("All inputs valid:", allValid);
    if (allValid) {
      handleSubmission();
    } else {
      alert("Please enter valid times within the video duration.");
    }
  }, [inputs, handleSubmission, validateTime]);

  const addInputs = useCallback(() => {
    setInputs((prevInputs) => [...prevInputs, { start: "", end: "" }]);
  }, [setInputs]);

  const removeInputs = useCallback(
    (index) => {
      setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
    },
    [setInputs]
  );

  const handleInputChange = useCallback(
    (index, event) => {
      const { name, value } = event.target;
      setInputs((prevInputs) => {
        const newInputs = [...prevInputs];
        newInputs[index] = { ...newInputs[index], [name]: value };
        return newInputs;
      });
    },
    [setInputs]
  );

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
            placeholder="min:sec"
          />
          -
          <input
            type="text"
            name="end"
            value={input.end}
            onChange={(e) => handleInputChange(index, e)}
            className="bg-gray-500 border border-gray-100 text-white"
            placeholder="min:sec"
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
