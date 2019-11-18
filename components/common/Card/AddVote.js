import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon } from 'native-base';
import firebase from 'react-native-firebase';

export default class AddVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            option: '',
            listOption: '',
            type: '',
            data: null,
            chose: '',
            isVoted: false,
            dataVoted: ''
        };
        this.show = this.show.bind(this);
    }

    show(type, data = null) {
        //check đã vote hay chưa
        if (data) {
            data.options.forEach(val => {
                if (val.count.includes(firebase.auth().currentUser.uid)) {
                    this.setState({
                        isVoted: true,
                        chose: val.name,
                        dataVoted: val.name
                    });
                }
            });
        }
        this.setState({ type, data });
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
                {this.state.type == 'ADD' ?
                    <View>
                        <View>
                            <Text style={{ fontSize: 18 }}>Thêm bầu chọn</Text>
                        </View>
                        <View>
                            <TextInput placeholder="Tên cuộc bầu chọn..." placeholderTextColor="grey"
                                style={{ borderBottomWidth: 1 }}
                                value={this.state.name}
                                onChangeText={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}></TextInput>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Các lựa chọn</Text>
                                <FlatList
                                    style={{ marginTop: 10 }}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.listOption}
                                    renderItem={({ item }) => (
                                        <Text>{item}</Text>
                                    )}
                                    keyExtractor={item => item}
                                    extraData={this.state.listOption}
                                />

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 9, }}>
                                        <TextInput placeholder="Thêm lựa chọn..." placeholderTextColor="grey"
                                            value={this.state.option}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    option: text
                                                })
                                            }}></TextInput>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                listOption: [
                                                    ...this.state.listOption,
                                                    this.state.option
                                                ],
                                                option: ''
                                            });
                                        }}>
                                            <Icon name='md-add' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row-reverse', marginTop: 10, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                                const data = [];
                                this.state.listOption.forEach(val => {
                                    data.push({
                                        name: val,
                                        count: []
                                    });
                                });
                                //console.log('data = ', data);
                                firebase.firestore().collection('cards').doc(this.props.cid).collection('votes')
                                    .add({
                                        name: this.state.name,
                                        options: data,
                                        sum: 0
                                    })
                                this.refs.modal.close();
                            }} >
                                <Text>TẠO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    this.state.data && <View>
                        <View>
                            <Text style={{ fontSize: 18 }}>Bầu chọn</Text>
                        </View>
                        <View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Tên bầu chọn</Text>
                                <Text style={{ marginTop: 5 }}>{this.state.data.name}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Các lựa chọn</Text>
                                <FlatList
                                    style={{ marginTop: 5 }}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.data.options}
                                    renderItem={({ item }) =>
                                        (
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                                                onPress={() => { this.setState({ chose: item.name }) }}>
                                                <Icon name={this.state.chose == item.name ? 'md-arrow-dropup-circle' : 'md-arrow-dropup'} />
                                                <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    keyExtractor={item => item.name}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row-reverse', marginTop: 10, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                                if (this.state.isVoted) {
                                    this.state.data.options.forEach(val => {
                                        //xóa trong count option cũ
                                        if (val.name == this.state.dataVoted) {
                                            let index = val.count.indexOf(firebase.auth().currentUser.uid);
                                            val.count.splice(index, 1);
                                        }
                                        if (val.name == this.state.chose) {
                                            val.count.push(firebase.auth().currentUser.uid);
                                        }
                                    });
                                    firebase.firestore().collection('cards').doc(this.props.cid).collection('votes')
                                        .doc(this.state.data.id).update({
                                            options: this.state.data.options,
                                        });
                                    this.setState({
                                        isVoted: false
                                    })
                                }
                                else {
                                    this.state.data.options.forEach(val => {
                                        if (val.name == this.state.chose) {
                                            val.count.push(firebase.auth().currentUser.uid);
                                        }
                                    });
                                    firebase.firestore().collection('cards').doc(this.props.cid).collection('votes')
                                        .doc(this.state.data.id).update({
                                            options: this.state.data.options,
                                            sum: this.state.data.sum + 1
                                        });
                                };
                                this.refs.modal.close();
                            }} >
                                <Text>LƯU</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
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