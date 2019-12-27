import React, { Component } from 'react';
import { View, StyleSheet ,ActivityIndicator, AsyncStorage, Image } from 'react-native';
import { Text } from 'native-base';
import firebase from 'react-native-firebase';
import NavigationService from '../../common/NavigationService';

export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: 0
        }
        console.log('có ủe = ', firebase.auth().currentUser);
        var timecout = setInterval(() => {
            let time = this.state.time + 1;
            this.setState({ time: this.state.time + 1 });
            if (time >= 1) {
                clearInterval(timecout);
                //console.log('da het thoi giam');
                AsyncStorage.getItem('remember').then((ret) => {
                    if (ret == 'true' && firebase.auth().currentUser) {
                        NavigationService.navigate('App');
                    }
                    else {
                        this.props.navigation.navigate('AuthStack');
                    }
                });

            }
        }, 1000);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container1}>
                <Image source={require('../../../public/images/logo.png')} style={styles.logo}></Image>
                <Text style={{color: '#F3C537', fontSize: 25}}>TEAME</Text>
                <ActivityIndicator color={'#F3C537'}/>
            </View>

        );
    }
};

const styles = StyleSheet.create({

    container1: {
        backgroundColor: "#21272E",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },

    logo: {
        width: 200,
        height: 200
    }
});
