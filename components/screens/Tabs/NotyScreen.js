import React, { Component } from 'react';
import { Container, Header, Content, Icon, Left, Right, Body, Title, Button } from 'native-base';
import NotyView from '../SubTabs/Notification/NotyView';

export default class NotyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Thông báo</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <NotyView />
                </Content>
            </Container>
        );
    }
}
