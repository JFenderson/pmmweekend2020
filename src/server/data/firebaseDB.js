import admin from '../util/firebase.init';




// Get a reference to the storage service, which is used to create references in your storage bucket
var photoDb = admin.storage();
// Create a storage reference from our storage service
// var storageRef = photoDb.ref();
// // Create a child reference
// var imagesRef = storageRef.child('images');
// // imagesRef now points to 'images'


module.exports = photoDb;