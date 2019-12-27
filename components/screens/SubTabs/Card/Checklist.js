import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, Text } from 'native-base';
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
        <Icon name={data.isDone ? "md-checkbox" : "md-square-outline"}
          style={data.isDone ? { marginRight: 5, color: '#F3C537' } : { marginRight: 5, color: "#F3C537" }}></Icon>
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
      <ScrollView style={{ padding: 10 }}>
        <View style={styles.section}>
          <View style={styles.title}>
            <Icon type='FontAwesome5' name='calendar-check' style={[styles.article, { fontSize: 14, }]}></Icon>
            <Text style={[{ marginLeft: 5 }, styles.article]}>Danh sách công việc</Text>
          </View>
          <View style={styles.itemadd}>
            <TextInput value={this.state.newck} placeholder="Thêm công việc mới..."
              onChangeText={(text) => {
                this.setState({
                  newck: text
                })
              }} />
            <TouchableOpacity
              onPress={() => {
                this.ref.collection('checklist').add({
                  name: this.state.newck,
                  isDone: false
                })
                this.setState({
                  newck: ''
                })
              }}><Text style={{ color: '#F3C537' }}>THÊM</Text>
            </TouchableOpacity>
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
    //marginTop: 10,
    alignItems: 'center',
    padding: 10
  },
  itemadd: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    //marginTop: 10, 
    alignItems: 'center',
    padding: 10
  }
})
