import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Header, Container, Content, Body, Left, Button, Icon, Title, Right } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import TodoDetail from '../SubTabs/TodoDetail';
import { deleteTodoList } from '../../../database/schema';

export default class TodoDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goback = () => {
    this.props.navigation.goBack();
  }

  render() {
    let info = this.props.navigation.state.params;
    return (
      <Container>
        <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name="arrow-round-back" style={{ color: "#F3C537" }} />
            </Button>
          </Left>
          <Body style={{ padding: 10 }}>
            <Title style={{ color: "#F3C537" }}>{info.name}</Title>
          </Body>
          <Right>
            <Menu
              ref={'menu'}
              button={<TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }}
                onPress={() => { this.refs.menu.show() }}>
                <Icon name="more" style={{ color: '#F3C537' }} />
              </TouchableOpacity>}
            >
              <MenuItem onPress={() => {
                Alert.alert(
                  'Xóa danh mục',
                  'Bạn muốn xóa mục này? Dữ liệu của danh mục sẽ bị mất, thao tác này không thể hoàn lại.',
                  [
                    {
                      text: 'Hủy',
                      style: 'cancel',
                    },
                    {
                      text: 'Xóa', onPress: () => {
                        deleteTodoList(info);
                        this.refs.menu.hide();
                        this.props.navigation.goBack();
                      }
                    },
                  ],
                  { cancelable: false },
                );
              }}>Xóa</MenuItem>
            </Menu>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#21272E" }}>
          <TodoDetail todoListId={info.id} />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e6e6e6",
  },
  title: {
    color: "white",
    fontWeight: "bold"
  }
})