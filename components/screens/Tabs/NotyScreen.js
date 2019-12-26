import React, { Component } from 'react';
import { Container, Header, Content, Icon, Left, Right, Body, Title, Button, Text } from 'native-base';
import { View, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';

function Item({ data }) {
    return (
        <View style={[{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C4C4C4' }, data.status ? { backgroundColor: "white" } : { backgroundColor: "#ebe6e6" }]}>
            {data.type == 'invite' ?
                <>
                    <View style={{ flex: 1 }}>
                        <Icon name='md-log-in' style={{ color: '#F3C537' }} />
                    </View>
                    <View style={{ flex: 9, flexDirection: 'column' }}>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>{data.from}</Text>
                            <Text> đã mời bạn tham gia vào bảng </Text>
                            <Text style={{ fontWeight: 'bold' }}>{data.payload.bname}</Text>
                        </Text>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            {data.status == false &&
                                <>
                                    <TouchableOpacity
                                        style={{ marginLeft: 20 }}
                                        onPress={() => {
                                            //

                                            firebase.firestore().collection('boards').doc(data.payload.bid).get()
                                            .then(doc => {
                                                const oldMembers = [
                                                    ...doc.data().members,
                                                    firebase.auth().currentUser.uid
                                                ];
                                                firebase.firestore().collection('boards').doc(data.payload.bid).update({
                                                    members: oldMembers
                                                })
                                            });
                                            firebase.firestore().collection('requests').doc(data.id).update({
                                                status: true
                                            });
                                        }}>
                                        <Text style={{ color: '#F3C537' }}>CHẤP NHẬN</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            firebase.firestore().collection('requests').doc(data.id).update({
                                                status: true
                                            });
                                        }}>
                                        <Text>TỪ CHỐI</Text>
                                    </TouchableOpacity>
                                </>}
                        </View>
                    </View>
                </> :
                <>
                    <View style={{ flex: 1 }}>
                        <Icon name='md-card' style={{ color: '#F3C537' }} />
                    </View>
                    <View style={{ flex: 9, flexDirection: 'column' }}>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>{data.from}</Text>
                            <Text> đã thêm bạn vào thẻ </Text>
                            <Text style={{ fontWeight: 'bold' }}>{data.payload.cname}</Text>
                        </Text>
                        <View style={{ flexDirection: 'row-reverse', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // cập nhật status về true => đã đọc
                                    firebase.firestore().collection('requests').doc(data.id).update({
                                        status: true
                                    });
                                    // Lấy data đổ vào chi tiết card
                                    NavigationService.navigate('Chi tiết card', { id: data.payload.cid, name: data.payload.lname, members: data.payload.bmembers });
                                }}>
                                <Text style={{ color: '#F3C537' }}>XEM THẺ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>}
        </View>
    );
};
export default class NotyScreen extends Component {
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
        this.unsubscriber = this.ref.where('to', '==', firebase.auth().currentUser.uid).
            onSnapshot(query => {
                const notis = [];
                query.forEach(doc => {
                    notis.push({
                        id: doc.id,
                        from: doc.data().from,
                        payload: doc.data().payload,
                        status: doc.data().status,
                        type: doc.data().type
                    })
                });

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
        return (
            <Container>
                <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
                    <Body style={{ padding: 10 }}>
                        <Title style={{ color: "#F3C537" }}>Thông báo</Title>
                    </Body>
                </Header>
                <Content>
                    <View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#C4C4C4' }}>
                            <View style={{ flexDirection: 'row-reverse', margin: 10 }}>
                                <Text style={{ color: 'red' }}>Xóa hết</Text>
                            </View>
                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.notis}
                            renderItem={({ item }) => <Item data={item}></Item>}
                            keyExtractor={item => item.from}
                            extraData={this.state.update}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}
