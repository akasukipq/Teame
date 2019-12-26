const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.joinBoard = functions.firestore.document('requests/{requestId}')
    .onCreate((snap, context) => {
        const document = snap.data();

        //create a notification
        const payload = {
            notification: {
                title: 'Thông báo mới',
                body: document.type == 'invite' ? 'Bạn nhận được lời mời tham gia từ ' + document.from : 'Bạn được thêm vào thẻ' + document.payload.cname,
                sound: 'default'
            },
        };

        const options = {
            priority: 'high',
        };

        return admin.messaging().sendToDevice(document.toToken, payload, options);
    });


