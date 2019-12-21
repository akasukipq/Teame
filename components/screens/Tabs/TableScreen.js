import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text
} from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon, Fab, Thumbnail } from 'native-base';
import AddBoard from '../../common/Board/AddBoard';
import firebase from 'react-native-firebase';
import RenderBoard from '../../common/Board/RenderBoard';

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listBoard: [],
      boardname: '',
      primary: false,
      active: false,
    };
    this.ref = firebase.firestore().collection('boards');
    this.unsubscriber = null;
    this.showAdd = this.showAdd.bind(this);
  }

  showAdd() {
    this.refs.modalThemBang.show();
  };

  componentDidMount() {
    this.unsubscriber = this.ref.where('members', 'array-contains', firebase.auth().currentUser.uid).onSnapshot((query) => {
      const boards = [];

      query.forEach(doc => {

        let board = doc;
        const users = [];
        board.data().members.forEach(val => {
          firebase.firestore().collection('users').doc(val).get()
            .then(user => {
              users.push({
                uid: user.data().uid,
                name: user.data().name,
                avatar: user.data().photoURL,
                email: user.data().email
              });

              this.setState({
                active: !this.state.active
              });
            });
        })

        boards.push({
          id: board.id,
          name: board.data().name,
          primary: board.data().primary,
          timestamp: board.data().timestamp,
          members: users
        })
      });

      this.setState({
        listBoard: boards,
      });
    });
  }

  UNSAFE_componentWillMount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Bảng</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={() => { this.props.navigation.navigate('Tìm kiếm', {'boards': this.state.listBoard}) }}>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flex: 1 }}>
          <AddBoard ref={'modalThemBang'}></AddBoard>
          <View style={styles.container}>
            <View style={{ marginLeft: 15 }}>
              <Text style={{ color: '#8492A6', fontSize: 14, fontWeight: 'bold' }}>Danh sách bảng</Text>
            </View>
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.listBoard}
                renderItem={({ item }) => <RenderBoard data={item} navigation={this.props.navigation}></RenderBoard>}
                keyExtractor={item => item.id}
                extraData={this.state.active}
              />
            </View>
            <Fab
              position="bottomRight"
              style={{ backgroundColor: '#5067FF' }}
              onPress={() => {
                this.showAdd();
              }}
            >
              <Icon name="md-add" />
            </Fab>
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10
  },
})