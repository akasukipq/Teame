import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Item, Input, Icon, Radio } from 'native-base';

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
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
                    <View style={{ flexDirection: "row-reverse", marginTop: 20}}>
                        <Button title="Đăng ký" color="#184576"
                            onPress={() => {
                                firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                                .then(() => {
                                    //đồng bộ dữ liệu sang collection user
                                    var db = firebase.firestore();
                                    var uid = firebase.auth().currentUser.uid;
                                    db.collection('users').doc(uid).set({
                                        
                                    })
                                    Alert.alert("Thông báo", "Đăng ký tài khoản thành công!");
                                    this.props.nav.navigate("Đăng nhập");
                                })
                                .catch(error => {console.log(error)});
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
