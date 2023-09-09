const admin = require("firebase-admin");
const credenlists = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credenlists),
  storageBucket: "thenodeproject-1dc6c.appspot.com",
});

const db = admin.firestore(); // Initialize Firestore here

module.exports = { db };
