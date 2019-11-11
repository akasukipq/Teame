import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Item, Input, Icon, Radio } from 'native-base';
import firebase from 'react-native-firebase';

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.unsubscriber = null;
        this.state = {
            isAuth: false,
            email: "",
            password: "",
            user: null,
            remember: false
        }

    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((newUser) => {
            this.setState({
                user: newUser,
            })
        })
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View>
                        <Item>
                            <Icon name="person" style={{ color: "#184576" }}></Icon>
                            <Input placeholder="Email or Username..." placeholderTextColor="grey"
                                keyboardType="email-address"
                                onChangeText={(text) => {
                                    this.setState({
                                        email: text
                                    })
                                }}></Input>
                        </Item>
                        <Item style={styles.input}>
                            <Icon name="lock" style={{ color: "#184576" }}></Icon>
                            <Input placeholder="Password..." placeholderTextColor="grey"
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text
                                    })
                                }}></Input>
                        </Item>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", paddingTop: 20, alignItems: "center" }}>
                            <Radio selected={this.state.remember} ref="remme" color="#184576" onPress={() => {
                                this.setState({
                                    remember: !this.state.remember
                                })
                            }} />
                            <Text style={{ marginLeft: 10, color: "grey" }}>Remember me</Text>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <Text style={{ color: "#184576", fontStyle: "italic" }}>Forgot password?</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, alignItems: "center" }}>
                        <Button title="SIGN IN" color="#184576"
                            onPress={() => {
                                //Đăng nhập
                                firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                                    .then((credential) => {
                                        //console.log(credential);
                                        //this.state.user = credential;
                                        this.state.isAuth = true;
                                        //Alert.alert("Lỗi", "Đăng nhập thành công");
                                        this.props.nav.navigate("App", { userInfor: this.state.user });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        var info = error.code;
                                        if (info === 'auth/user-not-found') {
                                            Alert.alert("Lỗi", "Tài khoản không tồn tại!");
                                        }
                                        else if (info === 'auth/wrong-password') {
                                            Alert.alert("Lỗi", "Sai mật khẩu!");
                                        }

                                    })
                            }}></Button>
                        <Text>OR</Text>
                        <Button title="GOOGLE BUTTON" color="#184576" onPress={() => {
                            this.props.nav.navigate("App");
                        }}></Button>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate("Đăng ký");
                            }}>
                            <Text>Ấn để đăng ký ngay!</Text>
                        </TouchableOpacity>
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
