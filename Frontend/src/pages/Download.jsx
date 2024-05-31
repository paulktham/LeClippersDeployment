import React from "react";
import Header from "../components/Header";
import dogImage from "../assets/dog.jpg";

const Download = () => {
  const downloadFile = () => {
    alert("Download started!");

    const link = document.createElement("a"); // Create a link element
    link.href = dogImage;
    link.download = "dog.jpg"; // Set the file name
    document.body.appendChild(link); // Append the link to the document body
    link.click(); // Programmatically click the link to trigger the download
    document.body.removeChild(link); // Remove the link from the document
  };
  return (
    <>
      <Header />
      <div className="container">
        <button type="button" onClick={downloadFile}>
          Download
        </button>
      </div>
    </>
  );
};

export default Download;
