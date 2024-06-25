import React, { useRef } from "react";

const UploadFile = ({ file, setFile }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null); // Add a ref for the video element
  console.log("first change");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Update state with selected file object
      const videoURL = URL.createObjectURL(selectedFile);
      if (videoRef.current) {
        videoRef.current.src = videoURL; // Set video source
      }
    }
  };

  const handleClearFile = () => {
    setFile(null); // Clear selected file state
    if (videoRef.current) {
      videoRef.current.src = ""; // Clear video source
    }
  };

  const handleClear = () => {
    handleClearFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-auto h-auto rounded-md bg-white shadow-md border border-gray-400 p-5 flex items-center justify-center flex-col">
        <label
          htmlFor="fileInput"
          className="block text-gray-800 text-base font-medium mb-1.5"
        >
          Upload File
        </label>
        {file && (
          <video
            controls
            width="80%"
            src={URL.createObjectURL(file)}
            ref={videoRef}
          ></video>
        )}
        <div className="flex flex-col w-full justify-center items-center">
          {file == null && (
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          )}

          {file && (
            <>
              <div>{file.name}</div>
              <div>
                <button
                  onClick={handleClear}
                  className="ml-2 border-2 border-black p-2 m-2 rounded-md bg-gray-400"
                >
                  Clear Video
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
