import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity, PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'react-native-firebase';
import { Icon, Fab, Button } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';

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


    async request_storage_runtime_permission() {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': 'ReactNativeCode Storage Permission',
                    'message': 'ReactNativeCode App needs access to your storage to download Photos.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                Alert.alert("Storage Permission Granted.");
            }
            else {

                Alert.alert("Storage Permission Not Granted");

            }
        } catch (err) {
            console.warn(err)
        }
    }


    downloadImage = (url) => {
        var date = new Date();
        var image_URL = url;
        var ext = this.getExtention(image_URL);
        ext = "." + ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + "/image_" + Math.floor(date.getTime()
                    + date.getSeconds() / 2) + ext,
                description: 'Image'
            }
        }
        config(options).fetch('GET', image_URL).then((res) => {
            Alert.alert("Tải ảnh thành công!");
        });
    }

    downloadFile = (url) => {
        var date = new Date();
        var file_URL = url;
        var ext = this.getExtention(file_URL);
        ext = "." + ext[0];
        const { config, fs } = RNFetchBlob;
        let FileDir = fs.dirs.DownloadDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: FileDir + "/document_" + Math.floor(date.getTime()
                    + date.getSeconds() / 2) + ext,
                description: 'Document'
            }
        }
        config(options).fetch('GET', file_URL).then((res) => {
            Alert.alert("Tải file thành công!");
        });
    }


    getExtention = (filename) => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
            undefined;
    }


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



    async componentDidMount() {
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


        await this.request_storage_runtime_permission();

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

                <TouchableOpacity 
                onPress={() => {
                    this.downloadFile(item.url);
                }}
                style={{
                    flex: 1,
                    flexDirection: 'row-reverse'
                }}>
                    <Icon name='md-download' />
                </TouchableOpacity>

            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
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
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.downloadImage(item.url);
                                        }}>
                                        <Image style={{ width: 150, height: 100, borderRadius: 5, marginLeft: 5, marginTop: 5 }} source={{ uri: item.url }} resizeMethod={'resize'} ></Image>
                                    </TouchableOpacity>}
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
