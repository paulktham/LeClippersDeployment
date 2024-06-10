import React from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TimingList from "../components/TimingList";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import the useAuth hook

const Home = ({
  file,
  setFile,
  inputs,
  setInputs,
  handleSubmission,
  navigate,
  credits,
}) => {
  const { userLoggedIn } = useAuth(); // Use the hook to get the userLoggedIn state

  if (!userLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div>
      <Header credits={credits} />
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
