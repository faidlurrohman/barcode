import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {_getTypes, _storeTypes} from '../helper/_storage';
import {COLORS} from '../styles/Colors';
import {SCALE} from '../styles/Dimension';
import {useIsFocused} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Options = ({route, navigation}) => {
  const isMounted = useRef(true);
  const isFocused = useIsFocused();
  const [listTypes, setList] = useState([]);

  const toggleSwitch = (_value, _item, _index) => {
    if (isFocused) {
      listTypes.map((data) => {
        if (data.name === _item.name) {
          data.isActive = _value;
        }
      });
      setList(listTypes);
      _storeTypes(listTypes);
      getCurrentTypes();
    }
  };

  const getCurrentTypes = useCallback(() => {
    _getTypes()
      .then((el) => {
        if (!isMounted.current) return null;
        setList(JSON.parse(el));
      })
      .catch((e) => console.log(`e`, e));
  }, []);

  useEffect(() => {
    getCurrentTypes();
    return () => {
      isMounted.current = false;
    };
  }, [isFocused]);

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
        <Text style={{fontSize: SCALE(28), letterSpacing: 1}}>
          BarCodes Types
        </Text>
      </View>
      <TouchableOpacity
        // disabled={disableAction}
        activeOpacity={0.5}
        // onPress={saveImage}
        style={{
          position: 'absolute',
          top: SCALE(-8),
          right: SCALE(10),
          padding: SCALE(10),
        }}>
        <Ionicons
          name="help-circle-outline"
          size={SCALE(24)}
          color={COLORS.black}
        />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        {listTypes.map((item, index) => (
          <View
            key={index}
            style={{
              paddingTop: SCALE(16),
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: SCALE(16),
                color: COLORS.grey,
                letterSpacing: 1,
              }}>
              {item.name}
            </Text>
            <Switch
              trackColor={{false: COLORS.gainsboro, true: COLORS.grey}}
              thumbColor={item.isActive ? COLORS.gainsboro : COLORS.gainsboro}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => toggleSwitch(value, item, index)}
              value={item.isActive}
            />
          </View>
        ))}
      </ScrollView>
      {/* <View style={{flex: 0}}>
        <Text style={{fontSize: SCALE(28), letterSpacing: 1}}></Text>
        <Switch
          trackColor={{false: COLORS.gainsboro, true: COLORS.grey}}
          thumbColor={isEnabled ? COLORS.gainsboro : COLORS.grey}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View> */}
    </View>
  );
};

export default Options;
