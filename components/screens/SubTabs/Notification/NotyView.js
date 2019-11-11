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
                </View>
            </View>
        </View>
    );
};

export default class NotyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notis: []
        };
        this.ref = firebase.firestore().collection('requests');
        this.unsubscriber = null;
    }

    componentDidMount() {
        const notis = [];
        this.unsubscriber = this.ref.where('to','==',firebase.auth().currentUser.uid).get()
            .then((query) => {
                query.forEach(doc => {
                    let data = doc.data();
                    notis.push({
                        id: doc.id,
                        from: data.from,
                        type: data.type,
                        payload: data.payload,
                        status: data.status
                    });
                });

                this.setState({
                    notis
                });
            })
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber)
            this.unsubscriber();
    }

    render() {
        console.log('noti = ', this.state.notis);
        return (
            <View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.notis}
                    renderItem={({ item }) => <Item data={item}></Item>}
                    keyExtractor={item => item.id}
                // extraData={this.state.loading}
                />
            </View>
        );
    }
}
