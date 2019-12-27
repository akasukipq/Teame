import React, { Component, useReducer } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon, Fab, Text } from 'native-base';
import AddBoard from '../../common/Board/AddBoard';
import firebase from 'react-native-firebase';
import RenderBoard from '../../common/Board/RenderBoard';

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listNormalBoard: [],
      listSpecBoard: [],
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
      const SpecBoards = [];
      const NormBoards = [];
      query.forEach(doc => {

        let board = doc;
        const users = [];
        board.data().members.forEach(val => {
          firebase.firestore().collection('users').doc(val).get()
            .then(user => {
              let position = board.data().author == user.data().uid ? 'ADMIN' : 'MEMBER';
              users.push({
                uid: user.data().uid,
                name: user.data().name,
                avatar: user.data().photoURL,
                email: user.data().email,
                token: user.data().token,
                pos: position
              });

              this.setState({
                active: !this.state.active
              });
            });
        })

        if (board.data().primary == true) {
          SpecBoards.push({
            id: board.id,
            name: board.data().name,
            primary: board.data().primary,
            timestamp: board.data().timestamp,
            author: board.data().author,
            members: users
          });
        } else {
          NormBoards.push({
            id: board.id,
            name: board.data().name,
            primary: board.data().primary,
            timestamp: board.data().timestamp,
            author: board.data().author,
            members: users
          });
        }
      });

      this.setState({
        listSpecBoard: SpecBoards,
        listNormalBoard: NormBoards
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
        <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
          <Body style={{ padding: 10 }}>
            <Title style={{ color: "#F3C537" }}>Bảng</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={() => { this.props.navigation.navigate('Tìm kiếm', { 'boards': [...this.state.listNormalBoard, ...this.state.listSpecBoard] }) }}>
              <Icon style={{ color: "#F3C537" }} name="search" />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flex: 1, padding: 10 }}>
          <AddBoard ref={'modalThemBang'}></AddBoard>
          <View >
            <Text style={{ color: '#8492A6', fontWeight: 'bold' }}>Danh sách bảng</Text>
          </View>
            <ScrollView style={{paddingBottom: 30}}>
              <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={this.state.listSpecBoard}
                renderItem={({ item }) => <RenderBoard data={item} navigation={this.props.navigation}></RenderBoard>}
                keyExtractor={item => item.id}
                extraData={this.state.active}
              />
              <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={this.state.listNormalBoard}
                renderItem={({ item }) => <RenderBoard data={item} navigation={this.props.navigation}></RenderBoard>}
                keyExtractor={item => item.id}
                extraData={this.state.active}
              />
            </ScrollView>
        </Content>
        <Fab
          position="bottomRight"
          style={{ backgroundColor: '#21272E' }}
          onPress={() => {
            this.showAdd();
          }}
        >
          <Icon style={{ color: "#F3C537" }} name="md-add" />
        </Fab>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //margin: 10,
    padding: 10
  },
})