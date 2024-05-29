import React from "react";

const UploadFile = ({ file, handleFileChange, handleClearFile }) => {
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
          <input id="fileInput" type="file" onChange={handleFileChange} />
          {file && (
            <button onClick={handleClearFile} className="ml-2">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
