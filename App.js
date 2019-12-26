/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

//import screens tab
import {
  HomeScreen,
  TableScreen,
  TodoScreen,
  MoreScreen,
  TableDetailScreen,
  LoginScreen,
  RegisterScreen,
  TodoDetailScreen,
  CardViewScreen,
  NotyScreen,
  ProfileScreen,
  SearchScreen
} from './components/screens';
import Members from './components/screens/SubTabs/Drawer/Members';
import Calendars from './components/screens/SubTabs/Drawer/Calendars';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack';
import NavigationService from './components/common/NavigationService';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';


const DrawerStack = createStackNavigator({
  "Chi tiết bảng": TableDetailScreen,
  "Thành viên": Members,
  "Lịch": Calendars,
  "Chi tiết card": CardViewScreen
}, {
  headerMode: 'none'
});


const TableStack = createStackNavigator({
  "Bảng": TableScreen,
  "Chi tiết bảng": DrawerStack,
  "Chi tiết card": CardViewScreen,
  "Tìm kiếm": SearchScreen

}, {
  headerMode: 'none',
});

const TodoStack = createStackNavigator({
  "Todo": TodoScreen,
  "Chi tiết": TodoDetailScreen
}, {
  headerMode: 'none',
})

const MoreStack = createStackNavigator({
  'Thêm': MoreScreen,
  'Pro5': ProfileScreen
}, {
  headerMode: 'none',
})

const AuthStack = createStackNavigator({
  "Đăng nhập": LoginScreen,
  "Đăng ký": RegisterScreen
}, {
  headerMode: 'none',
})

TableStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

TodoStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
}

MoreStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
}

const TabBarComponent = props => <BottomTabBar {...props} />;

const TabNavigator = createBottomTabNavigator({
  "Trang chủ": HomeScreen,
  "Bảng": TableStack,
  "Checklist": TodoStack,
  "Thông báo": NotyScreen,
  "Thêm": MoreStack
}, {
  tabBarOptions: {
    style: {
      backgroundColor: "#F3C537",
    },
    activeBackgroundColor: '#21272E',
    activeTintColor: "#F3C537",
    inactiveTintColor: '#21272E',
    inactiveBackgroundColor: "#F3C537"
  },
  tabBarComponent: props => (
    <TabBarComponent {...props} style={{ borderTopColor: '#21272E' }} />
  ),
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      //let IconComponent = Ionicons;
      let iconName;
      if (routeName === "Trang chủ") {
        iconName = `ios-home`;
        // Sometimes we want to add badges to some icons.
        // You can check the implementation below.
        //IconComponent = HomeIconWithBadge;
      } else if (routeName === "Bảng") {
        iconName = `md-list-box`;
      } else if (routeName === "Checklist") {
        iconName = `md-checkbox${focused ? '' : '-outline'}`;
      } else if (routeName === "Thêm") {
        iconName = `ios-more`;
      } else if (routeName === "Thông báo") {
        iconName = `ios-notifications`;
      }
      // You can return any component that you like here!
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
})

const IndexNavigator = createSwitchNavigator({
  "Auth": AuthStack,
  "App": TabNavigator
})

const App = createAppContainer(IndexNavigator);

class Root extends Component {

  navigator = null;

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('token = ', fcmToken);
  };

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  //Custom Functions

  //For basic config before listenning Noti

  //Step 1: check permission for Service
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    }
    else {
      this.requestPermission();
    }
  }
  //Step 2: if not has permission -> process request
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('quyền bị hủy');
    }
  }
  //Step 3: if has permission -> process get Token
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //For Listenning Notification
  async createNotificationListeners() {

    //Tạo channel
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');
    console.log('my chanel id = ', channel);
    firebase.notifications().android.createChannel(channel);

    /*//Vietnamese explain: khi đang ở foreground => show alert khi có noti
    this.notificationListener = firebase.notifications().onNotification((noti) => {
      const { title, body } = noti;
      Alert.alert(title, body);
    });
    */

    //Testing: khi đang trạng thái background -> tap notification -> mở screen notify
    firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      NavigationService.navigate('Thông báo');

      //this.navigator.dispatch(NavigationActions.navigate('Thêm'));
    });
  }

  render() {
    return (
      <App
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
    )
  };
}

export default Root;
