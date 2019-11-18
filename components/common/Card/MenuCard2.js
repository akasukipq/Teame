import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Button, Fab } from 'native-base';
import { Info, Checklist, Attach, Comment, More } from '../../screens/SubTabs/Card';
import firebase from 'react-native-firebase';

export default class MenuCard2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            votes: [],
            listImageUrl: [],
            listDocument: []
        };
        this.unsubscriberOfMore = null;
        this.unsubscriberOfAttach = null;
        this.ref = firebase.firestore().collection('cards').doc(this.props.cdt.id);
    }

    changeIndex(index) {
        this.setState({
            index
        })
    }

    _renderTab() {
        switch (this.state.index) {
            case 0:
                return <Info data={this.props.cdt} bmembers={this.props.bmembers} />
                break;
            case 1:
                return <Checklist data={this.props.cdt} />
                break;
            case 2:
                return <Attach data={this.props.cdt} />
                break;
            case 3:
                return <Comment data={this.props.cdt} />
                break;
            case 4:
                return <More data={this.props.cdt} votes={this.state.votes} />
                break;
            case 5:
                return <Info />
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.section, { flex: 7 }]}>
                        <View style={styles.wrapper}>
                            <Text style={styles.title}>{this.props.cdt.name}</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                        </View>
                    </View>
                    <View style={[styles.section, { flex: 3 }]}>
                        <View>
                            <Text style={styles.subtitle}>{this.props.listName}</Text>
                        </View>
                        <View>
                            <Text style={styles.subtitle}>Due: {this.props.cdt.deadline}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => { this.changeIndex(0) }}>
                        <View style={this.state.index == 0 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 0 ? styles.activeic : styles.ic} name="md-information-circle" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(1) }}>
                        <View style={this.state.index == 1 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 1 ? styles.activeic : styles.ic} name="md-list-box" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(2) }}>
                        <View style={this.state.index == 2 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 2 ? styles.activeic : styles.ic} name="md-attach" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(3) }}>
                        <View style={this.state.index == 3 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 3 ? styles.activeic : styles.ic} name="md-chatbubbles" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(4) }}>
                        <View style={this.state.index == 4 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 4 ? styles.activeic : styles.ic} name="md-more" />
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={styles.content}>
                    {this._renderTab()}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 2,
        backgroundColor: '#00A6FF',
        margin: 10,
        flexDirection: 'column'
    },
    menu: {
        flex: 1,
        backgroundColor: '#d4d6d5',
        //opacity: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    content: {
        flex: 7,
        backgroundColor: 'white',
        //margin: 10,
        marginTop: 10,
        padding: 10
    },
    section: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    subtitle: {
        color: 'white'
    },
    wrapper: {
        flex: 7,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeBg: {
        backgroundColor: '#00A6FF'
    },
    activeic: {
        color: 'white'
    },
    ic: {
        color: '#00A6FF'
    }
})
