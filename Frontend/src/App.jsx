import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Download from "./pages/Download";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { db, storage } from "./firebase/firebase"; // Ensure you have initialized Firebase
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from "./context/authContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState([{ start: "", end: "" }]);
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "user", currentUser.email);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setCredits(userDoc.data().credits);
          }
        } catch (err) {
          console.error("Error fetching user credits:", err);
        }
      }
    };

    fetchUserCredits();
  }, [currentUser]);

  const handleSubmission = async () => {
    if (file) {
      try {
        const storageRef = ref(storage, `${currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const videoURL = await getDownloadURL(storageRef);

        const { start, end } = inputs[0];
        const formData = new FormData();
        formData.append("videoURL", videoURL); // Send video URL
        formData.append("start", start);
        formData.append("end", end);
        formData.append("uid", currentUser.uid);

        const response = await fetch(
          "https://leclippersserver.vercel.app/process-video",
          {
            mode: "no-cors",
            method: "POST",
            body: formData, // Send formData
            credentials: "include", // Include credentials if needed
          }
        );

        const data = await response.json();
        if (response.ok) {
          const updatedCredits = credits - 3;
          const userDocRef = doc(db, "user", currentUser.email);
          await setDoc(
            userDocRef,
            { credits: updatedCredits },
            { merge: true }
          );
          setCredits(updatedCredits);
          setInputs([{ start: "", end: "" }]);

          // Delete the uploaded file from Firebase Storage
          await deleteObject(storageRef);

          navigate("/download", {
            state: { videoUrl: data.outputPath, uid: currentUser.uid },
          });
        } else {
          console.error("Video processing failed:", data.error);
        }
      } catch (error) {
        console.error("Error processing video:", error);
      }
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            file={file}
            setFile={setFile}
            inputs={inputs}
            setInputs={setInputs}
            handleSubmission={handleSubmission}
            navigate={navigate}
            credits={credits}
          />
        }
      />
      <Route path="/download" element={<Download />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
