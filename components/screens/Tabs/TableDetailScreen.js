import React, { Component } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon, Text } from 'native-base';
import DetailTable from '../SubTabs/DetailTable';
import AddList from '../../common/Card/AddList';
import UpdateName from '../../common/Board/UpdateName';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firbase from 'react-native-firebase';
import firebase from 'react-native-firebase';

const screenWidth = Dimensions.get('window').width;

export default class TableDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            primary: null,
            tbdata: this.props.navigation.state.params,
            listDeadline: [],
            listDeadlineDate: [],

        };
        this.isAdmin = this.props.navigation.state.params.author == firebase.auth().currentUser.uid ? true : false;
        this.showModalThemDs = this.showModalThemDs.bind(this);
        this.showModalUpdateName = this.showModalUpdateName.bind(this);
    };

    componentDidMount() {
        firebase.firestore().collection('boards').doc(this.state.tbdata.id).onSnapshot(doc => {
            if (doc._data) {
                this.setState({
                    primary: doc.data().primary
                });
            }
        });
    }


    addDeadline = (deadline) => {
        //prolem: khi 1 thẻ thay đổi deadline -> nó tạo thêm 1 item vào trong danh sách
        //solve: xóa đi thẻ cũ
        let listDeadline = this.state.listDeadline;
        let listDeadlineDate = this.state.listDeadlineDate;

        listDeadline.forEach((val, index) => {
            if (val.cardDetail.id == deadline.cardDetail.id) {
                listDeadline.splice(index, 1);
                listDeadlineDate.splice(index, 1);
            }
        });

        listDeadline.push(deadline);
        listDeadlineDate.push(deadline.deadline);

        this.setState({
            listDeadline,
            listDeadlineDate
        });
    }

    showModalThemDs(id) {
        this.refs.modalThemDs.show(id);
    };

    showModalUpdateName() {
        this.refs.modalUpdateName.show();
    }

    renderDrawer = () => {
        return (
            <View>
                <View style={{ marginLeft: 50, marginTop: 20 }}>
                    <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            this.props.navigation.navigate('Thành viên', this.state.tbdata);
                        }}>
                        <Icon name="person" style={{ color: "#F3C537" }} />
                        <Text style={{ marginLeft: 40, color: '#F3C537' }}>Thành viên</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            this.props.navigation.navigate('Lịch', { deadline: this.state.listDeadline, deadDate: this.state.listDeadlineDate });
                        }}>
                        <Icon name="md-calendar" style={{ color: "#F3C537" }} />
                        <Text style={{ marginLeft: 40, color: '#F3C537' }}>Lịch</Text>
                    </TouchableOpacity>
                    {this.state.primary == true ?
                        <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                firebase.firestore().collection('boards').doc(this.state.tbdata.id).update({
                                    primary: false
                                });
                            }}>
                            <Icon name="md-bookmark" style={{ color: "#F3C537" }} />
                            <Text style={{ marginLeft: 40, color: '#F3C537' }}>Bỏ đánh dấu sao bảng</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                firebase.firestore().collection('boards').doc(this.state.tbdata.id).update({
                                    primary: true
                                });
                            }}>
                            <Icon name="md-bookmark" style={{ color: "#F3C537" }} />
                            <Text style={{ marginLeft: 40, color: '#F3C537' }}>Đánh dấu sao bảng</Text>
                        </TouchableOpacity>
                    }
                    {this.isAdmin &&
                        <>
                            <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    this.showModalUpdateName();
                                }}>
                                <Icon name="md-create" style={{ color: "#F3C537" }} />
                                <Text style={{ marginLeft: 40, color: '#F3C537' }}>Sửa tên bảng</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    Alert.alert(
                                        'Xóa bảng',
                                        'Bạn muốn xóa bảng này? Dữ liệu của bảng sẽ bị mất, thao tác này không thể hoàn lại.',
                                        [
                                            {
                                                text: 'Hủy',
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Xóa', onPress: () => {
                                                    //xóa bảng: xóa card -> xóa bảng
                                                    //B1: xóa card dựa trên bid
                                                    firebase.firestore().collection('cards')
                                                        .where('bid', '==', this.state.tbdata.id)
                                                        .get()
                                                        .then(query => {
                                                            query.forEach(doc => {
                                                                doc.ref.delete();
                                                            });
                                                        });

                                                    firebase.firestore().collection('boards').doc(this.state.tbdata.id).delete();
                                                    this.refs.sidebar.closeDrawer();
                                                    this.props.navigation.goBack(null);
                                                }
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                }}>
                                <Icon name="md-trash" style={{ color: "#F3C537" }} />
                                <Text style={{ marginLeft: 40, color: '#F3C537' }}>Xóa bảng</Text>
                            </TouchableOpacity>
                        </>
                    }

                </View>
            </View>
        );
    };
    render() {
        return (
            <Container>
                <DrawerLayout
                    ref={'sidebar'}
                    drawerWidth={screenWidth - 70}
                    drawerPosition={DrawerLayout.positions.Right}
                    drawerType='front'
                    drawerBackgroundColor="#21272E"
                    renderNavigationView={this.renderDrawer}>
                    <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
                        <Left>
                            <Button transparent onPress={() => { this.props.navigation.goBack(null); }}>
                                <Icon name="arrow-round-back" style={{ color: "#F3C537" }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: "#F3C537" }}>{this.state.tbdata.name}</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.showModalThemDs(this.state.tbdata.id);
                            }}>
                                <Icon style={{ color: "#F3C537" }} name="md-add" />
                            </Button>
                            <Button transparent
                                onPress={() => {
                                    this.refs.sidebar.openDrawer();
                                }}>
                                <Icon style={{ color: "#F3C537" }} name="bars" type='FontAwesome' />
                            </Button>
                        </Right>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1 }}>
                        <DetailTable data={this.state.tbdata} addDeadline={this.addDeadline} />
                        <AddList ref={'modalThemDs'}></AddList>
                        <UpdateName ref={'modalUpdateName'} id={this.state.tbdata.id}></UpdateName>
                    </Content>
                </DrawerLayout>
            </Container>
        );
    }
}
