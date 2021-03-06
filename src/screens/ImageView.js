import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';

const ImageView = ({route, navigation}) => {
  console.log('route', route);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        resizeMode="cover"
        style={{
          width: route.params.width,
          height: route.params.height,
          // overflow: 'hidden',
        }}
        source={{uri: route.params.uri}}
      />
    </View>
  );
};

export default ImageView;

const styles = StyleSheet.create({});
