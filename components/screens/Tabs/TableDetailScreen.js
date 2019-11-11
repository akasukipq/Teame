import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon } from 'native-base';
import DetailTable from '../SubTabs/DetailTable';
import AddList from '../../common/Card/AddList';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

export default class TableDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tbdata: this.props.navigation.state.params
        };
        this.showModal = this.showModal.bind(this);
    };

    showModal(id) {
        this.refs.modalThemDs.show(id);
    };

    renderDrawer = () => {
        return (
            <View>
                <View style={{ marginLeft: 50, marginTop: 20 }}>
                    <TouchableOpacity style={{marginBottom: 30 }}
                    onPress={() => {
                        this.props.navigation.navigate('Thành viên',  this.state.tbdata);
                    }}>
                        <Text>Thành viên</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginBottom: 30 }}>
                        <Text>Chi tiết</Text>
                    </TouchableOpacity>
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
                    drawerBackgroundColor="#ddd"
                    renderNavigationView={this.renderDrawer}>
                    <Header>
                        <Left>
                            <Button transparent>
                                <Icon name="arrow-round-back" style={{ color: "#fff" }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.state.tbdata.name}</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.showModal(this.state.tbdata.id);
                            }}>
                                <Icon name="md-add" />
                            </Button>
                            <Button transparent>
                                <Icon name="search" />
                            </Button>
                            <Button transparent
                                onPress={() => {
                                    this.refs.sidebar.openDrawer();
                                }}>
                                <Icon name="md-eye" />
                            </Button>
                        </Right>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1 }}>
                        <DetailTable data={this.state.tbdata} />
                        <AddList ref={'modalThemDs'}></AddList>
                    </Content>
                </DrawerLayout>
            </Container>
        );
    }
}
