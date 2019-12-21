const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');
admin.initializeApp();

// [START init_algolia]
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = '0WE9D7D4HB';
const ALGOLIA_ADMIN_KEY = '4370dcff42f3ccea85512f5333952c7a';

const ALGOLIA_INDEX_NAME = 'board_search';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

// Update the search index every time a blog post is written.
exports.onBoardCreate = functions.firestore.document('boards/{boardId}').onCreate((snap, context) => {
    // Get the note document
    const board = snap.data();
  
    // Add an 'objectID' field which Algolia requires
    board.objectID = context.params.boardId;
  
    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(board);
  });
  

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


