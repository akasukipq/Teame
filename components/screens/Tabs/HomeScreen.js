import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions, AsyncStorage } from 'react-native';
import { Container, Header, Content, Footer, Title, Button, Segment, Body, Text, Right, Left, Icon, Tab, Tabs, Thumbnail } from 'native-base';
//import { General } from '../SubTabs/General';
//import MenuHome from '../../common/MenuHome'
import firebase from 'react-native-firebase';
import NavigationService from '../../common/NavigationService';
import Carousel from 'react-native-snap-carousel';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      avatars: [],
      active: false
    };
  }
  componentDidMount() {
    firebase.firestore().collection('cards').where('members', 'array-contains', firebase.auth().currentUser.uid)
      .onSnapshot(query => {
        const cards = [];
        query.forEach(doc => {
          const membersAvatar = [];

          doc.data().members.forEach(m => {
            firebase.firestore().collection('users').doc(m).get()
              .then(user => {
                membersAvatar.push({
                  id: user.data().uid,
                  avatar: user.data().photoURL,
                });
                this.setState({
                  active: !this.state.active
                });
              });
          });

          cards.push({
            id: doc.id,
            name: doc.data().name,
            label: doc.data().label,
            members: membersAvatar,
            deadline: doc.data().deadline,
            lid: doc.data().lid,
            bid: doc.data().bid
          });

          console.log('memerrrr = ', membersAvatar);
        });
        this.setState({ cards });

      });
  }

  renderMembers = (members) => {
    return (
      members.map((member) => (
        <Thumbnail
          key={member.id} style={styles.avatar} source={{ uri: member.avatar }}></Thumbnail>
      ))
    )
  }
  render() {
    var info = this.props.navigation.state.params;
    return (
      <Container>
        <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
          <Body style={{ padding: 10 }}>
            <Title style={{ color: "#F3C537" }}>Tổng quan</Title>
          </Body>
        </Header>
        <View style={{ flex: 1, backgroundColor: "#21272E" }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ borderWidth: 1, borderColor: "#5C646F", borderRadius: 90.0, backgroundColor: "#5C646F", width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="table" type="FontAwesome" style={{ color: "#F95F62" }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: "#F95F62", fontSize: 40 }}> 3 </Text>
                <Text style={{ color: "white" }}>bảng</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ borderWidth: 1, borderColor: "#5C646F", borderRadius: 90, backgroundColor: "#5C646F", width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="md-checkbox-outline" style={{ color: "#00A6FF" }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: "#00A6FF", fontSize: 40 }} > 3 </Text>
                <Text style={{ color: "white" }}>checklist</Text>
              </View>

            </View>
          </View>
          <View style={{ marginTop: 10, padding: 10 }}>
            <Text style={{ color: 'white' }}>Thẻ công việc của bạn</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Carousel
              swipeThreshold={0}
              layout={'default'}
              data={this.state.cards}
              ref={(c) => { this._carousel = c; }}
              renderItem={({ item }) => {
                return (
                  <View style={styles.itemContainer}>
                    <TouchableOpacity style={{ borderRadius: 20, borderWidth: 1, borderColor: "#21272E", overflow: 'hidden' }}
                      onPress={() => {
                        const users = [];

                        firebase.firestore().collection('boards').doc(item.bid).get()
                          .then(doc => {
                            doc.data().members.forEach(val => {
                              firebase.firestore().collection('users').doc(val).get()
                                .then(user => {
                                  let position = doc.data().author == user.data().uid ? 'ADMIN' : 'MEMBER';
                                  users.push({
                                    uid: user.data().uid,
                                    name: user.data().name,
                                    avatar: user.data().photoURL,
                                    email: user.data().email,
                                    pos: position
                                  });

                                  this.setState({
                                    active: !this.state.active
                                  });
                                });
                            });

                            firebase.firestore().collection('boards').doc(item.bid).collection('lists').doc(item.lid)
                              .get().then(list => {
                                let namee = list.data().name;
                                NavigationService.navigate('Chi tiết card', { id: item.id, name: namee, members: users });
                              });
                          });
                      }}>
                      <View style={{ backgroundColor: "#F3C537", padding: 10}}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                          <View>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.name}</Text>
                          </View>
                        </View>
                        <View style={styles.itemMember}>
                          {this.renderMembers(item.members)}
                        </View>
                      </View>
                      <View style={styles.actionContainer}>
                        <View style={{ marginBottom: 10 }}>
                          {item.label && <Text style={{ color: item.label.color }}>{item.label.name}</Text>}
                        </View>
                        <View style={styles.deadline}>
                          <Icon name='md-time' style={{ fontSize: 14, color: '#F3C537' }} />
                          <Text style={styles.showdeadline}>Ngày hết hạn: {item.deadline}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={Dimensions.get("window").width - 100}
              lockScrollWhileSnapping={true}
            />
          </View>
        </View>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  menuButton: {
    borderRadius: 25
  },
  itemContainer: {
    //backgroundColor: 'white',
    //elevation: 3,
    //padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#21272E',
    backgroundColor: 'white',
    //height: 350
  },
  itemMember: {
    flexDirection: 'row',
    marginTop: 10
  },
  avatar: {
    width: 50,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 30,
  },
  actionContainer: {
    //marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'white',
    //borderTopWidth: 1,
    //borderTopColor: '#8492A6',
    padding: 10
  },
  deadline: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  showdeadline: {
    marginLeft: 5,
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