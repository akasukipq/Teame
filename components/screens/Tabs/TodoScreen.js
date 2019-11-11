import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';
import { Header, Container, Content, Body } from 'native-base';
import Todo from '../SubTabs/Todo';

export default class TodoScreen extends Component {

  componentDidMount() {
    //database.init();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Text style={styles.title}>Todo List</Text>
          </Body>
        </Header>
        <Content>
        <Todo/>
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
