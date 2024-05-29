import React, { useRef } from "react";

const UploadFile = ({ file, handleFileChange, handleClearFile }) => {
  const fileInputRef = useRef(null);

  const handleClear = () => {
    handleClearFile();
    fileInputRef.current.value = null; // Reset file input
  };

  return (
    <div className="w-full min-h-screen bg-white items-center justify-center flex">
      <div className="w-[24%] h-auto rounded-md bg-white shadow-md border border-slate-400 p-5">
        <label
          htmlFor="fileInput"
          className="block text-slate-800 text-base font-medium mb-1.5"
        >
          Upload File
        </label>
        <div className="flex items-start w-full">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {file && (
            <button onClick={handleClear} className="ml-2">
              Clear
            </button>
          )}
        </div>
        {file && <div className="mt-2">Selected File: {file}</div>}
      </div>
    </div>
  );
};

export default UploadFile;
