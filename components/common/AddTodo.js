import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modalbox';

export default class AddTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        };
    }

    show() {
        this.refs.modal.open();
    }

    render() {
        return (
            <View>
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
                        <Text style={{ fontSize: 18 }}>Thêm mục công việc</Text>
                    </View>
                    <View>
                        <TextInput placeholder="Tên danh mục..." placeholderTextColor="grey" style={{ borderBottomWidth: 1, fontSize: 16 }}
                            onChangeText={(text) => {
                                this.setState({
                                    input: text
                                })
                            }}></TextInput>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', marginTop: 15, alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                            newTodoList = {
                                id: Math.floor(Date.now() / 1000),
                                name: this.state.input,
                                createDate: new Date()
                            }
                            this.props.func(newTodoList).then()
                                .catch((error) => {
                                    Alert.alert("lỗi", "Có lỗi " + error);
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
            </View>
        );
    }
}
