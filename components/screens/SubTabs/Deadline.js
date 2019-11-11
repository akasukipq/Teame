import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'react-native-firebase';
//import '@react-native-firebase/auth';

export default class Deadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> Deadline </Text>
        <Button title="Dang xuat"
        onPress={() => {
          firebase.auth().signOut();
        }}/>
      </View>
    );
  }
}
