import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon, Thumbnail, Footer } from 'native-base';

function Item({ data }) {
    return (
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1, }}>
                <Thumbnail small source={{ uri: data.avatar }} />
            </View>
            <View style={{ flex: 9, flexDirection: 'column', marginLeft: 10, backgroundColor: '#C0CCDA', borderRadius: 10, padding: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{data.uname}</Text>
                <View style={{ marginTop: 5 }}>
                    <Text>{data.contents}</Text>
                </View>
            </View>
        </View>
    )
}


export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            contents: '',
            isScroll: false
        };
        this.ref = firebase.firestore().collection('cards').doc(this.props.data.id);
        this.unsubcriber = null;
    }

    componentDidMount() {
        this.unsubcriber = this.ref.collection('comments').orderBy('timestamp', 'ASC').onSnapshot((query) => {
            //Cập nhật số lượng commnet
            this.ref.update({
                numComment: query._docs.length
            });

            const comments = [];
            query.forEach((doc) => {
                comments.push({
                    id: doc.id,
                    uname: doc.data().uname,
                    avatar: doc.data().avatar,
                    contents: doc.data().contents
                });
            });
            this.setState({
                comments
            });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.unsubcriber)
            this.unsubcriber();
    }

    scrollForTextInput = () => {
        this.refs.scroll.scrollEnabled = true;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.showComment}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.comments}
                        renderItem={({ item }) => <Item data={item}></Item>}
                        keyExtractor={item => item.id}
                    //extraData={this.state.active}
                    />
                </View>
                <Footer>
                    <View style={styles.addComment}>
                        <TextInput placeholder='Nhập bình luận...' style={{ borderWidth: 1, borderRadius: 30, flex: 9, height: 40 }}
                            value={this.state.contents}
                            onChangeText={(text) => {
                                this.setState({
                                    contents: text
                                });
                            }} />
                        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}
                            onPress={() => {
                                this.ref.collection('comments').add({
                                    uname: firebase.auth().currentUser.displayName,
                                    avatar: firebase.auth().currentUser.photoURL,
                                    contents: this.state.contents,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                });
                                this.setState({
                                    contents: ''
                                })
                            }}>
                            <Icon type='FontAwesome' name='paper-plane' />
                        </TouchableOpacity>
                    </View>
                </Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    showComment: {
        flex: 9,
    },
    addComment: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 5
    }
});