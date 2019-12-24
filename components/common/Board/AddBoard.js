import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import firebase from 'react-native-firebase';


export default class AddBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            choosen: '',
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
                    height: 150,
                    padding: 20
                }}
                position='center'
                backdrop={true}
                coverScreen={true}>
                <View>
                    <Text style={{ fontSize: 18 }}>Thêm bảng</Text>
                </View>
                <View>
                    <TextInput placeholder="Tên bảng..." placeholderTextColor="grey" style={{ borderBottomWidth: 1, fontSize: 16 }}
                        onChangeText={(text) => {
                            this.setState({
                                name: text
                            })
                        }}></TextInput>
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 15, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        const timestamp = Date.now().toString();
                        firebase.firestore().collection('boards').add({
                            name: this.state.name,
                            primary: false,
                            author: firebase.auth().currentUser.uid,
                            members: [
                                firebase.auth().currentUser.uid
                            ],
                            timestamp: timestamp
                        });
                        //đóng modal
                        this.refs.modal.close();
                    }}>
                        <Text>THÊM</Text>
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