import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Content, Footer, Title, Button, Segment, Body, Text, Right, Left, Icon, Tab, Tabs } from 'native-base';
import { General } from '../SubTabs/General';
import MenuHome from '../../common/MenuHome'

export default class HomeScreen extends Component {
  render() {
    var info = this.props.navigation.state.params;
    return (
      <Container>
        <Header androidStatusBarColor="#184576" style={{ backgroundColor: "#184576" }}>
          <Body>
            <Title>Trang chủ</Title>
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
        <MenuHome />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  menuButton: {
    borderRadius: 25
  }
});
/*
        <Content>
          <Tabs>
            <Tab heading="Todo-List">
              <General />
            </Tab>
            <Tab heading="Deadline">
              <General />
            </Tab>
            <Tab heading="Đang follow">
              <General />
            </Tab>
          </Tabs>
        </Content>
*/