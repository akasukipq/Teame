import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ProgressBarAndroid, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import { Text, Icon } from 'native-base';
import AddVote from '../../../common/Card/AddVote';

function Item({ data, show }) {
    return (
        <View style={{ padding: 5, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: "#F3C537" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="md-analytics" style={{ color: '#F3C537', marginRight: 10, }} />
                <Text style={{ color: '#C4C4C4' }}>Thăm dò ý kiến</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{data.name}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data.options}
                    renderItem={({ item }) =>
                        (
                            <View style={{ marginBottom: 5 }}>
                                <Text>{item.name}</Text>
                                <ProgressBarAndroid styleAttr="Horizontal"
                                    color="#F3C537"
                                    progress={data.sum == 0 ? 0 : item.count.length / data.sum}
                                    indeterminate={false} />
                            </View>
                        )}
                    keyExtractor={item => item.name}
                    extraData={this.state}
                />
            </View>
            <View style={{ padding: 10, alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ backgroundColor: '#21272E', borderColor: '#21272E', borderWidth: 1, borderRadius: 5, padding: 5 }}
                    onPress={() => {
                        show('VOTE', data);
                    }}>
                    <Text style={{ color: '#F3C537' }}>Bình chọn</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default class Vote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            votes: []
        };
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('cards').doc(this.props.data.id);
    }

    componentDidMount() {
        this.unsubscriber = this.ref.collection('votes').onSnapshot(query => {
            const votes = [];
            query.forEach(doc => {
                votes.push({
                    id: doc.id,
                    name: doc.data().name,
                    options: doc.data().options,
                    sum: doc.data().sum
                });
            });

            this.setState({
                votes
            });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber)
            this.unsubscriber();
    }


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                <ScrollView>
                    <View style={styles.section}>
                        <FlatList
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={this.state.votes}
                            renderItem={({ item }) => <Item data={item} show={this.refs.modalVote.show}></Item>}
                            keyExtractor={item => item.id}
                            extraData={this.state}
                        />
                    </View>
                    <View style={[styles.section, {
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.modalVote.show('ADD');
                            }}>
                            <Text style={{ color: '#F3C537' }}>Thêm cuộc bầu chọn</Text>
                        </TouchableOpacity>
                    </View>
                    <AddVote ref={'modalVote'} cid={this.props.data.id}></AddVote>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    section: {
        marginTop: 10,

    },
    title: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    article: {
        color: 'gray'
    },
    content: {
        marginTop: 10
    }
})