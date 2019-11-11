import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import Modal from 'react-native-modalbox';
import firebase from 'react-native-firebase';


export default class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            selectedList: '',
        };
    }

    show(selectedList) {

        this.refs.modal.open();
        this.setState({
            selectedList
        })
    }

    _renderList() {
        return this.props.list.map(val => (
            <Picker.Item  key={val.id} label={val.name} value={val.id} />
        ))
    }

    render() {
        return (
            <Modal
                ref={'modal'}
                style={{
                    borderRadius: 5,
                    shadowRadius: 10,
                    width: 300,
                    height: 200,
                    padding: 20
                }}
                position='center'
                backdrop={true}
                coverScreen={true}>
                <View>
                    <Text style={{ fontSize: 18 }}>Thêm thẻ</Text>
                </View>
                <View>
                    <TextInput placeholder="Tên thẻ..." placeholderTextColor="grey" style={{ borderBottomWidth: 1, fontSize: 16 }}
                        onChangeText={(text) => {
                            this.setState({
                                name: text
                            })
                        }}></TextInput>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <View style={{ flex: 4 }}>
                            <Text style={{ fontSize: 16 }}>Danh sách: </Text>
                        </View>
                        <Picker
                            style={{ flex: 6 }}
                            selectedValue={this.state.selectedList}
                            onValueChange={(itemVal) => {
                                this.setState({
                                    selectedList: itemVal
                                })
                            }}>
                                {this._renderList()}
                        </Picker>
                    </View>
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 10, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        firebase.firestore().collection('cards').add({
                            name: this.state.name,
                            lid: this.state.selectedList
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