import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';
import { Icon, Thumbnail } from 'native-base';

function renderMember(card) {
    if (!card.members)
        return false;
    return (card.bmembers.map(val => (
        card.members.includes(val.uid) && <Thumbnail key={val.uid} style={styles.avatar} source={{ uri: val.avatar }}></Thumbnail>
    )));
}

export default function RenderCard({ item, navigation }) {
    return (
        <TouchableOpacity
            style={{
                padding: 10,
                borderWidth: 1,
                marginTop: 10
            }}
            onPress={() => {
                navigation.navigate("Chi tiết card", { id: item.id, name: item.lname, members: item.bmembers });
            }}>

            {item.label && <Text style={{ color: item.label.color }}>{item.label.name}</Text>}

            <View style={styles.section}>
                <Text>{item.name}</Text>
            </View>
            {item.deadline &&
                <View style={styles.section}>
                    <Icon name='md-time' style={[{ fontSize: 14 }, styles.subcolor]} />
                    <Text style={[styles.showdeadline, styles.subcolor]}>{item.deadline}</Text>
                </View>}
            <View style={styles.actionSec}>
                <View style={styles.showInfo}>

                    {item.numList != 0 && <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-list' style={[{ fontSize: 14 }, styles.subcolor]} />
                        <Text style={[styles.showdeadline, styles.subcolor]}>{item.numList}</Text>
                    </View>}
                    {item.numAttach != 0 &&
                        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='md-attach' style={[{ fontSize: 14 }, styles.subcolor]} />
                            <Text style={[styles.showdeadline, styles.subcolor]}>{item.numAttach}</Text>
                        </View>}
                    {item.numComment != 0 &&
                        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='md-chatboxes' style={[{ fontSize: 14 }, styles.subcolor]} />
                            <Text style={[styles.showdeadline, styles.subcolor]}>{item.numComment}</Text>
                        </View>}
                </View>
                <View style={styles.member}>
                    {renderMember(item)}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    tag: {
        width: 60,
        height: 20,
    },
    section: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionSec: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    showdeadline: {
        marginLeft: 5,
    },
    subcolor: {
        color: '#8492A6'
    },
    showInfo: {
        flexDirection: 'row'
    },
    member: {
        flexDirection: 'row'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: 'green'
    },
});