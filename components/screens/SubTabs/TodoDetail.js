import React, { Component } from 'react';
import { Modal, Button, View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Text, Input } from 'native-base';
import { withNavigation } from 'react-navigation';
import { getAllTodobyTodoListID, insertTodo, updateTodo, deleteTodo } from "../../../database/schema";
import realm from '../../../database/schema';
import AddTodo2Todolist from '../../common/AddTodo2Todolist';

function Item({ data, i, navigation }) {

  return (

    <TouchableOpacity onPress={() => {

    }}>
      <View style={{
        flexDirection: 'row',
        //marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
      }}>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center',
        }}
          onPress={() => {
            let newData = {
              id: data.id,
              name: data.name,
              done: !data.done
            };
            updateTodo(newData);
          }}
        >
          <Icon name={data.done ? "md-checkbox" : "md-square-outline"}
            style={data.done ? { marginRight: 10, color: '#F3C537' } : { marginRight: 10, color: "#F3C537" }}></Icon>
          <Text style={{ color: '#FFF' }}>{data.name}</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              deleteTodo(data.id);
            }}>
            <Icon name="md-close" style={{ color: '#F3C537' }} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

}

export default class TodoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      input: ''
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
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Input placeholder="Todo mới..." placeholderTextColor="#F3C537"
            style={{ color: 'white' }}
            value={this.state.input}
            onChangeText={(text) => {
              this.setState({
                input: text
              });
            }} />
          <TouchableOpacity
            onPress={() => {
              const newTodo = {
                id: Math.floor(Date.now() / 1000),
                name: this.state.input,
                done: false
              };

              insertTodo(newTodo, this.props.todoListId);
              this.setState({ input: '' });

            }}>
            <Text style={{ color: '#F3C537', marginRight: 10 }}>THÊM</Text>
          </TouchableOpacity>
        </View>


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