// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAaRZ9ZGfezzEwvZ-mx5OMh1qrhdmLyWyQ",
    authDomain: "resumemaker-246db.firebaseapp.com",
    databaseURL: "https://resumemaker-246db.firebaseio.com",
    projectId: "resumemaker-246db",
    storageBucket: "resumemaker-246db.appspot.com",
    messagingSenderId: "435690994945"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var currentUser;
setTimeout(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            // calling other window in here will run abruptly
            if (user) {
                //'printf(user);
                //signed in
                currentUser = user;
                if (document.getElementById('user-photo')) { //to be sure we have such element on this page.
                    document.getElementById('user-photo').src = user.photoURL;
                }
                if (document.getElementById('user-name')) {
                    document.getElementById('user-name').innerHTML = user.displayName;
                }
                if (document.getElementById('user-id')) {
                    document.getElementById('user-id').innerHTML = user.email;
                }
                console.log("runs one time");
            } else {
                //not signed in
                printf('not signed in');
                currentUser = null;
            }
        });
}, 1000);
