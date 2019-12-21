import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';
import { Icon, Thumbnail } from 'native-base';

function _render(data) {
    return (
        data.map(val => (
            <Thumbnail key={val.uid} style={styles.avatar} source={{ uri: val.avatar }}></Thumbnail>
        ))
    )
}
export default function Item({ data, navigation }) {
    let date = new Date(parseInt(data.timestamp));
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Chi tiết bảng", data);
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 9 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>{data.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {data.primary && <Icon name='md-star-outline' />}
                    </View>
                </View>
                <View style={styles.itemMember}>
                    {_render(data.members)}
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionInfo}>

                    </View>
                    <View style={styles.deadline}>
                        <Icon name='md-time' style={{ fontSize: 14 }} />
                        {date && <Text style={styles.showdeadline}>Ngày tạo: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        borderColor: '#8492A6'
    },
    itemMember: {
        flexDirection: 'row',
        marginTop: 10
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
    },
    actionContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#8492A6',
        paddingTop: 5
    },
    deadline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showdeadline: {
        marginLeft: 5,
    }
})