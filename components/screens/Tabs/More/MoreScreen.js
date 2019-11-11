import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Button, Thumbnail } from 'native-base';
import firebase from 'react-native-firebase';

export default class MoreScreen extends Component {

  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser;
  }

  componentDidMount() {
    this.user = firebase.auth().currentUser;
  }

  render() {
    console.log('ảnh = ', this.user.photoURL);
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Thêm</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Thumbnail style={styles.pro5} large source={{ uri: this.user.photoURL }} />
            <View style={styles.pro5}>
              <Text>{this.user.displayName}</Text>
            </View>
            <View style={styles.pro5}>
              <Text>{this.user.email}</Text>
            </View>
            <Button onPress={() => {this.props.navigation.navigate('Pro5')}}><Text>Chỉnh sửa</Text></Button>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  pro5: {
    marginBottom: 10
  }
});
