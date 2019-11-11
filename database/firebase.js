import firebase from 'react-native-firebase';

export const TYPE = {
    INCREAMENT: 'INCREAMENT',
    DECREAMENT: 'DECREAMENT',
}

export function SetCountComment(cid, type, num) {
    if(type == TYPE.INCREAMENT) {
        firebase.firestore().collection('cards').doc(cid).update({
            numComment: num + 1
        });
    } else {
        firebase.firestore().collection('cards').doc(cid).update({
            numComment: num - 1
        });
    }
}