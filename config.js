// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

module.exports = {
  firebaseConfig: {
    apiKey: "AIzaSyCCXq8jDAgPwNJdZMQUlH7YEPq-K0YaCdI",
    authDomain: "thenodeproject-1dc6c.firebaseapp.com",
    projectId: "thenodeproject-1dc6c",
    storageBucket: "thenodeproject-1dc6c.appspot.com",
    messagingSenderId: "842493677714",
    appId: "1:842493677714:web:e21cb8bbcec1ad9fa6164b",
    measurementId: "G-3WLX89CNT8",
  },
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
