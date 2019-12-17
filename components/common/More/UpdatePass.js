import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modalbox';
import firebase from 'react-native-firebase';


export default class UpdatePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: ''
        };
    }

    show() {
        this.refs.modal.open();
    }

    render() {
        return (
            <Modal
                ref={'modal'}
                style={{
                    borderRadius: 5,
                    shadowRadius: 10,
                    width: 300,
                    height: null,
                    padding: 20
                }}
                position='center'
                backdrop={true}
                coverScreen={true}>
                <View>
                    <Text style={{ fontSize: 18 }}>Đổi mật khẩu</Text>
                </View>
                <View>
                    <TextInput placeholder="Mật khẩu mới..." placeholderTextColor="grey"
                        style={{ borderBottomWidth: 1, fontSize: 16 }}
                        onChangeText={(text) => {
                            this.setState({
                                pass: text
                            })
                        }}></TextInput>
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 15, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        if(this.state.pass != '')
                        {
                            firebase.auth().currentUser.updatePassword(this.state.pass).then(function() {
                                // Update successful.
                                Alert.alert('Thông báo', 'Cập nhật mật khẩu thành công!');
                                this.refs.modal.close();
                              }).catch(function(error) {
                                // An error happened.
                                Alert.alert('Lỗi', 'Cập nhật mật khẩu thất bại!');
                              });
                        }
                        
                    }}>
                        <Text>XÁC NHẬN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }}
                        onPress={() => {
                            this.refs.modal.close();
                        }}>
                        <Text>HỦY</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    section: {
        marginTop: 10
    }
})