import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Item, Input, Icon, Radio, Text } from 'native-base';
import firebase from 'react-native-firebase';
import { GoogleSignin } from '@react-native-community/google-signin';

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
        });
        GoogleSignin.configure({});

    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    render() {
        return (
            <View style={styles.container1}>
                <View></View>
                <View style={{marginTop: 15}}>
                    <Item>
                        <Icon name="mail" style={{ color: "#F3C537" }}></Icon>
                        <Input placeholder="Email..." placeholderTextColor="grey"
                            keyboardType="email-address" style={{color:"white"}}
                            onChangeText={(text) => {
                                this.setState({
                                    email: text
                                })
                            }}></Input>
                    </Item>
                    <Item style={styles.input}>
                        <Icon name="lock" style={{ color: "#F3C537" }}></Icon>
                        <Input placeholder="Mật khẩu..." placeholderTextColor="grey" style={{color:"white"}}
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
                        <Radio selected={this.state.remember} ref="remme" color="#F3C537" onPress={() => {
                            this.setState({
                                remember: !this.state.remember
                            })
                        }} />
                        <Text style={{ marginLeft: 10, color: "white" }}>Ghi nhớ</Text>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate('Quên mật khẩu');
                            }}>
                            <Text style={{ color: "#F3C537", fontStyle: "italic" }}>Quên mật khẩu?</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity style={styles.button}
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
                                //console.error(error);
                                var info = error.code;
                                if (info === 'auth/user-not-found') {
                                    Alert.alert("Lỗi", "Tài khoản không tồn tại!");
                                }
                                else if (info === 'auth/wrong-password') {
                                    Alert.alert("Lỗi", "Sai mật khẩu!");
                                }

                            })
                    }}>
                    <Text>Đăng Nhập</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: "white", marginTop: 20, justifyContent: "center" }}>Hoặc đăng ký với</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <TouchableOpacity style={{
                        alignItems: 'center', justifyContent: 'center', flexDirection: "row", flex: 4,
                        borderWidth: 1, borderRadius: 10, borderColor: "#F3C537", padding: 5, marginRight: 5
                    }}
                        onPress={() => {
                            this.props.nav.navigate("Đăng ký");
                        }}>
                        <Icon name="mail" style={{ color: "#F3C537", marginRight: 10 }}></Icon>
                        <Text style={{color: "white"}}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        alignItems: 'center', justifyContent: 'center', flexDirection: "row", flex: 4,
                        borderWidth: 1, borderRadius: 10, borderColor: "#F3C537", padding: 5, marginLeft: 5
                    }}
                        onPress={() => {
                            GoogleSignin
                            .signIn()
                            .then((data) => {
                                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                                return firebase.auth().signInWithCredential(credential);
                            })
                            .then((currentUser) => {
                                console.log('currentUser = ', credential);
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                        }}>
                        <Icon name="logo-google" style={{ color: "#F3C537", marginRight: 10 }}></Icon>
                        <Text style={{color: "white"}}>Google</Text>
                    </TouchableOpacity>
                </View>
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
