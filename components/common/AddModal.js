import React, { Component } from 'react';
import { View, Text, Dimensions, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon } from 'native-base';
import firebase from 'react-native-firebase';

export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            choosen: '',
        };
    }

    showModal() {
        this.refs.modal.open();
    }

    colorPicker() {
        const colorArr = ["red", "green", "blue", "yellow", "orange", "violet", "pink", "black"];

        return (
            colorArr.map(val => (
                <TouchableOpacity onPress={() => {
                    this.setState({ choosen: val })
                }}>
                    <View style={{ width: 70, height: 30, backgroundColor: val, marginTop: 10 }}>
                        {this.state.choosen == val && <Icon type="FontAwesome" name="check" style={{ color: 'white' }} />}
                    </View>
                </TouchableOpacity>
            )
            ));
    }

    render() {
        return (
            <Modal
                ref={'modal'}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    shadowRadius: 10,
                    width: Dimensions.get('window').width - 20,
                    height: 300,
                    padding: 20
                }}
                position='center'
                backdrop={true}>
                <View>
                    <Text style={{ textAlign: 'center' }}>Thêm nhãn</Text>
                </View>
                <View>
                    <Text>Nhãn mới</Text>
                    <TextInput placeholder="Ví dụ: design..." placeholderTextColor="grey" style={{ borderBottomWidth: 1 }}
                        onChangeText={(text) => {
                            this.setState({
                                name: text
                            })
                        }}></TextInput>
                    <View style={styles.section}>
                        <Text>Chọn màu</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            {this.colorPicker()}
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 15, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
                        firebase.firestore().collection('cards').doc(this.props.id).collection('labels').add({
                            name: this.state.name,
                            color: this.state.choosen
                        })
                    }}>
                        <Text style={{color: '#F3C537'}}>Thêm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 20 }}
                        onPress={() => {
                            this.refs.modal.close();
                        }}>
                        <Text>Hủy</Text>
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