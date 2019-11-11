import React, { Component } from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Icon, Fab } from 'native-base';

function _render(data) {
    return (
        data.map(val => (
            <Image key={val.uid} style={styles.avatar} source={{uri: val.avatar}}></Image>
        ))
    )
}
function Item({ data, navigation }) {
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Chi tiết bảng", data);
            }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{data.name}</Text>
                </View>
                <View style={styles.itemMember}>
                    {_render(data.members)}
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionInfo}>

                    </View>
                    <View style={styles.deadline}>
                        <Icon name='md-time' style={{ fontSize: 14 }} />
                        <Text style={styles.showdeadline}>Hôm nay - 23/12/2019</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

class BoardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBoard: [],
            boardname: '',
            primary: false,
            active: false,
        };
        this.ref = firebase.firestore().collection('boards');
        this.unsubscriber = null;
    }

    componentDidMount() {
        this.unsubscriber = this.ref.where('members', 'array-contains', firebase.auth().currentUser.uid).onSnapshot((query) => {
            const boards = [];

            query.forEach(doc => {

                let board = doc;
                const users = [];
                board.data().members.forEach(val => {
                    firebase.firestore().collection('users').where('uid', '==', val).get()
                        .then(user => {
                            users.push({
                                uid: user.docs[0].data().uid,
                                name: user.docs[0].data().name,
                                avatar: user.docs[0].data().photoURL,
                                email: user.docs[0].data().email
                            });

                            this.setState({
                                active: !this.state.active
                            });
                        });
                })

                boards.push({
                    id: board.id,
                    name: board.data().name,
                    members: users
                })
            });

            this.setState({
                listBoard: boards,
            });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    render() {
        console.log("LIST = ", this.state.listBoard);
        return (
            <View style={styles.container}>
                <View style={{ marginLeft: 15 }}>
                    <Text style={{ color: '#8492A6', fontSize: 14, fontWeight: 'bold' }}>Danh sách bảng</Text>
                </View>
                <View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.listBoard}
                        renderItem={({ item }) => <Item data={item} navigation={this.props.navigation}></Item>}
                        keyExtractor={item => item.id}
                        extraData={this.state.active}
                    />
                </View>
                <Fab
                    position="bottomRight"
                    style={{ backgroundColor: '#5067FF' }}
                    onPress={() => {
                        this.props.modal();
                    }}
                >
                    <Icon name="md-add" />
                </Fab>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        borderColor: '#8492A6'
    },
    itemMember: {
        flexDirection: 'row',
        marginTop: 10
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
    },
    actionContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#8492A6',
        paddingTop: 5
    },
    deadline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showdeadline: {
        marginLeft: 5,
    }
})
export default withNavigation(BoardView);
