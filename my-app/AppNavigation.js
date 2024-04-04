import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';

// Import your page components here
import Home from './Home';
import Chat from './Chat';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            // Customize your icons based on the page and focused status
            let iconName;
            if (route.name === 'Page1') {
              iconName = focused ? 'icon1-focused' : 'icon1';
            } else if (route.name === 'Page2') {
              iconName = focused ? 'icon2-focused' : 'icon2';
            } else if (route.name === 'Page3') {
              iconName = focused ? 'icon3-focused' : 'icon3';
            }

            // Return a custom component for icons
            return <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              {/* Replace <Icon> with your icon component */}
              {/* <Icon name={iconName} size={30} color="#900" /> */}
            </View>;
          },
        })}
      >
        <Tab.Screen name="Char" component={Chat} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    // Styles for your icon container
  },
  iconFocused: {
    // Additional styles when the icon is focused, like adding a white circle behind the icon
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 25,
    transform: [{ translateY: -10 }],
  },
});

export default AppNavigation;
