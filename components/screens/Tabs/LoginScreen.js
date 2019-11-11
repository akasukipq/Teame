import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image
} from 'react-native';
import LoginForm from '../SubTabs/LoginForm';


export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../../public/images/logo.png')} style={styles.logo}></Image>
                    <Text style={styles.title}>Đăng nhập</Text>
                </View>
                <View style={styles.inputContainer}>
                    <LoginForm nav={this.props.navigation} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#184576",
    },
    headerContainer: {
        flex: 4,
        alignItems: "center",
    },
    inputContainer: {
        flex: 6,
        margin: 30,

    },
    title: {
        color: "white",
        fontSize: 20,
        fontFamily: "Segoe UI"
    },
    input: {
        height: 40,
        backgroundColor: "red"
    },
    logo: {
        width: 150,
        height: 150
    }
});
