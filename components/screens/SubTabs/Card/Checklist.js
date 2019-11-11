import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import firebase from 'react-native-firebase';
//import '@react-native-firebase/firestore';

const DT = [
  {
    id: 1,
    name: 'công việc',
    isDone: false
  }
]
function Item({ data, fb }) {
  return (
    <TouchableOpacity onPress={() => {
      fb.collection('checklist').doc(data.id).update({
        isDone: !data.isDone
      })
    }}>
      <View style={styles.item}>
        <Icon name={data.isDone ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"}
          style={data.isDone ? { marginRight: 5, color: 'green' } : { marginRight: 5, color: "#e8e4e3" }}></Icon>
        <Text>{data.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default class Checklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkList: [],
      newck: ''
    };
    this.unsubscriber = null;
    this.ref = firebase.firestore().collection('cards').doc(this.props.data.id);
  }

  componentDidMount() {
    this.unsubscriber = this.ref.collection('checklist').onSnapshot((query) => {
      const checkList = [];
      //cập nhật số lượng list
      this.ref.update({
        numList: query._docs.length
      });

      query.forEach(doc => {

        checkList.push({
          id: doc.id,
          name: doc.data().name,
          isDone: doc.data().isDone
        });
      });
      this.setState({
        checkList
      });
    });
  }

  UNSAFE_componentWillMount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    };
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.title}>
            <Icon type='FontAwesome5' name='calendar-check' style={[styles.article, { fontSize: 14, }]}></Icon>
            <Text style={[{ marginLeft: 5 }, styles.article]}>Danh sách công việc</Text>
          </View>
          <View style={styles.itemadd}>
            <TextInput placeholder="Thêm công việc mới..." style={{ borderBottomWidth: 1, flex: 8 }}
              onChangeText={(text) => {
                this.setState({
                  newck: text
                })
              }} />
            <Button title="Thêm" style={{ flex: 2 }} onPress={() => {
              this.ref.collection('checklist').add({
                name: this.state.newck,
                isDone: false
              })
            }} />
          </View>
          <FlatList
            data={this.state.checkList}
            renderItem={({ item }) => <Item data={item} fb={this.ref}></Item>}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    marginTop: 10
  },
  sectionAdd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  article: {
    color: 'gray'
  },
  item: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e8e4e3",
    padding: 10
  },
  itemadd: {
    flexDirection: 'row',
    //marginTop: 10, 
    alignItems: 'center',
    padding: 10
  }
})
