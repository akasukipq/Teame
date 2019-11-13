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
    this.state = {
      user: null
    }
    this.unsubscriber = null;
  }

  componentDidMount() {
    this.unsubscriber = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      .onSnapshot(user => {
        this.setState({
          user: user.data()
        })
      });
  }

  render() {
    //console.log('user = ', this.state.user);
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
          {this.state.user && <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Thumbnail style={styles.pro5} large source={{ uri: this.state.user.photoURL }} />
            <View style={styles.pro5}>
              <Text>{this.state.user.name}</Text>
            </View>
            <View style={styles.pro5}>
              <Text>{this.state.user.email}</Text>
            </View>
            <Button onPress={() => { this.props.navigation.navigate('Pro5', { user: this.state.user }) }}><Text>Chỉnh sửa</Text></Button>
          </View>}
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
