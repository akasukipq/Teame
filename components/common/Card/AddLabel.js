import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon } from 'native-base';


this.color = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'pink'
]

export default class AddLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            existData: '',
            choosen: ''
        };
    }

    show(title, existData) {
        this.setState({
            title,
            existData
        });
        this.refs.modal.open();
    }

    _renderColor() {
        return (color.map(val => (
            <TouchableOpacity onPress={() => {
                this.setState({ choosen: val })
            }}>
                <View style={[styles.color, { backgroundColor: val }]}>
                    {this.state.choosen == val && <Icon type="FontAwesome" name="check" style={{ color: 'white' }} />}
                </View>
            </TouchableOpacity>
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
                    height: 250,
                    padding: 20
                }}
                position='center'
                backdrop={true}
                coverScreen={true}>
                <View>
                    <Text style={{ fontSize: 18 }}>{this.state.title}</Text>
                </View>
                <View>
                    <TextInput placeholder="Tên nhãn..." placeholderTextColor="grey"
                        defaultValue={this.state.existData ? this.state.existData.name : ''}
                        style={{ borderBottomWidth: 1, fontSize: 16 }}
                        onChangeText={(text) => {
                            this.setState({
                                name: text
                            })
                        }}></TextInput>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {this._renderColor()}
                    </View>
                </View>
                <View style={{ flexDirection: 'row-reverse', marginTop: 10, alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                        this.props.update(this.state.name, this.state.choosen);
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
    },
    color: {
        width: 70,
        height: 30,
        marginLeft: 5,
        marginTop: 10
    }
})