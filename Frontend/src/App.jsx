import "./App.css";
import React, { useState } from "react";
import Download from "./pages/Download";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

const App = () => {
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState([{ start: "", end: "" }]);
  const navigate = useNavigate();

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
    <Routes>
      <Route
        path="/"
        element={
          <Home
            file={file}
            handleFileChange={handleFileChange}
            handleClearFile={handleClearFile}
            inputs={inputs}
            handleInputChange={handleInputChange}
            addInputs={addInputs}
            removeInputs={removeInputs}
            handleSubmission={handleSubmission}
            navigate={navigate}
          />
        }
      />
      <Route path="/download" element={<Download />} />
    </Routes>
  );
};

export default App;
