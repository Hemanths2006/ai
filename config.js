// config.js
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA62y4HgqjzR4pUmtFOXhgx3Qilmux1kzk",
    authDomain: "chaa-app.firebaseapp.com",
    databaseURL: "https://chaa-app-default-rtdb.firebaseio.com",
    projectId: "chaa-app",
    storageBucket: "chaa-app.firebasestorage.app",
    messagingSenderId: "546070814572",
    appId: "1:546070814572:web:5642d43ee1ad14f455dd49",
    measurementId: "G-1DGFZ7RFLK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
