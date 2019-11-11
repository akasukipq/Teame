import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity

} from 'react-native';

export default class AddTable extends Component {
    render() {
        return (
            <TouchableOpacity style={{borderStyle:"dashed", borderWidth:1,borderRadius:45, padding:10}}>
                <View>
                    <Text>+ Thêm bảng mới</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

