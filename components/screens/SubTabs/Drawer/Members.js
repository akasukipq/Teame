import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon, List, ListItem, Thumbnail } from 'native-base';
import AddMember from '../../../common/Board/AddMember';
import firebase from 'react-native-firebase';

function Member({ data, removeMember }) {
  return (
    <ListItem thumbnail>
      <Left>
        <Thumbnail source={{ uri: data.avatar }} />
      </Left>
      <Body>
        <Text>{data.name}</Text>
        <Text note numberOfLines={1}>{data.pos}</Text>
        <Text note numberOfLines={1}>{data.email}</Text>
      </Body>
      <Right>
        {data.pos == 'MEMBER' &&
          <Button transparent
            onPress={() => {
              removeMember(data);
            }}>
            <Text>XÓA</Text>
          </Button>
        }
      </Right>
    </ListItem>
  )
};

export default class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listMemberId: [],
      members: []

    };
  }

  showModal = () => {
    this.refs.modalThemMem.show();
  }

  componentDidMount() {
    let listMemberId = this.props.navigation.state.params.members.map(mem => mem.uid);
    let members = this.props.navigation.state.params.members;
    this.setState({ listMemberId, members });
  }

  removeMember = (data) => {
    //xóa trong database trước
    const temp = this.state.listMemberId;
    let index = this.state.listMemberId.indexOf(data.uid);
    temp.splice(index, 1);
    this.setState({
      listMemberId: temp
    });
    firebase.firestore().collection('boards').doc(this.props.navigation.state.params.id).update({
      members: temp
    }).then(() => {
      //xóa chay sau
      const oldMembers = this.state.members;
      let index = oldMembers.indexOf(data);
      oldMembers.splice(index, 1);
      this.setState({
        members: oldMembers
      });
    });

  };

  render() {
    let members = this.props.navigation.state.params.members;
    let bid = this.props.navigation.state.params.id;
    let bname = this.props.navigation.state.params.name;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon name="arrow-round-back" style={{ color: "#fff" }} />
            </Button>
          </Left>
          <Body>
            <Title>Thành viên</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {
              this.showModal();
            }}>
              <Icon name="md-add" />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={styles.container}>
          <List>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={members}
              renderItem={({ item }) => <Member data={item} removeMember={this.removeMember}></Member>}
              keyExtractor={item => item.name}
            />
          </List>
        </Content>
        <AddMember ref={'modalThemMem'} bid={bid} bname={bname} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

})
