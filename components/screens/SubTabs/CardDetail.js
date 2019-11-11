import React, { Component } from 'react';
import { View, Text, FlatList, Animated, PanResponder, StyleSheet, Alert, TouchableOpacity, Button } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'native-base';

export default class CardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCard: [],
            posX: 0,
            posY: 0
        };
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('cards');
    }

    componentDidMount() {
        this.unsubscriber = this.ref.where('lid', '==', this.props.ListId).onSnapshot((query) => {
            const card = [];
            //
            query.forEach(doc => {
                console.log('co lag = ', doc.data());
                card.push({
                    id: doc.id,
                    name: doc.data().name,
                    describe: doc.data().describe,
                    deadline: doc.data().deadline,
                    label: doc.data().label,
                    numComment: doc.data().numComment,
                    numList: doc.data().numList,
                    numAttach: doc.data().numAttach

                });
            });
            this.setState({
                listCard: card,
            });
        });

    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _renderItem = ({ item }) => {
        return (
            <View>
                <View
                    {...this.props.PanResponder.panHandlers}
                    style={styles.container}
                >
                    <TouchableOpacity
                        onLongPress={() => {

                            let data = {
                                cardid: item.id,
                                cardname: item.name,
                                sid: this.props.SlideId
                            }
                            this.props.getdt(data);
                            this.props.setDrag(true);
                        }}
                        onPress={() => {
                            this.props.navigation.navigate("Chi tiết card", { id: item.id, name: this.props.ListName });
                        }}>

                        {item.label && <Text style={{color: item.label.color}}>{item.label.name}</Text>}

                        <View style={styles.section}>
                            <Text>{item.name}</Text>
                        </View>
                        {item.deadline &&
                            <View style={styles.section}>
                                <Icon name='md-time' style={[{ fontSize: 14 }, styles.subcolor]} />
                                <Text style={[styles.showdeadline, styles.subcolor]}>{item.deadline}</Text>
                            </View>}
                        <View style={styles.actionSec}>
                            <View style={styles.showInfo}>

                                {item.numList != 0 && <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='md-list' style={[{ fontSize: 14 }, styles.subcolor]} />
                                    <Text style={[styles.showdeadline, styles.subcolor]}>{item.numList}</Text>
                                </View>}
                                {item.numAttach != 0 &&
                                    <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='md-attach' style={[{ fontSize: 14 }, styles.subcolor]} />
                                        <Text style={[styles.showdeadline, styles.subcolor]}>{item.numAttach}</Text>
                                    </View>}
                                {item.numComment != 0 &&
                                    <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='md-chatboxes' style={[{ fontSize: 14 }, styles.subcolor]} />
                                        <Text style={[styles.showdeadline, styles.subcolor]}>{item.numComment}</Text>
                                    </View>}
                            </View>
                            <View style={styles.member}>
                                <View style={styles.avatar} />
                                <View style={styles.avatar} />
                                <View style={styles.avatar} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.listCard}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    animatedView: {
        width: 20,
        height: 20,
        backgroundColor: "black",
        zIndex: 2

    },
    container: {
        padding: 10,
        borderWidth: 1,
        marginTop: 10
    },
    tag: {
        width: 60,
        height: 20,
    },
    section: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionSec: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    showdeadline: {
        marginLeft: 5,
    },
    subcolor: {
        color: '#8492A6'
    },
    showInfo: {
        flexDirection: 'row'
    },
    member: {
        flexDirection: 'row'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: 'green'
    },
});
