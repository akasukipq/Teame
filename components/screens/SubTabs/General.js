import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { List, ListItem } from 'native-base';
import datatest from './data';
import { tsConstructorType } from '@babel/types';

function Item({ title, vitri, parent }) {
  return (
    <TouchableOpacity
      onPress={() => {
        datatest.splice(vitri, 1);
        parent.refreshFlatList();
      }}>
      <View style={{padding:5}}>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export class General extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      deletedRKey: true,
    })
  }
  refreshFlatList = () => {
    //Đây là 1 trick, khi state thay đổi thì render được gọi
    this.setState((prevState) => {
      return {
        deletedRKey: !prevState.deletedRKey
      }
    });

  }

  render() {
    return (
      <View>
        <Text>Đây những việc cần làm</Text>
        <FlatList
          data={datatest}
          renderItem={({ item, index }) => <Item title={item} vitri={index} parent={this} />}
          keyExtractor={item => item.id}
          extraData={this.state.deletedRKey}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderStyle: "solid",
    borderEndColor: "gray",
    borderBottomWidth: 1
  }
});
