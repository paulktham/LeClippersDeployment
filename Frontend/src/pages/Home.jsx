import React from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TimingList from "../components/TimingList";

const Home = ({
  file,
  setFile,
  inputs,
  setInputs,
  handleSubmission,
  navigate,
}) => {
  return (
    <div>
      <Header />
      <UploadFile file={file} setFile={setFile} />
      <TimingList
        inputs={inputs}
        setInputs={setInputs}
        handleSubmission={handleSubmission}
        navigate={navigate}
      />
    </div>
  );
};

export default Home;
