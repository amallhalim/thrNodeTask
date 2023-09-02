const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credenlists = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credenlists),
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = admin.firestore(); // Initialize Firestore here

//add new user
app.post("/addUser", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      name: req.body.name,
    };
    const response = await db.collection("users").add(userJson);
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
    console.log(response);
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
app.delete("/delete/:id", async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log (`server is running on port ${PORT}`)
})

