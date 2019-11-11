import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon } from 'native-base';
import AddMember from '../../../common/Board/AddMember';

function Member({ data }) {
  return (
    <View>
      <Text>{data.name}</Text>
    </View>
  )
};

export default class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showModal = () => {
    this.refs.modalThemMem.show();
  }

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
          <View>
            <Text style={{ color: '#8492A6', fontSize: 14, fontWeight: 'bold' }}>Danh sách thành viên</Text>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={members}
            renderItem={({ item }) => <Member data={item}></Member>}
            keyExtractor={item => item.name}
          />
        </Content>
        <AddMember ref={'modalThemMem'} bid={bid} bname={bname} />
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
