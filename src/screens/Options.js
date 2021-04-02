import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StatusBar, Switch, ScrollView} from 'react-native';
import {_getTypes, _storeTypes} from '../helper/_storage';
import {COLORS} from '../styles/Colors';
import {HP, WP} from '../styles/Dimension';
import {useIsFocused} from '@react-navigation/native';

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
        paddingHorizontal: WP('5%'),
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{flex: 0}}>
        <Text style={{fontSize: HP('3%'), letterSpacing: 1}}>
          BarCodes Types
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {listTypes.map((item, index) => (
          <View
            key={index}
            style={{
              paddingTop: HP('3%'),
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: HP('2%'),
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
    </View>
  );
};

export default Options;
