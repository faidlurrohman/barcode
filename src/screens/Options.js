import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import {COLORS} from '../styles/Colors';
import {SCALE} from '../styles/Dimension';

const Options = ({route, navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SCALE(20),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{flex: 0}}>
        <Text style={{fontSize: SCALE(28), letterSpacing: 1}}></Text>
      </View>
    </View>
  );
};

export default Options;
