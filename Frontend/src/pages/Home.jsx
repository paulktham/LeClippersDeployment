import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TimingList from "../components/TimingList";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Home = ({
  file,
  setFile,
  inputs,
  setInputs,
  handleSubmission,
  navigate,
  credits,
}) => {
  const { userLoggedIn } = useAuth();
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (file) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
      };
      video.onerror = (error) => {
        console.error("Error loading video: ", error);
        setVideoDuration(null);
      };
    }
  }, [file]);

  if (!userLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div>
      <Header credits={credits} />
      <UploadFile
        file={file}
        setFile={setFile}
        setVideoDuration={setVideoDuration}
        videoRef={videoRef}
      />
      <TimingList
        inputs={inputs}
        setInputs={setInputs}
        handleSubmission={handleSubmission}
        navigate={navigate}
        videoDuration={videoDuration}
      />
    </div>
  );
};

export default Home;
