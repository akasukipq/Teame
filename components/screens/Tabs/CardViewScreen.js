import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Subtitle, Button } from 'native-base';
import MenuCard2 from '../../common/Card/MenuCard2';
import firebase from 'react-native-firebase';
export default class CardViewScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Card: {
                name: '',
                lid: '',
                describe: '',
                label: null,
                deadline: '',
            },
            Loading: false,
        };
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('cards');
    }

    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.unsubscriber = this.ref.doc(id).onSnapshot(doc => {
            const Card = Object.assign({}, this.state.Card, {
                id: id,
                name: doc.data().name,
                describe: doc.data().describe,
                deadline: doc.data().deadline,
                label: doc.data().label,
                members: doc.data().members,
                lid: doc.data().lid,
            });
            this.setState({ Card, Loading: true });
        }
        );

    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        };
    }


    render() {
        return (
            <Container style={{ backgroundColor: '#d4d6d5' }}>

                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Thẻ</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="search" />
                        </Button>
                    </Right>
                </Header>
                <Content contentContainerStyle={{ flex: 1 }}>
                    {this.state.Loading && <MenuCard2 bid={this.props.navigation.state.params.bid} cdt={this.state.Card} listName={this.props.navigation.state.params.name}/>}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    iconMenu: {
        color: "gray"
    },
    active: {
        backgroundColor: "#f44336",
    },
    con: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 70,
    }
})
