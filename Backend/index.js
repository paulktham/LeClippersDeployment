const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = 5000;

app.use(
  cors({
    origin: ["https://leclippers.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

const serviceAccount = require("./assets/leclippers1-firebase-adminsdk-7l1br-c93d999ed1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "leclippers1.appspot.com",
});

const bucket = admin.storage().bucket();

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: uploadsDir });

app.use(express.json());

app.use("/videos", express.static(path.join(__dirname, "videos")));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/verifyToken", async (req, res) => {
  const idToken = req.body.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Ensure the 'videos' directory exists
const videosDir = path.join(__dirname, "videos");
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

// Check permissions
fs.access(videosDir, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`${videosDir} is not writable`);
  } else {
    console.log(`${videosDir} is writable`);
  }
});

app.post("/process-video", upload.single("video"), async (req, res) => {
  const { start, end } = req.body;

  const startParts = start.split(":").map(Number);
  const endParts = end.split(":").map(Number);

  const startSeconds = startParts[0] * 60 + (startParts[1] || 0);
  const endSeconds = endParts[0] * 60 + (endParts[1] || 0);

  const duration = endSeconds - startSeconds;

  if (duration <= 0) {
    return res
      .status(400)
      .json({ error: "End time must be greater than start time" });
  }

  const video1Path = path.normalize(req.file.path); // Normalize path
  const video2Path = path.join(__dirname, "videos", "video2.mp4");
  const outputPath = path.join(__dirname, "videos", "output1.mp4");

  console.log(
    `Start: ${start}, End: ${end}, StartSeconds: ${startSeconds}, EndSeconds: ${endSeconds}, Duration: ${duration}`
  );
  console.log(`Video 1 Path: ${video1Path}`);
  console.log(`Video 2 Path: ${video2Path}`);
  console.log(`Output Path: ${outputPath}`);

  try {
    // Ensure the videos directory exists
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir);
    }

    // Download video2 from Firebase Storage
    const file = bucket.file("video2.mp4"); // Replace with the correct path in your Firebase Storage
    await file.download({ destination: video2Path });

    ffmpeg(video1Path)
      .inputOptions([`-ss ${startSeconds}`, `-t ${duration}`])
      .input(video2Path)
      .complexFilter([
        "[0:v]scale=1080:-1[v1]",
        "[1:v]scale=-1:1920/2[v2scaled]",
        "[v2scaled]crop=1080:1920/2[v2cropped]",
        "[v1][v2cropped]vstack=inputs=2,scale=1080:1920[vid];[0:a]anull[a]",
      ])
      .map("[vid]")
      .map("[a]")
      .outputOptions([
        "-c:v libx264",
        "-crf 23",
        "-preset veryfast",
        "-shortest",
      ])
      .on("start", (commandLine) => {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("end", async () => {
        // Delete the uploaded file after processing is complete
        try {
          await fs.promises.unlink(video1Path);
          console.log(`Deleted uploaded file: ${video1Path}`);
        } catch (error) {
          console.error(`Error deleting uploaded file: ${video1Path}`, error);
        }

        res.json({
          message: "Processing complete",
          outputPath: `videos/output1.mp4`, // Provide the full path to the output file
        });
      })
      .on("error", async (err) => {
        console.error("Error processing video:", err);

        // Delete the uploaded file if an error occurs
        try {
          await fs.promises.unlink(video1Path);
          console.log(`Deleted uploaded file due to error: ${video1Path}`);
        } catch (error) {
          console.error(`Error deleting uploaded file: ${video1Path}`, error);
        }

        res.status(500).json({ error: "Video processing failed" });
      })
      .save(outputPath);
  } catch (error) {
    console.error("Error downloading video from Firebase Storage:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
