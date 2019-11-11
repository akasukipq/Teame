import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon, DatePicker, Fab, Thumbnail } from 'native-base';
import AddLabel from '../../../common/Card/AddLabel';
import AddMember from '../../../common/Card/AddMember';

const la = {
  name: 'design',
  color: 'pink'
}

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      save: false,
      editMode: false,
      deadline: this.props.data.deadline,
      describe: this.props.data.describe,
      label: this.props.data.label,
      membersUid: this.props.data.members, //member uid của card
      members: [], //member trong bảng
      membersCard: []
    };
    this.unsubcriber = null;
  }

  componentDidMount() {
    this.unsubcriber = firebase.firestore().collection('boards').doc(this.props.bid).get()
      .then(doc => {
        const users = [];

        doc.data().members.forEach(val => {
          firebase.firestore().collection('users').where('uid', '==', val).get()
            .then(user => {
              users.push({
                uid: user.docs[0].data().uid,
                name: user.docs[0].data().name,
                avatar: user.docs[0].data().photoURL,
                email: user.docs[0].data().email
              });
              this.setState({
                members: users
              });
            })
        });
      });
  }

  UNSAFE_componentWillMount() {
    if (this.unsubcriber)
      this.unsubcriber()
  }

  formatDate(date) {

    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  fetchDeadline(deadline) {
    if (deadline) {
      return deadline.split('/');
    }
    else {
      return deadline;
    }
  }

  updateLabel = (name, color) => {
    this.setState({
      label: {
        name: name,
        color: color
      }
    })
  }

  updateMember = (membersUid) => {
    this.setState({
      membersUid
    })
  }

  _renderMember() {
    //lọc ra member card trong member bảng
    //console.log('member uid = ',this.props.data.members);
    if (!this.state.membersUid) {
      return (
        <View style={styles.avatar}></View>
      )
    };
    const memberCard = [];

    this.state.members.forEach(val => {
      console.log(val);
      if (this.state.membersUid.includes(val.uid)) {
        memberCard.push(val);
      };
    });

    return (memberCard.map(val => (
      <Thumbnail source={{ uri: val.avatar }}></Thumbnail>
    )));
  }

  render() {
    let deadline = this.state.deadline ? this.fetchDeadline(this.state.deadline) : null;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.title}>
              <Icon name='md-clipboard' style={[styles.article, { fontSize: 14, }]}></Icon>
              <Text style={[{ marginLeft: 5 }, styles.article]}>Mô tả</Text>
            </View>
            <View style={styles.content}>
              {this.state.editMode ? <TextInput placeholder='Thêm mô tả...' placeholderTextColor="#d6d6d6"
                defaultValue={this.state.describe} editable={this.state.editMode}
                onChangeText={(text) => {
                  this.setState({
                    describe: text
                  })
                }} /> :
                <Text style={{ fontSize: 16 }}>{this.state.describe}</Text>}
            </View>
            <View style={styles.border}>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 3 }}>
                <View style={styles.title}>
                  <Icon type='FontAwesome5' name='user-friends' style={[styles.article, { fontSize: 14 }]}></Icon>
                  <Text style={[{ marginLeft: 5 }, styles.article]}>Thành viên</Text>
                </View>
              </View>

              <TouchableOpacity disabled={!this.state.editMode}
                onPress={() => {
                  this.refs.modalMember.show(this.state.membersUid);
                }}>
                <View style={{ flex: 7, flexDirection: 'row-reverse' }}>
                  {this._renderMember()}
                </View>
              </TouchableOpacity>

            </View>
            <View style={styles.border}>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 3 }}>
                <View style={styles.title}>
                  <Icon name='md-pricetags' style={[styles.article, { fontSize: 14 }]}></Icon>
                  <Text style={[{ marginLeft: 5 }, styles.article]}>Nhãn</Text>
                </View>
              </View>

              <TouchableOpacity disabled={!this.state.editMode}
                onPress={() => {
                  this.refs.modalNhan.show('Nhãn', this.state.label);
                }}>
                <View style={{ flex: 7, flexDirection: 'row-reverse' }}>
                  <View style={[styles.tag, { backgroundColor: this.state.label ? this.state.label.color : 'green' }]}>
                    <Text>{this.state.label ? this.state.label.name : 'Chưa có'}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
            <View style={styles.border}>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 3 }}>
                <View style={styles.title}>
                  <Icon name='md-time' style={[styles.article, { fontSize: 14 }]}></Icon>
                  <Text style={[{ marginLeft: 5 }, styles.article]}>Deadline</Text>
                </View>
              </View>

              <View style={{ flex: 7, flexDirection: 'row-reverse' }}>
                <DatePicker
                  ref='dpc'
                  style={{ backgroundColor: 'green' }}
                  defaultDate={deadline ? new Date(deadline[2], deadline[1] - 1, deadline[0]) : ''}
                  locale={"vi"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText={deadline ? null : 'Không có'}
                  onDateChange={(newDate) => {
                    if (newDate) {
                      this.setState({
                        deadline: this.formatDate(newDate)
                      });
                    }

                  }}
                  disabled={!this.state.editMode}
                />
              </View>

            </View>
            <View style={styles.border}>
            </View>
          </View>


          {this.state.editMode &&
            <View style={styles.section}>
              <TouchableOpacity onPress={() => {
                firebase.firestore().collection('cards').doc(this.props.data.id).update({
                  describe: this.state.describe,
                  deadline: this.state.deadline,
                  label: this.state.label,
                  members: this.state.membersUid
                });
              }}>
                <Text style={{ fontSize: 16 }}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>}

        </ScrollView>
        <AddLabel ref={'modalNhan'} update={this.updateLabel}></AddLabel>
        <AddMember ref={'modalMember'} members={this.state.members} update={this.updateMember} ></AddMember>
        <Fab
          position="bottomRight"
          style={{ backgroundColor: '#5067FF' }}
          onPress={() => {
            if (this.state.editMode == true) { //Đang ở edit mode -> ấn đóng lại

              this.setState({
                describe: this.props.data.describe,
                deadline: this.props.data.deadline,
                label: this.props.data.label,
                save: true
              });
              //nếu ban đầu không có deadline => date rỗng
              //this.refs.dpc.setDate(null);
              //còn trong scope setState thì không dùng ngay state được
              if (this.props.data.deadline) {
                deadline = this.fetchDeadline(this.props.data.deadline);
                this.refs.dpc.setDate(new Date(deadline[2], deadline[1] - 1, deadline[0]));
              } else {
                this.refs.dpc.state.chosenDate = null;
              }

            };

            this.setState({
              editMode: !this.state.editMode
            });
          }}
        >
          <Icon name={this.state.editMode ? "md-close" : "md-construct"} />
        </Fab>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    //margin: 10
    marginTop: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  article: {
    color: 'gray'
  },
  content: {
    marginTop: 10
  },
  border: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#e8e4e3"
  },
  tag: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'green',
  }
})