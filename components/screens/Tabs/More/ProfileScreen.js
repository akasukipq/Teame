import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Button, Body, Left, Icon, Title, Right, Thumbnail, Text, Form, Label, Input, Item } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'react-native-firebase';
export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.navigation.state.params.name,
            email: this.props.navigation.state.params.email,
            photoURL: '',
            photoName: '',
            photoType: '',
            saved: false
        };

        this.storageRef = firebase.storage();
    }

    imagePicker = () => {
        let user = this.props.navigation.state.params;
        DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        }).then(val => {
            console.log('uri = ', val);
            this.setState({
                photoName: val.name,
                photoType: val.type

            });
            this.storageRef.ref('avatars').child(val.name).putFile(val.uri, { contentType: val.type, cacheControl: 'no-store' })
                .then(image => {
                    let metadata = image.metadata;
                    //then we get url base on metadata.name in storage
                    this.storageRef.ref('avatars').child(metadata.name).getDownloadURL()
                        .then(url => {
                            this.setState({ photoURL: url })
                        });
                });
            /*RNFetchBlob.fs.stat(val.uri)
                .then(stats => {
                    console.log('path = ', 'file://' + stats.path);
                    this.setState({
                        photoURL: 'file://' + stats.path
                    })
                });
                */
        }).catch(error => console.log(error));
    }


    render() {
        let user = this.props.navigation.state.params;
        return (
            <Container>
                <Header noShadow>
                    <Left>
                        <Button transparent>
                            <Icon name="arrow-back" color="white" />
                        </Button>
                    </Left>
                    <Body >
                        <Title>Sửa thông tin</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => {
                                if (this.state.photoURL != '') {
                                    //có thay đổi ảnh
                                    firebase.auth().currentUser.updateProfile({
                                        photoURL: url
                                    }).then(() => {
                                        //update trong firestore
                                        firebase.firestore().collection('users').doc(user.uid).update({
                                            photoURL: url
                                        });
                                    });
                                }

                                //có thay đổi tên
                                firebase.auth().currentUser.updateProfile({
                                    displayName: this.state.name,
                                    email: this.state.email
                                }).then(() => {
                                    //update trong firestore
                                    firebase.firestore().collection('users').doc(user.uid).update({
                                        name: this.state.name,
                                        email: this.state.email
                                    }).then(() => {Alert.alert('Thông báo', 'Cập nhật thông tin thành công!')});
                                    //update state
                                    this.setState({
                                        name: ''
                                    });
                                    
                                });
                            }}>
                            <Title>LƯU</Title>
                        </Button>
                    </Right>
                </Header>
                <View>
                    <View style={{ backgroundColor: '#3F51B5', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <TouchableOpacity
                            onPress={() => { this.imagePicker() }}>
                            <Thumbnail large style={styles.pro5} large source={{ uri: this.state.photoURL ? this.state.photoURL : user.photoURL }} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Form>
                            <Item stackedLabel>
                                <Label>Tài khoản</Label>
                                <Input defaultValue={user.name} placeholder="John Doe..."
                                    onChangeText={(text) => { this.setState({ name: text }) }} />
                            </Item>
                            <Item stackedLabel last>
                                <Label>Email</Label>
                                <Input defaultValue={user.email} placeholder="yourmail@mail.com..."
                                    onChangeText={(text) => { this.setState({ email: text }) }} />
                            </Item>
                        </Form>
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