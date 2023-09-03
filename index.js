const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const admin = require("firebase-admin");
const credenlists = require("./key.json");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

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

//add new user
app.post("/addUser", async (req, res) => {
  try {
    const userJson = {
      email: req.body.email,
      name: req.body.name,
    };
    const response = await db.collection("users").add(userJson);
    // console.log(response);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});
//get All User
app.get("/user", async (req, res) => {
  try {
    console.log(req.body);
    const usersRef = db.collection("users");
    const response = await usersRef.get();
    // console.log(response);
    let responsArr = [];
    response.forEach(doc => {
      responsArr.push();
      responsArr.push(doc.data());
    });

    res.send(responsArr);
  } catch (error) {
    res.send(error);
  }
});

//update
app.post("/update", async (req, res) => {
  try {
    const id = req.body.id;
    const newName = "hello world ---";
    const usersRef = db.collection("users").doc(id).update({ name: newName });
    res.send(usersRef);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
//delete

app.delete("/delete", async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// API for shorting link
app.post("/Shortening", async (req, res) => {
  try {
    const LongUrl = ` https://api.shrtco.de/v2/shorten?url=${req.query.url}/u/0/project/thenodeproject-1dc6c/firestore/data/~2Fimages~2FT4aSvZ7w4ne5yCHvYqDx/very/long/link.html`;
    // Make an Axios request to the shortening service
    const axiosresponse = await axios.post(LongUrl);
    // Save the shortened URL in the database
    const new_short_link = axiosresponse.data.result.full_short_link;
    const response = await db.collection("Urls").add({ new_short_link });
    res.send(new_short_link);
  } catch (error) {
    res.send(error);
  }
});

// Get a reference to the storage service, which is used to create references in your storage bucket

//add new user
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
    
    const updatedFileData = {
      image: req.file.path, // Assuming the uploaded file is stored in the "path" property of the "req.file" object
    }; console.log("updatedFileData", updatedFileData);
    
        const fileRef = db.collection("AllFiles").doc(fileId);
        const fileSnapshot = await fileRef.get();

        if (!fileSnapshot.exists) {
          return res.status(404).send("File not found");
        }
      await fileRef.update(updatedFileData);
      res.status(200).send("File updated successfully");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
app.delete("/deletefile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const fileRef = db.collection("AllFiles").doc(id);
    const file = await fileRef.get();
      console.log(file);
    if (!file.exists) {
      res.status(404).send("File not found");
      return;
    }
    // Delete the file from storage
    const imageURL = file.data().imageURL;
    await admin.storage().bucket().file(imageURL).delete();
    // Delete the file document from Firestore
    await fileRef.delete();
  } catch (error) {
    res.status(500).send(error);
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

