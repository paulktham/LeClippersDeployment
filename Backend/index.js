const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser"); // Add this line
const { Storage } = require("@google-cloud/storage");
const serviceAccount = require("./assets/leclippers1-firebase-adminsdk-7l1br-c93d999ed1.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "leclippers1.appspot.com",
  });
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware for handling CORS
app.use(
  cors({
    origin: "https://leclippers.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Middleware for parsing JSON
app.use(express.json());

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: "leclippers1",
  keyFilename: "./assets/leclippers1-firebase-adminsdk-7l1br-c93d999ed1.json",
});
const bucket = storage.bucket("leclippers1.appspot.com");

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

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

app.options("/process-video", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
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

  const video1Buffer = req.file.buffer;
  const video1Path = path.join("/tmp", req.file.originalname); // Save to a temporary directory

  // Write the uploaded video to a temporary file
  await fs.promises.writeFile(video1Path, video1Buffer);

  const video2Path = path.join("/tmp", "video2.mp4");
  const outputPath = path.join("/tmp", "output1.mp4");

  try {
    // Download the second video from Google Cloud Storage to a temporary path
    await bucket.file("video2.mp4").download({ destination: video2Path });

    // Process the video with ffmpeg
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
        try {
          await fs.promises.unlink(video1Path);
          console.log(`Deleted uploaded file: ${video1Path}`);
        } catch (error) {
          console.error(`Error deleting uploaded file: ${video1Path}`, error);
        }

        // Upload the processed video back to Google Cloud Storage
        await bucket.upload(outputPath, {
          destination: "output1.mp4",
        });

        try {
          await fs.promises.unlink(outputPath);
          console.log(`Deleted output file: ${outputPath}`);
        } catch (error) {
          console.error(`Error deleting output file: ${outputPath}`, error);
        }

        res.json({
          message: "Processing complete",
          outputPath: `output1.mp4`,
        });
      })
      .on("error", async (err) => {
        console.error("Error processing video:", err);
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
    console.error("Error downloading video from Google Cloud Storage:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
