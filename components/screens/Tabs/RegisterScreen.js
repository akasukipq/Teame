import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import RegisterForm from '../SubTabs/RegisterForm';


export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../../public/images/logo.png')} style={styles.logo}></Image>
                    <Text style={styles.title}>Đăng ký</Text>
                </View>
                <View style={styles.inputContainer}>
                    <RegisterForm nav={this.props.navigation} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#21272E",
    },
    headerContainer: {
        flex: 3,
        alignItems: "center",
    },
    inputContainer: {
        flex: 7,
        justifyContent: 'center',
        margin:20,

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
