import { StyleSheet } from 'react-native';

export const bigStyles = StyleSheet.create({
    animatedView: {
        width: 20,
        height: 20,
        backgroundColor: "black",
        zIndex: 2

    },
    container: {
        padding: 10,
        borderWidth: 1,
    },
    tag: {
        width: 60,
        height: 20,
        backgroundColor: 'green'
    },
    section: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionSec: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    showdeadline: {
        marginLeft: 5,
    },
    subcolor: {
        color: '#8492A6'
    },
    showInfo: {
        flexDirection: 'row'
    },
    member: {
        flexDirection: 'row'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: 'green'
    },
});