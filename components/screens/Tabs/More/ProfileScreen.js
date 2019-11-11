import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Thumbnail, Text } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'react-native-firebase';
export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            photoURL: '',
            saved: false
        };

        this.storageRef = firebase.storage();
    }

    imagePicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        }).then(val => {
            this.storageRef.ref('avatars').child(val.name).putFile(val.uri, { contentType: val.type, cacheControl: 'no-store' })
                .then(image => {
                    let metadata = image.metadata;
                    this.storageRef.ref('avatars').child(metadata.name).getDownloadURL()
                        .then(url => {
                            console.log('url = ', url);
                            this.setState({
                                photoURL: url
                            })
                        });
                })
                .catch(error => {
                    console.log("lỗi ", error);
                })
        }).catch(error => console.log(error));
    }

    render() {
        let user = firebase.auth().currentUser;
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
                        onPress={() => {this.imagePicker()}}>
                            <Thumbnail style={styles.pro5} large source={{ uri: user.photoURL }} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View>
                            <Text style={{ marginLeft: 10 }}>Tên hiển thị</Text>
                            <TextInput defaultValue={user.displayName} placeholder="John Doe..." style={{ borderColor: 'gray', borderWidth: 1, margin: 10 }}
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
                                    user.updateProfile({
                                        displayName: this.state.name,
                                        photoURL: this.state.photoURL
                                    }).then(() => {
                                        user.reload();
                                    });
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