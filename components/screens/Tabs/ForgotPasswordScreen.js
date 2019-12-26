import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : null
        };
    }

    render() {
        return (
            <View>
                <Text> Nhập email </Text>
                <TextInput placeholder="email..."
                onChangeText={(text) => {
                    this.setState({
                        email: text
                    })
                }}/>
                <TouchableOpacity
                onPress={() => {
                    firebase.auth().sendPasswordResetEmail(this.state.email);
                }}>
                    <Text>Nhận mật khẩu mới</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
