import react from "react";
import "./App.css";
import useState from "react";

function App() {
  // const [file, setFile] = useState(null);

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile.name);
  //   }
  // };

  // const handleClearFile = () => {
  //   setFile(null);
  // };
  return (
    <>
      <div className="bg-gray-800 p-5 rounded-xl">
        <h1 className="text-3xl font-bold text-white font-mono">LeClippers</h1>
      </div>
      <div className="w-full min-h-screen bg-white items-center justify-center flex">
        <div className="w-[24%] h-auto rounded-md bg-white shadow-md border border-slate-400 p-5">
          <label
            htmlFor="input"
            className="block text-slate-800 text-base font-medium mb-1.5"
          >
            Upload File
          </label>
          <div className="flex items-start w-full">
            <input type="file"></input>
          </div>
        </div>
      </div>
      <div className="bg-gray p-2 border border-red-50 flex justify-evenly">
        <p>timestamps:</p>
        <div>
          <input
            type="text"
            className="bg-gray-500 border border-gray-100 text-white"
          ></input>
          -
          <input
            type="text"
            className="bg-gray-500 border border-gray-100 text-white"
          ></input>
        </div>
      </div>
    </>
  );
}

export default App;
