import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import $ from "jquery";
import lightGallery from 'lightgallery';

var firebaseConfig = {
  apiKey: "AIzaSyBtbZHrKJBKAXsdjCHui0V2wFX9WI4YVvQ",
  authDomain: "pmmweekend2020.firebaseapp.com",
  databaseURL: "https://pmmweekend2020.firebaseio.com",
  projectId: "pmmweekend2020",
  storageBucket: "pmmweekend2020.appspot.com",
  messagingSenderId: "58304417191",
  appId: "1:58304417191:web:ca757a7b4341e4b396fa82"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let firebaseFunct = () => {
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var imagesRef = storageRef.child("images");
  var container = $("<div />").attr('id', 'lightgallery');

  // Get the download URL
  imagesRef.listAll()
    // imagesRef.getDownloadURL()
    .then(res => {
      // Insert url into an <img> tag to "download"
      //can set a pagnation to show a certain amount of photos before hitting next..to save space on site
      res.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          console.log("photo-url", url);
          // document.querySelector("img").src = url;
          container.append(`<img src=${url} />`);
          $(".photos").append(container);
        });
      });
    })
    .catch(function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;

        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    });
};

export default firebaseFunct;
