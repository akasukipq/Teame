import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'native-base';

function Item({ data }) {
    return (
        <View style={{ flexDirection: 'row', padding: 10 }}>
            <View style={{ flex: 1 }}>
                <Icon name='md-planet' />
            </View>
            <View style={{ flex: 9, flexDirection: 'column' }}>
                <Text>
                    <Text style={{ fontWeight: 'bold' }}>{data.from}</Text>
                    <Text> đã mời bạn tham gia vào bảng </Text>
                    <Text style={{ fontWeight: 'bold' }}>{data.payload.bname}</Text>
                </Text>
                <View>
                    {data.type == 'invite' && <TouchableOpacity
                        onPress={() => {
                            firebase.firestore().collection('boards').doc(data.payload.bid).update({
                                members: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                            })
                        }}>
                        <Text>Tham gia</Text>
                    </TouchableOpacity>}
                    {data.type == 'add' && <TouchableOpacity
                        onPress={() => {
                            firebase.firestore().collection('boards').doc(data.payload.bid).update({
                                members: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                            })
                        }}>
                        <Text>Tham gia</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        </View>
    );
};

export default class NotyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notis: [],
            update: false
        };
        this.ref = firebase.firestore().collection('requests');
        this.unsubscriber = null;
    }

    componentDidMount() {
        this.unsubscriber = this.ref.
            onSnapshot(query => {
                const notis = [];
                query.forEach(doc => {
                    notis.push({
                        from: doc.data().from,
                        payload: doc.data().payload,
                        type: doc.data().type
                    })
                });
                console.log('notis c = ', query);
                this.setState({
                    notis,
                    update: !this.state.update
                });
            })
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber)
            this.unsubscriber();
    }

    render() {
        console.log('notis = ', this.state.notis);
        return (

            <View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.notis}
                    renderItem={({ item }) => <Item data={item}></Item>}
                    keyExtractor={item => item.from}
                    extraData={this.state.update}
                />
            </View>
        );
    }
}
