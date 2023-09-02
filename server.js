const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credenlists = require("./key.json");

admin.initializeApp({
    credential:admin.credential.cert(credenlists)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/addUser', async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
          email: req.body.email,
          name: req.body.name,
        };
        const response = await db.collection("users").add(userJson)
        res.send(response)

    } catch(error) {
       res.send(error) 
    }
})




const db = admin.firestore();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log (`server is running on port ${PORT}`)
})

