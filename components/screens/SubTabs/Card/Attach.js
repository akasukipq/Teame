import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'react-native-firebase';
import { Icon, Fab, Button } from 'native-base';

export default class Attach extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listImageUrl: [],
            listDocument: [],
            activeFab: false
        };
        this.storageRef = firebase.storage();
        this.firestoreRef = firebase.firestore().collection('cards').doc(this.props.data.id);
    };


    imagePicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        }).then(val => {
            console.log('giá trị = ', val);
            //let path = val.uri.replace('%3A', ':');
            this.storageRef.ref('images').child(val.name).putFile(val.uri, { contentType: val.type, cacheControl: 'no-store' })
                .then(image => {
                    let metadata = image.metadata;
                    //then we get url base on metadata.name in storage
                    this.storageRef.ref('images').child(metadata.name).getDownloadURL()
                        .then(url => {
                            //now we will store data (include metadata and url) in firestore
                            this.firestoreRef.collection('attachments').add({
                                type: 'image',
                                name: metadata.name,
                                size: metadata.size,
                                url: url
                            });
                        });
                })
                .catch(error => {
                    console.log("lỗi ", error);
                })
        }).catch(error => console.log(error));
    }

    filePicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        }).then(val => {
            console.log('giá trị = ', val);
            //let path = val.uri.replace('%3A', ':');
            this.storageRef.ref('documents').child(val.name).putFile(val.uri, { contentType: val.type, cacheControl: 'no-store' })
                .then(doc => {
                    let metadata = doc.metadata;
                    this.storageRef.ref('documents').child(metadata.name).getDownloadURL()
                        .then(url => {
                            //now we will store data (include metadata and url) in firestore
                            this.firestoreRef.collection('attachments').add({
                                type: 'document',
                                name: metadata.name,
                                size: metadata.size,
                                url: url
                            });
                        });
                })
                .catch(error => {
                    console.log("lỗi ", error);
                })
        }).catch(error => console.log(error));
    }



    componentDidMount() {
        //we get data in firestore at collection `attachments`
        this.firestoreRef.collection('attachments').onSnapshot((query) => {
            const listImageUrl = [];
            const listDocument = [];

            //cập nhật số lượng attach
            this.firestoreRef.update({
                numAttach: query._docs.length
            });

            query.forEach(doc => {
                let docdata = doc.data();

                if (docdata.type == 'image') {
                    listImageUrl.push({
                        url: docdata.url
                    });
                }
                else {
                    listDocument.push({
                        name: docdata.name,
                        size: docdata.size,
                        url: docdata.url
                    });
                }
            });
            this.setState({
                listImageUrl,
                listDocument
            });
            console.log('danh sách image = ', listImageUrl);
            console.log('danh sách doc = ', listDocument);
        });
    }

    _renderDocument = ({ item }) => {
        //console.log("what inside item = ", item);
        return (
            <View style={{
                padding: 10,
                borderRadius: 5,
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5
            }}>

                <View style={{
                    flex: 1,
                }}>
                    <Icon type='FontAwesome5' name='file' />
                </View>

                <View style={{
                    flex: 8,
                    flexWrap: 'wrap'
                }}>
                    <Text style={{
                        fontSize: 16
                    }}>{item.name}</Text>
                    <Text style={styles.article}>Dung lượng: {Math.floor(item.size / 1024)}KB</Text>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row-reverse'
                }}>
                    <Icon name='md-download' />
                </View>

            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <ScrollView>
                    <View style={styles.section}>
                        <View style={styles.title}>
                            <Icon type='FontAwesome5' name='image' style={[styles.article, { fontSize: 14, }]}></Icon>
                            <Text style={[{ marginLeft: 5 }, styles.article]}>Hình ảnh</Text>
                        </View>
                        <View>
                            <FlatList
                                horizontal
                                data={this.state.listImageUrl}
                                renderItem={({ item }) => <Image style={{ width: 150, height: 100, borderRadius: 5, marginLeft: 5, marginTop: 5 }} source={{ uri: item.url }} resizeMethod={'resize'} ></Image>}
                                keyExtractor={item => item.name}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.title}>
                            <Icon type='FontAwesome5' name='file' style={[styles.article, { fontSize: 14, }]}></Icon>
                            <Text style={[{ marginLeft: 5 }, styles.article]}>Tệp tin</Text>
                        </View>
                        <View>
                            <FlatList
                                data={this.state.listDocument}
                                renderItem={this._renderDocument}
                                keyExtractor={item => item.name}
                            />
                        </View>
                    </View>
                </ScrollView>

                <Fab
                    active={this.state.activeFab}
                    direction="up"
                    position="bottomRight"
                    style={{ backgroundColor: '#21272E' }}
                    onPress={() => {
                        this.setState({
                            activeFab: !this.state.activeFab
                        })
                    }}
                >
                    <Icon name="md-add" style={{ color: '#F3C537' }} />

                    <Button onPress={() => this.imagePicker()} style={{ backgroundColor: '#21272E' }}>
                        <Icon name='md-images' style={{ color: '#F3C537' }} />
                    </Button>

                    <Button onPress={() => this.filePicker()} style={{ backgroundColor: '#21272E' }}>
                        <Icon name='md-document' style={{ color: '#F3C537' }} />
                    </Button>

                </Fab>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    section: {
        marginTop: 10
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    article: {
        color: 'gray'
    },
})
