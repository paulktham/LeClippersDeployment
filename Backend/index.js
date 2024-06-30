const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const os = require("os");
const fetch = require("node-fetch");
const serviceAccount = require("./assets/leclippers1-firebase-adminsdk-7l1br-c93d999ed1.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "leclippers1.appspot.com",
  });
}

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://leclippers.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("/process-video", cors(corsOptions));

const bucket = admin.storage().bucket();

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

const upload = multer();

app.post("/process-video", upload.none(), async (req, res) => {
  const { videoURL, start, end, uid } = req.body;

  // Respond immediately to the client
  res.json({ message: "Video processing started" });

  // Asynchronous video processing
  processVideo(videoURL, start, end, uid);
});

const processVideo = async (videoURL, start, end, uid) => {
  try {
    console.log("Server side video with start:", start, "and end:", end); // Log inputs

    const startParts = start.split(":").map(Number);
    const endParts = end.split(":").map(Number);

    const startSeconds = startParts[0] * 60 + (startParts[1] || 0);
    const endSeconds = endParts[0] * 60 + (endParts[1] || 0);

    const duration = endSeconds - startSeconds;

    if (duration <= 0) {
      console.error("End time must be greater than start time");
      return;
    }

    const tempDir = os.tmpdir();
    const video1Path = path.join(tempDir, "input.mp4");

    const video1Response = await fetch(videoURL);
    const video1Buffer = await video1Response.buffer();
    await fs.promises.writeFile(video1Path, video1Buffer);

    const video2Path = path.join(__dirname, "videos", "video2.mp4");
    const outputPath = path.join(tempDir, "output1.mp4");

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
          const destination = `${uid}.output.mp4`;
          await bucket.upload(outputPath, { destination });

          fs.unlinkSync(video1Path);
          fs.unlinkSync(outputPath);

          console.log("Processing complete, file uploaded to:", destination);
        } catch (error) {
          console.error("Error uploading to Firebase:", error);
        }
      })
      .on("error", (err) => {
        console.error("Error processing video:", err);
        fs.unlinkSync(video1Path);
      })
      .save(outputPath);
  } catch (error) {
    console.error("Error:", error);
  }
};

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.setTimeout(600000); // Set timeout to 10 minutes
