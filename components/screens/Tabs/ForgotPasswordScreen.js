import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import {Text, Item, Icon, Input } from 'native-base';


export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null
        };
    }

    render() {
        return (
            <View style={styles.container} >
                <View></View>
                <View>
                    <Item>
                        <Icon active name='mail' style={{ color: "#F3C537" }} />
                        <Input placeholder='Nhập email...' 
                        onChangeText={(text) => {
                            this.setState({
                                email: text
                            })
                        }}/>
                    </Item>
                </View>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        firebase.auth().sendPasswordResetEmail(this.state.email);
                    }}>
                    <Text>Gửi mật khẩu qua mail</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#21272E",
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        padding: 30,
    },
    
    button:{
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: '#F3C537',
        padding: 10,
        borderRadius: 10
    }

});
