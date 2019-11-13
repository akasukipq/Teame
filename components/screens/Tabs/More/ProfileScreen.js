import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Thumbnail, Text } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'react-native-firebase';
export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            photoURL: '',
            photoName: '',
            photoType: '',
            saved: false
        };

        this.storageRef = firebase.storage();
    }

    imagePicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        }).then(val => {
            console.log('uri = ', val);
            this.setState({
                photoName: val.name,
                photoType: val.type

            })
            RNFetchBlob.fs.stat(val.uri)
                .then(stats => {
                    console.log('path = ', 'file://' + stats.path);
                    this.setState({
                        photoURL: 'file://' + stats.path
                    })
                });
        }).catch(error => console.log(error));
    }

    render() {
        let user = this.props.navigation.state.params.user;
        return (
            <Container>
                <Header>
                    <Left>
                        <TouchableOpacity transparent>
                            <Icon name="md-close" />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Title>Chỉnh sửa thông tin cá nhân</Title>
                    </Body>
                </Header>
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <View style={styles.pro5}>
                            <Text>Ảnh đại diện</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => { this.imagePicker() }}>
                            <Thumbnail style={styles.pro5} large source={{ uri: this.state.photoURL ? this.state.photoURL : user.photoURL }} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View>
                            <Text style={{ marginLeft: 10 }}>Tên hiển thị</Text>
                            <TextInput defaultValue={user.name} placeholder="John Doe..." style={{ borderColor: 'gray', borderWidth: 1, margin: 10 }}
                                onChangeText={(text) => { this.setState({ name: text }) }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: 10 }}>Email</Text>
                            <TextInput defaultValue={user.email} placeholder="yourmail@mail.com..." style={{ borderColor: 'gray', borderWidth: 1, margin: 10 }}
                                onChangeText={(text) => { this.setState({ email: text }) }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: 10 }}>Khác</Text>
                            <TextInput placeholder="Nói gì đó về bạn..." style={{ borderColor: 'gray', borderWidth: 1, margin: 10 }} />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button title="Lưu"
                                onPress={() => {
                                    console.log('tên = ', this.state.name, ' ảnh = ', this.state.photoURL);
                                    if (this.state.photoURL != '') {
                                        //lưu lên storage
                                        this.storageRef.ref('avatars').child(this.state.photoName).putFile(this.state.photoURL, { contentType: this.state.photoType, cacheControl: 'no-store' })
                                            .then(image => {
                                                let metadata = image.metadata;
                                                //then we get url base on metadata.name in storage
                                                this.storageRef.ref('avatars').child(metadata.name).getDownloadURL()
                                                    .then(url => {
                                                        //có thay đổi ảnh
                                                        firebase.auth().currentUser.updateProfile({
                                                            photoURL: url
                                                        }).then(() => {
                                                            //update trong firestore
                                                            firebase.firestore().collection('users').doc(user.uid).update({
                                                                photoURL: url
                                                            });
                                                        });
                                                    });
                                            })
                                    };
                                    if (this.state.name != '' && this.state.name != user.displayName) {
                                        //có thay đổi tên
                                        firebase.auth().currentUser.updateProfile({
                                            displayName: this.state.name
                                        }).then(() => {
                                            //update trong firestore
                                            firebase.firestore().collection('users').doc(user.uid).update({
                                                name: this.state.name
                                            });
                                            //update state
                                            this.setState({
                                                name: ''
                                            });
                                        });
                                    };
                                }}></Button>
                        </View>
                    </View>
                </View>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    pro5: {
        marginBottom: 10
    }
});