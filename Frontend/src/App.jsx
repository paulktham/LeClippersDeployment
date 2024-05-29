import "./App.css";
import React, { useState } from "react";
import Timing from "./components/Timing";
import Header from "./components/Header";
import UploadFile from "./components/UploadFile";

function App() {
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState([{ start: "", end: "" }]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile.name);
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  const addInputs = () => {
    setInputs([...inputs, { start: "", end: "" }]);
  };

  const removeInputs = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newInputs = inputs.map((input, i) =>
      i === index ? { ...input, [name]: value } : input
    );
    setInputs(newInputs);
  };

  const handleSubmission = () => {
    setInputs([{ start: "", end: "" }]);
  };

  return (
    <>
      <Header />
      <UploadFile
        file={file}
        handleFileChange={handleFileChange}
        handleClearFile={handleClearFile}
      />
      <div className="bg-gray p-2 border border-red-50 flex justify-evenly bg-red-600 flex-col">
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
          <button onClick={handleSubmission}>Submit</button>
        </div>
      </div>
    </>
  );
}

export default App;
