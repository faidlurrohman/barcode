import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './screens/Home';
import ImageView from './screens/ImageView';
import Gallery from './screens/Gallery';

const DashboardStack = createStackNavigator();

const MainScreen = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <DashboardStack.Screen
        name="ImageView"
        component={ImageView}
        options={{
          title: '',
          headerStyle: {
            elevation: 0,
          },
        }}
      />
      <DashboardStack.Screen
        name="Gallery"
        component={Gallery}
        options={{
          title: '',
          headerStyle: {
            elevation: 0,
          },
        }}
      />
    </DashboardStack.Navigator>
  );
};

const Router = () => {
  return (
    <NavigationContainer>
      <MainScreen />
    </NavigationContainer>
  );
};

export default Router;
