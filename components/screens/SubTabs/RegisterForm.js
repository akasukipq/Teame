import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, Alert, AsyncStorage, TouchableOpacity } from 'react-native';
import { Item, Input, Icon, Radio, Text } from 'native-base';
import firebase from 'react-native-firebase';

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: ""
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container1}>
                <View style={{ marginTop: 15 }}>
                    <Item>
                        <Icon name="person" style={{ color: "#F3C537" }}></Icon>
                        <Input placeholder="Tên hiển thị..." placeholderTextColor="grey" style={{ color: "white" }}
                            onChangeText={(text) => {
                                this.setState({
                                    name: text
                                })
                            }}></Input>
                    </Item>
                    <Item>
                        <Icon name="mail" style={{ color: "#F3C537" }}></Icon>
                        <Input placeholder="Email..." placeholderTextColor="grey" style={{ color: "white" }}
                            keyboardType="email-address"
                            onChangeText={(text) => {
                                this.setState({
                                    email: text
                                })
                            }}></Input>
                    </Item>
                    <Item style={styles.input}>
                        <Icon name="lock" style={{ color: "#F3C537" }}></Icon>
                        <Input placeholder="Mật khẩu..." placeholderTextColor="grey" style={{ color: "white" }}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text
                                })
                            }}></Input>
                    </Item>
                </View>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                            .then(async () => {
                                //cập nhật tên hiển thị
                                //console.log('thông')
                                let updateName = await firebase.auth().currentUser.updateProfile({
                                    displayName: this.state.name,
                                    photoURL: 'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png'
                                });
                                let token = await AsyncStorage.getItem('fcmToken');
                                //đồng bộ dữ liệu sang collection user
                                var db = firebase.firestore();
                                var uid = firebase.auth().currentUser.uid;
                                db.collection('users').doc(uid).set({
                                    uid: uid,
                                    email: firebase.auth().currentUser.email,
                                    name: firebase.auth().currentUser.displayName,
                                    photoURL: 'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png',
                                    token: token
                                });
                                Alert.alert("Thông báo", "Đăng ký tài khoản thành công!");
                                this.props.nav.navigate("Đăng nhập");
                            })
                            .catch(error => { console.log(error) });
                    }}>
                    <Text>Đăng ký</Text>
                </TouchableOpacity>
            </View>

        );
    }
};

const styles = StyleSheet.create({
    input: {
        marginTop: 10
    },

    container1: {
        backgroundColor: "#21272E",
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        padding: 10,
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#F3C537',
        padding: 10,
        borderRadius: 10
    }
});
