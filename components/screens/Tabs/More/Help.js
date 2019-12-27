import React, { Component } from 'react';
import { Container, Header, Content, Icon, Left, Right, Body, Title, Button, Text, Row } from 'native-base';
import { View, FlatList, TouchableOpacity } from 'react-native';


export default class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
                    <Body style={{ padding: 10 }}>
                        <Title style={{ color: "#F3C537" }}>Liên hệ hỗ trợ</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle = {{padding: 10}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>App Teame - Quản lý dự án</Text>
                    </View>
                    
                    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <Text style={{color: '#F3C537'}}>-- Đội ngũ thực hiện --</Text>
                        <Text>Nguyễn Tấn Phát</Text>
                        <Text>Dương Thị Thu Thủy</Text>
                        <Text>Trương Văn Thành</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: "center", marginTop: 20}}>
                        <Icon style={{color: '#F3C537', marginRight: 5}} name='logo-whatsapp'></Icon>
                        <Text style={{color: '#F3C537'}}>Thông tin liên hệ:</Text>
                        <Text style={{fontStyle: 'italic'}}>17520879@gm.uit.edu.vn</Text>
                    </View>
                    <Text style={{marginTop: 20}}>Chúng tôi rất vui vì được phục vụ các bạn!</Text>
                </Content>
            </Container>
        );
    }
}
