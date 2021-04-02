import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Toast, {BaseToast} from 'react-native-toast-message';

import Home from './screens/Home';
import ImageView from './screens/ImageView';
import Gallery from './screens/Gallery';
import Options from './screens/Options';
import {COLORS} from './styles/Colors';
import {HP, WP} from './styles/Dimension';

const DashboardStack = createStackNavigator();

const toastConfig = {
  success: ({text1, props, ...rest}) => (
    <BaseToast
      {...rest}
      style={{
        height: HP('6%'),
        borderLeftColor: COLORS.gainsboro,
        backgroundColor: COLORS.gainsboro,
      }}
      contentContainerStyle={{alignItems: 'center'}}
      text1Style={{
        fontFamily: 'MontserratSemiBold',
        fontSize: HP('2%'),
        color: COLORS.black,
      }}
      text1={text1}
      text2={null}
    />
  ),
  error: () => {},
  info: () => {},
  any_custom_type: () => {},
};

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
      <DashboardStack.Screen
        name="Options"
        component={Options}
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
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default Router;
