import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Header, Container, Content, Body } from 'native-base';
import TodoDetail from '../SubTabs/TodoDetail';
export default class TodoDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let info = this.props.navigation.state.params;
    return (
      <Container>
        <Header>
          <Body>
            <Text style={styles.title}>{info.name}</Text>
          </Body>
        </Header>
        <Content>
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