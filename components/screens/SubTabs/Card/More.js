import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ProgressBarAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'native-base';
import AddVote from '../../../common/Card/AddVote';

function Item({ data, show }) {
    return (
        <View style={{ padding: 5, backgroundColor: '#C4C4C4', borderRadius: 5, marginBottom: 10 }}>
            <View>
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
                    onPress={() => {
                        show('VOTE', data);
                    }}>
                    <Text>THAM GIA BẦU CHỌN</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default class More extends Component {
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
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.section}>
                    <View style={styles.title}>
                        <Icon name='md-clipboard' style={[styles.article, { fontSize: 14, }]}></Icon>
                        <Text style={[{ marginLeft: 5 }, styles.article]}>Bầu chọn ý kiến</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.votes}
                        renderItem={({ item }) => <Item data={item} show={this.refs.modalVote.show}></Item>}
                        keyExtractor={item => item.id}
                        extraData={this.state}
                    />
                </View>
                <View style={styles.section}>
                    <TouchableOpacity
                        onPress={() => {
                            this.refs.modalVote.show('ADD');
                        }}>
                        <Text>Thêm cuộc bầu chọn</Text>
                    </TouchableOpacity>
                </View>
                <AddVote ref={'modalVote'} cid={this.props.data.id}></AddVote>
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