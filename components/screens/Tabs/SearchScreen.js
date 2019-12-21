import React, { Component } from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Content, View } from 'native-base';
import RenderBoard from '../../common/Board/RenderBoard';
import RenderCard from '../../common/Card/RenderCard';
import firebase from 'react-native-firebase';
export default class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //đưa danh sách bảng, thẻ vào
            textSearch: '',
            arrBRets: [],
            arrCRets: []
        };
        this.arrBFilter = this.props.navigation.state.params.boards;
        this.arrCFilter = [];
        this.arrBoardId = this.arrBFilter.map(item => item.id);
        console.log('id = ', this.arrBoardId);
    }

    onSearching = (text) => {
        this.setState({ textSearch: text });
        // this.setState({ arrFilter: this.props.navigation.state.params.boards });
        const newBFilter = this.arrBFilter.filter(item => {
            const sData = item.name.toUpperCase();
            const cData = text.toUpperCase();
            return sData.indexOf(cData) > -1;
        });

        const newCFilter = this.arrCFilter.filter(item => {
            const sData = item.name.toUpperCase();
            const cData = text.toUpperCase();
            return sData.indexOf(cData) > -1;
        })

        this.setState({
            arrBRets: newBFilter,
            arrCRets: newCFilter
        })
    }

    componentDidMount() {
        const cardData = [];
        this.arrBFilter.forEach(fil => {
            //lấy danh sách tên list của bảng đang for
            const listInfo = [];
            firebase.firestore().collection('boards').doc(fil.id).collection('lists')
                .get()
                .then(snapshot => {
                    snapshot.forEach(list => {
                        let lit = {
                            id: list.id,
                            name: list.data().name
                        }
                        listInfo.push(lit);
                    });

                    firebase.firestore().collection('cards').where('bid', '==', fil.id)
                        .get()
                        .then((query) => {
                            query.forEach(doc => {
                                console.log('list = ', listInfo);
                                //lấy được list name, có lid của card
                                let lname = listInfo.filter(l => { return l.id == doc.data().lid });
                                //member của board đã có sẵn trong ds, lấy ra board
                                //console.log(`lname = ${lname} và board = ${board}`);
                                cardData.push({
                                    id: doc.id,
                                    lname: lname ? lname[0].name : '',
                                    bmembers: fil.members,
                                    name: doc.data().name,
                                    describe: doc.data().describe,
                                    deadline: doc.data().deadline,
                                    label: doc.data().label,
                                    numComment: doc.data().numComment,
                                    numList: doc.data().numList,
                                    numAttach: doc.data().numAttach,
                                    members: doc.data().members
                                });
                            });
                            this.arrCFilter = cardData;
                        });
                });
        });
    }

    render() {
        console.log('ret =', )
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Button transparent
                            onPress={() => { this.props.navigation.goBack() }}>
                            <Icon name="ios-arrow-round-back" />
                        </Button>
                        <Input
                            onChangeText={this.onSearching}
                            //value={currentRefinement}
                            placeholder={'Tìm kiếm bảng, thẻ...'}
                            clearButtonMode={'always'}
                            underlineColorAndroid={'white'}
                            spellCheck={false}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                        />
                        <Icon name="ios-search" />
                    </Item>
                </Header>
                <View style={{
                    flex: 1,
                    margin: 10,
                    padding: 10
                }}>
                    {
                        this.state.arrBRets.length <= 0 && this.state.arrCRets.length <= 0 && this.state.textSearch != ''  ?
                            <Text>Không có kết quả</Text>
                            :
                            this.state.textSearch == '' ?
                            null
                            :
                            <>
                                <View>
                                    {this.state.arrBRets.length > 0 && <Text>Bảng</Text>}
                                    <FlatList
                                        data={this.state.arrBRets}
                                        renderItem={({ item }) => <RenderBoard data={item} navigation={this.props.navigation}></RenderBoard>}
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                                <View>
                                    {this.state.arrCRets.length > 0 && <Text>Thẻ</Text>}
                                    <FlatList
                                        //scrollEnabled={true}
                                        data={this.state.arrCRets}
                                        renderItem={({ item }) => <RenderCard item={item} navigation={this.props.navigation} />}
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                            </>
                    }

                </View>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchBoxContainer: {
        backgroundColor: '#162331',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBox: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: 1,
        padding: 10,
        margin: 10,
    }
})
