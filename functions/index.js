const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.joinBoard = functions.firestore.document('requests/{requestId}')
.onCreate((snap, context)=> {
    const document = snap.data();

    //create a notification
    const payload = {
        notification: {
            title: 'Thông báo mới',
            body: 'Bạn nhận được lời mời tham gia từ ' + document.from,
            sound: 'default'
        },
    };

    const options = {
        priority: 'high',
    };

    return admin.messaging().sendToDevice(document.toToken, payload, options);
});


