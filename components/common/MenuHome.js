import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Overview from '../screens/SubTabs/Overview';
import Todo from '../screens/SubTabs/Todo';
import Deadline from '../screens/SubTabs/Deadline';

export default class MenuHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 3
        };
    }

    _renderTab() {
        switch (this.state.index) {
            case 1:
                return <Overview />
                break;
            case 2:
                return <Todo />
                break;
            case 3:
                return <Deadline />
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "#f8f8f8", height: "100%" }}>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.container}>
                        <View style={this.state.index === 1 ? styles.itemAct : styles.item}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    index: 1,
                                })
                            }}>
                                <View>
                                    <Text style={this.state.index === 1 ? styles.textAct : styles.text}>Overview</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={this.state.index === 2 ? styles.itemAct : styles.item}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    index: 2,
                                })
                            }}>
                                <View>
                                    <Text style={this.state.index === 2 ? styles.textAct : styles.text}>Todo-list</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={this.state.index === 3 ? styles.itemAct : styles.item}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    index: 3,
                                })
                            }}>
                                <View>
                                    <Text style={this.state.index === 3 ? styles.textAct : styles.text}>Deadline</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    {this._renderTab()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#184576",
        backgroundColor: "white",
        marginTop: -10,
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-between",
        elevation: 5,
        zIndex: 999
    },
    item: {
        backgroundColor: "#00000000",
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
        flex: 1,
    },
    itemAct: {
        backgroundColor: "#184576",
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
        flex: 1,
        borderColor: "white",
        borderWidth: 1
    },
    textAct: {
        color: "white",
        textAlign: "center"
    },
    text: {
        color: "#184576",
        textAlign: "center"
    },
    active: {
        backgroundColor: "#184576",
        color: "white",
    }
})
