import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import Modal from 'react-native-modalbox';
import firebase from 'react-native-firebase';
import { Thumbnail } from 'native-base';

export default class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedList: [],
            members: [],
        };
    }


    show(selected) {

        this.refs.modal.open();
        this.setState({
            selectedList: selected ? selected : []
        })
        console.log('selected =', this.state.selectedList);
    }

    _renderMember() {
        return (this.props.members.map(val => (
            <View key={val.uid} style={{ flexDirection: 'row' }}>
                <View style={{ flex: 2 }}>
                    <Thumbnail source={{ uri: val.avatar }}></Thumbnail>
                </View>
                <View style={{ flex: 6, justifyContent: 'center', paddingLeft: 5 }}>
                    <Text>{val.name}</Text>
                    <Text>{val.email}</Text>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.selectedList.includes(val.uid) ?
                        <TouchableOpacity
                            onPress={() => {
                                //tìm vị trí phần tử
                                const temp =  this.state.selectedList;
                                let index = this.state.selectedList.indexOf(val.uid);
                                temp.splice(index, 1);
                                this.setState({
                                    selectedList: temp
                                });
                            }}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => {
                                //thêm member vào members state
                                this.setState({
                                    selectedList: [
                                        ...this.state.selectedList,
                                        val.uid
                                    ]
                                });
                            }}>
                            <Text>Thêm</Text>
                        </TouchableOpacity>}
                </View>
            </View>
        )));
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
                    <Text style={{ fontSize: 18 }}>Thêm thành viên</Text>
                </View>
                <View>
                    {this._renderMember()}
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 10, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        this.props.update(this.state.selectedList);
                        this.refs.modal.close();
                    }} >
                        <Text>OK</Text>
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