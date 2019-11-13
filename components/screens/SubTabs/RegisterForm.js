import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, AsyncStorage } from 'react-native';
import { Item, Input, Icon, Radio } from 'native-base';
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
            <View style={styles.container}>
                <View>
                    <View>
                        <Item>
                            <Icon name="person" style={{ color: "#184576" }}></Icon>
                            <Input placeholder="Tên hiển thị..." placeholderTextColor="grey"
                                onChangeText={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}></Input>
                        </Item>
                        <Item>
                            <Icon name="person" style={{ color: "#184576" }}></Icon>
                            <Input placeholder="Email..." placeholderTextColor="grey"
                                keyboardType="email-address"
                                onChangeText={(text) => {
                                    this.setState({
                                        email: text
                                    })
                                }}></Input>
                        </Item>
                        <Item style={styles.input}>
                            <Icon name="lock" style={{ color: "#184576" }}></Icon>
                            <Input placeholder="Mật khẩu..." placeholderTextColor="grey"
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text
                                    })
                                }}></Input>
                        </Item>
                    </View>
                    <View style={{ flexDirection: "row-reverse", marginTop: 20 }}>
                        <Button title="Đăng ký" color="#184576"
                            onPress={() => {
                                firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                                    .then(async () => {
                                        //cập nhật tên hiển thị
                                        //console.log('thông')
                                        let updateName = await firebase.auth().currentUser.updateProfile({
                                            displayName: this.state.name,
                                        });
                                        let token = await AsyncStorage.getItem('fcmToken');
                                        //đồng bộ dữ liệu sang collection user
                                        var db = firebase.firestore();
                                        var uid = firebase.auth().currentUser.uid;
                                        db.collection('users').doc(uid).set({
                                            uid: uid,
                                            email: firebase.auth().currentUser.email,
                                            name: firebase.auth().currentUser.displayName,
                                            photoURL: firebase.auth().currentUser.photoURL,
                                            token: token
                                        });
                                        Alert.alert("Thông báo", "Đăng ký tài khoản thành công!");
                                        this.props.nav.navigate("Đăng nhập");
                                    })
                                    .catch(error => { console.log(error) });
                            }}></Button>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        flexDirection: "column",
        paddingLeft: 40,
        paddingRight: 40,
        elevation: 24,
        borderRadius: 15

    },
    input: {
        marginTop: 10
    },
});
