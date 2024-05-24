import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../theme';
// import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
// import CustomIcon from '../components/CustomIcon';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={'home'} size={25} color={focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name='cart' size={25} color={focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex} />
          ),
        }}
        component={CartScreen}
      ></Tab.Screen>
      <Tab.Screen
        name="Favorite"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name='heart' size={25} color={focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex} />
          ),
        }}
        component={FavoritesScreen}
      ></Tab.Screen>
      <Tab.Screen
        name="History"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name='time' size={25} color={focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex} />
          ),
        }}
        component={OrderHistoryScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: COLORS.primaryBlackHex,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabNavigator;
