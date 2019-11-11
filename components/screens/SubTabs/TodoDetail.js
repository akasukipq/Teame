import React, { Component } from 'react';
import { TextInput, Modal, Button, View, Text, SafeAreaView, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { getAllTodobyTodoListID, insertTodo } from "../../../database/schema";
import realm from '../../../database/schema';
import AddTodo2Todolist from '../../common/AddTodo2Todolist';

function Item({ data, i, navigation }) {

  return (

    <View style={styles.item}>
      <Text>{data.name}</Text>
    </View>
  );

}

export default class TodoDetail extends Component {
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
    getAllTodobyTodoListID(this.props.todoListId).then(list => {
      this.setState({
        list //vì cùng kiểu dữ liệu nên không cần set : mà để vậy
        //nó tự hiểu
      })
    }).catch(error => {
      this.setState({
        list: []
      })
    })
  }

  render() {
    return (
      <View>

        <Button
          title='Thêm todo..'
          onPress={() => {
            this.refs.popupInsert.show();
          }}></Button>

        <FlatList
          data={this.state.list}
          renderItem={({ item, index }) => <Item data={item} i={index}></Item>}
          keyExtractor={item => item.id.toString()}
        />
        <AddTodo2Todolist ref="popupInsert" func={insertTodo} todoListId={this.props.todoListId} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
})