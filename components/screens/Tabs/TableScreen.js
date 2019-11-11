import React, { Component } from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon } from 'native-base';
import BoardView from '../../screens/SubTabs/BoardView';
import AddBoard from '../../common/Board/AddBoard';

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.showAdd = this.showAdd.bind(this);
  }

  showAdd() {
    this.refs.modalThemBang.show();
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Bảng</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="search" />
            </Button>
            <Button transparent>
              <Icon name="notifications" />
            </Button>
          </Right>
        </Header>
        <Content contentContainerStyle={{ flex: 1 }}>
        <AddBoard ref={'modalThemBang'}></AddBoard>
          <BoardView modal={this.showAdd} />
        </Content>
      </Container>
    );
  }
}
