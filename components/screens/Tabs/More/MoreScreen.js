import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Thumbnail, List, ListItem } from 'native-base';
import firebase from 'react-native-firebase';
import UpdatePass from '../../../common/More/UpdatePass';
export default class MoreScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
    this.unsubscriber = null;
    this.showModalUpdatePass = this.showModalUpdatePass.bind(this);
  }

  componentDidMount() {
    this.unsubscriber = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      .onSnapshot(user => {
        this.setState({
          user: user.data()
        })
      });
  }

  showModalUpdatePass() {
    this.refs.modalUpdatePass.show();
  }

  render() {
    //console.log('user = ', this.state.user);
    return (
      <Container>
        <Header noShadow androidStatusBarColor="#21272E" style={{ backgroundColor: '#21272E' }}>
          <Left style={{ flex: 0 }} />
          <Body style={{ flex: 3, padding: 10 }}>
            <Title style={{ color: '#F3C537' }}>Cài đặt</Title>
          </Body>
          <Right style={{ flex: 0 }} />
        </Header>
        <Content>
          {this.state.user &&
            <>
              <View style={{
                backgroundColor: '#21272E', flexDirection: 'row', alignItems: 'center',
                paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 25
              }}>
                <View style={{ flex: 2 }}>
                  <Thumbnail source={{ uri: this.state.user.photoURL }} style={{ marginRight: 10, borderColor: '#F3C537', borderWidth: 1 }} />
                </View>
                <View style={{ flexDirection: 'column', flex: 7 }}>
                  <Text style={{ color: 'white' }}>{this.state.user.email}</Text>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{this.state.user.name}</Text>
                </View>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Pro5', this.state.user) }}>
                  <Icon name="pencil-square" type="FontAwesome" style={{ color: '#F3C537', flex: 1 }} />
                </TouchableOpacity>
              </View>
            </>
          }
          <List>
            <ListItem itemDivider>
              <Text>Cài đặt tài khoản</Text>
            </ListItem>
            <ListItem onPress={() => { this.showModalUpdatePass() }}>
              <Left>
                <Text>Đổi mật khẩu</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>Hỗ trợ</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Liên hệ hỗ trợ</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Đăng xuất</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
        <UpdatePass ref={'modalUpdatePass'}></UpdatePass>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  pro5: {
    marginBottom: 10
  }
});
