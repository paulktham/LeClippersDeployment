import React from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TimingList from "../components/TimingList";

const Home = ({
  file,
  handleFileChange,
  handleClearFile,
  inputs,
  handleInputChange,
  addInputs,
  removeInputs,
  handleSubmission,
  navigate,
}) => {
  return (
    <div>
      <Header />
      <UploadFile
        file={file}
        handleFileChange={handleFileChange}
        handleClearFile={handleClearFile}
      />
      <TimingList
        inputs={inputs}
        handleInputChange={handleInputChange}
        addInputs={addInputs}
        removeInputs={removeInputs}
        handleSubmission={handleSubmission}
        navigate={navigate}
      />
    </div>
  );
};

export default Home;
