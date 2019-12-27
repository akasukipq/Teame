import React, { Component } from 'react';
import { View, StyleSheet, Button, TextInput, Alert, TouchableOpacity, ScrollView, Linking } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon, DatePicker, Fab, Thumbnail, Text } from 'native-base';
import { withNavigation } from 'react-navigation';
import AddLabel from '../../../common/Card/AddLabel';
import AddMember from '../../../common/Card/AddMember';

const la = {
  name: 'design',
  color: 'pink'
}

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      save: false,
      editMode: false,
      name: this.props.data.name,
      deadline: this.props.data.deadline,
      describe: this.props.data.describe,
      label: this.props.data.label,
      //oldMembersUid: this.props.data.members,
      membersUid: this.props.data.members, //member uid của card
      members: this.props.bmembers, //member trong bảng
      membersCard: [],
      address: this.props.data.address
    };
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
    if (this.state.membersUid.length == 0) {
      return (
        <View style={[styles.avatar, { backgroundColor: 'green', }]}></View>
      )
    };
    const memberCard = [];

    this.state.members.forEach(val => {
      if (this.state.membersUid.includes(val.uid)) {
        memberCard.push(val);
      };
    });

    return (memberCard.map(val => (
      <Thumbnail style={styles.avatar} key={val.uid} source={{ uri: val.avatar }}></Thumbnail>
    )));
  }

  openMap = () => {
    this.props.navigation.navigate('Bản đồ');
  }

  render() {
    let deadline = this.state.deadline ? this.fetchDeadline(this.state.deadline) : null;
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView>

          {this.state.editMode &&
            <View style={[styles.section, { paddingLeft: 5, paddingRight: 5 }]}>
              <View style={styles.title}>
                <Icon name='md-bookmark' style={[styles.article, { fontSize: 14, }]}></Icon>
                <Text style={[{ marginLeft: 5 }, styles.article]}>Tên thẻ</Text>
              </View>
              <View>
                <TextInput defaultValue={this.props.data.name}
                  onChangeText={(text) => {
                    this.setState({
                      name: text
                    });
                  }} />
              </View>
              <View style={styles.border}>
              </View>
            </View>
          }

          <View style={[styles.section, { paddingLeft: 5, paddingRight: 5 }]}>
            <View style={styles.title}>
              <Icon name='md-clipboard' style={[styles.article, { fontSize: 14, }]}></Icon>
              <Text style={[{ marginLeft: 5 }, styles.article]}>Mô tả</Text>
            </View>
            <View>
              {this.state.editMode ? <TextInput placeholder='Thêm mô tả...' placeholderTextColor="#d6d6d6"
                defaultValue={this.state.describe} editable={this.state.editMode}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    describe: text
                  })
                }} /> :
                <Text style={styles.content}>{this.state.describe}</Text>}
            </View>
            <View style={styles.border}>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.box}>
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
            <View style={styles.box}>
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
            <View style={styles.box}>
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

          <View style={[styles.section, {
            paddingLeft: 5,
            paddingRight: 5
          }]}>
            <View style={[styles.title, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type='FontAwesome' name='map-marker' style={[styles.article, { fontSize: 14, }]}></Icon>
                <Text style={[{ marginLeft: 5 }, styles.article]}>Địa điểm</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`geo:0,0?q=${this.state.address}`);
                }}>
                <Text style={{ color: '#F3C537' }}>Mở map</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 8 }}>
                {this.state.editMode ? <TextInput placeholder="Nhập địa điểm..."
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({
                      address: text
                    });
                  }} /> :
                  <Text style={styles.content}>{this.state.address}</Text>}
              </View>
            </View>
            <View style={styles.border}>
            </View>
          </View>


          {this.state.editMode &&
            <View style={styles.section}>
              <TouchableOpacity onPress={() => {
                //
                //console.log('member1 = ', this.props.bmembers);

                this.state.membersUid.forEach((item) => {
                  let flag = false;

                  if(item == firebase.auth().currentUser.uid)
                  {
                    flag = true;
                  }
                  this.props.data.members.forEach((mem) =>
                  {
                    if(item == mem.uid)
                    {
                      flag = true;
                    }
                  })
                  if(flag == false)
                  {
                    firebase.firestore().collection('requests').add({
                      from: firebase.auth().currentUser.displayName,
                      payload: {
                        bmembers: this.state.members,
                        lname: this.props.lname,
                        cid: this.props.data.id,
                        cname: this.props.data.name,
                      },
                      status: false,
                      to: item,
                      toToken: this.state.members.token,
                      type: 'add'
                    });
                  }
                });
                //
                firebase.firestore().collection('cards').doc(this.props.data.id).update({
                  name: this.state.name,
                  describe: this.state.describe,
                  deadline: this.state.deadline,
                  label: this.state.label,
                  members: this.state.membersUid,
                  address: this.state.address
                });
              }}>
                <Text style={{ fontSize: 16 }}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>}

        </ScrollView>
        <AddLabel ref={'modalNhan'} update={this.updateLabel}></AddLabel>
        <AddMember ref={'modalMember'} members={this.state.members} update={this.updateMember} ></AddMember>
        {this.props.isAdmin && <Fab
          position="bottomRight"
          style={{ backgroundColor: '#21272E', width: 50, height: 50 }}
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
          <Icon name={this.state.editMode ? "md-close" : "md-create"} style={{ color: '#F3C537' }} />
        </Fab>}
      </View>
    );
  }
}

export default withNavigation(Info);

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
    marginTop: 10,
  },
  border: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#e8e4e3"
  },
  tag: {
    padding: 10,
    //marginRight: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 5
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  }
})