import "./App.css";
import React, { useEffect, useState } from "react";
import Download from "./pages/Download";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import Register from "./pages/Register";
import { db } from "./firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from "./context/authContext";
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

  const { userLoggedIn, currentUser } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (currentUser) {
        // Ensure currentUser is available
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
    // Subtract 3 from the current credits
    const updatedCredits = credits - 3;

    // Update the user's credits in Firestore
    try {
      const userDocRef = doc(db, "user", currentUser.email);
      await setDoc(userDocRef, { credits: updatedCredits }, { merge: true }); // Merge is set to true to update only the credits field
      // Update the local state with the new credits
      setCredits(updatedCredits);
      // Other submission logic
      setInputs([{ start: "", end: "" }]);
    } catch (error) {
      console.error("Error updating user credits:", error);
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
