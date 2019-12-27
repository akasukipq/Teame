import React, { Component } from 'react';
import {
  Button, View, SafeAreaView, FlatList, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native';
import { Header, Container, Content, Body, Text, Title, Icon, Fab } from 'native-base';
import { insertTodoList, updateTodoList, deleteTodoList, getAllTodoList } from "../../../database/schema";
import realm from '../../../database/schema';
import AddTodo from '../../common/AddTodo';

function Item({ data, i, navigation }) {
  if (data.id === '000') {

  }
  else {
    return (

      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chi tiết', data);
          }}>
          <View style={styles.containerItem}>
            <View style={{ flexDirection: "row-reverse" }}>
              <View style={{ width: 20, height: 20, borderWidth: 2, borderRadius: 180 }} />
            </View>
            <Text style={styles.text}>{data.name}</Text>
            <Text style={{ color: "grey" }}>{data.todos.length} công việc</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

export default class TodoScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
    this.refreshData();
    realm.addListener('change', () => {
      this.refreshData();
    })
  }


  refreshData = () => {
    getAllTodoList().then(list => {
      this.setState({
        list //vì cùng kiểu dữ liệu nên không cần set : mà để vậy
        //nó tự hiểu
      })
    }).catch(error => {
      this.setState({
        in: 0,
        list: []
      })
    })
  }


  showAdd() {
    this.refs.popupInsert.show();
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
          <Body style={{ padding: 10 }}>
            <Title style={styles.title}>Ghi chú</Title>
          </Body>
        </Header>
        <Content style={{ backgroundColor: "#21272E" }}>

          <FlatList
            data={this.state.list}
            numColumns={2}
            renderItem={({ item, index }) => <Item data={item} i={index} modal={this.refs.popupInsert} navigation={this.props.navigation}></Item>}
            keyExtractor={item => item.id}
          />
          <AddTodo ref="popupInsert" func={insertTodoList} />
        </Content>
        <Fab
          position="bottomRight"
          style={{ backgroundColor: '#F3C537' }}
          onPress={() => {
            this.showAdd();
          }}
        >
          <Icon style={{ color: "#21272E" }} name="md-add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e6e6e6",
  },
  title: {
    color: "#F3C537",
    //fontWeight: "bold"
  },
  item: {
    flexBasis: "50%",
  },
  containerItem: {
    backgroundColor: "white",
    padding: 30,
    margin: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#F3C537',
    elevation: 2,
  },
  text: {
    color: "#F3C537",
    fontSize: 20,
    fontWeight: "bold"
  }
})
