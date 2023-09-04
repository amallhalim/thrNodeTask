const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const cors = require("cors");
const credenlists = require("./key.json");
const axios = require("axios");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });
//server port
app.use(express.json());
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

admin.initializeApp({
  credential: admin.credential.cert(credenlists),
  storageBucket: "thenodeproject-1dc6c.appspot.com",
});
//intialize
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore(); // Initialize Firestore here



//add new file
app.post("/addfile", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;

    const data = {
      name: image.originalname,
      imageURL: image.path,
    };
    const response = await db.collection("AllFiles").add(data);
    // console.log(response);
    res.send("done");
  } catch (error) {
    res.send(error);
  }
});
//update files
app.put("/updateFiles/:id", upload.single("image"), async (req, res) => {
  try {
    const fileId = req.params.id;
    console.log("fileId", fileId);
    // Assuming the uploaded file is stored
    const fileData = req.file;
    console.log("fileData", fileData);
    if (!fileData) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileDoc = await db.collection("AllFiles").doc(fileId).get();

    if (!fileDoc.exists) {
      res
        .status(404)
        .json({ message: "  File that you want to update it  not found" });
      return;
    }

    // Update the file data in the database
    await db
      .collection("AllFiles")
      .doc(fileId)
      .update({ imageURL: fileData.path, name: fileData.originalname });

    res.json({ message: "File updated successfully" });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

//get All files
app.get("/getAllFiles", async (req, res) => {
  try {
    const files = await db.collection("AllFiles").get();
    let allFiles = [];

    files.forEach(doc => {
      allFiles.push();
      allFiles.push(doc.data());
    });

    res.json(allFiles);
  } catch (error) {
    res.send(error);
  }
});

//get file
app.get("/getSingleFile", async (req, res) => {
  const fileId = req.body.id;
  const fileRef = db.collection("AllFiles").doc(fileId);
  const fileSnapshot = await fileRef.get();

  if (!fileSnapshot.exists) {
    return res.status(404).send("File not found");
  }

  const file = fileSnapshot.data();
  res.send(file);
});
//delete file
app.get("/deletefile/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileDoc = await db.collection("AllFiles").doc(fileId).get();

    if (!fileDoc.exists) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    const fileData = fileDoc.data();
    await db.collection("AllFiles").doc(fileId).delete();

    res.json(fileData);
  } catch (error) {
    res.status(500).send(error);
  }
});
// ---------------------------------------------------
// API for shorting link
app.post("/ShorteningURL", async (req, res) => {
  try {
    const LongUrl = ` https://api.shrtco.de/v2/shorten?url=${req.query.url}/u/0/project/thenodeproject-1dc6c/firestore/data/~2Fimages~2FT4aSvZ7w4ne5yCHvYqDx/very/long/link.html`;
    // Make an Axios request to the shortening service
    const axiosresponse = await axios.post(LongUrl);
    // Save the shortened URL in the database
    const new_short_link = axiosresponse.data.result.full_short_link;
    await db.collection("Urls").add({ new_short_link });
    res.send(new_short_link);
  } catch (error) {
    res.send(error);
  }
});

