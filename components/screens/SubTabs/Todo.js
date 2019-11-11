import React, { Component } from 'react';
import { TextInput, Modal, Button, View, Text, SafeAreaView, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
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

class Todo extends Component {

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

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <Button
                    title='Thêm todolist..'
                    onPress={() => {
                        this.refs.popupInsert.show();
                    }}></Button>

                <FlatList
                    data={this.state.list}
                    numColumns={2}
                    renderItem={({ item, index }) => <Item data={item} i={index} modal={this.refs.popupInsert} navigation={this.props.navigation}></Item>}
                    keyExtractor={item => item.id}
                />
                <AddTodo ref="popupInsert" func={insertTodoList} />
            </SafeAreaView>
        );
    }
}

export default withNavigation(Todo);

const styles = StyleSheet.create({
    container: {
    },
    item: {
        flexBasis: "50%",
    },
    containerItem: {
        backgroundColor: "white",
        padding: 30,
        margin: 10,
        borderRadius: 15,
        elevation: 2,
    },
    text: {
        color: "#184576",
        fontSize: 20,
        fontWeight: "bold"
    }
})