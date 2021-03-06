import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import {COLORS} from '../styles/Colors';
import {SCALE, WIDTH} from '../styles/Dimension';
import CameraRoll from '@react-native-community/cameraroll';

export default function Gallery({route, navigation}) {
  const [allImages, setImages] = useState(null);

  const getPermissions = async () => {
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(readPermission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(readPermission);
    return status === 'granted';
  };

  const getPhotos = () => {
    if (Platform.OS === 'android' && !getPermissions()) {
      return;
    }

    CameraRoll.getPhotos({
      first: 1000,
      assetType: 'Photos',
      groupTypes: 'Album',
      groupName: 'Barcodes',
    }).then((res) => {
      //   console.log('res', res);
      setImages(res.edges);
    });
  };

  const ImagesView = () => {
    return (
      <FlatList
        style={{
          paddingHorizontal: SCALE(20),
        }}
        ItemSeparatorComponent={({}) => {
          return <View style={{height: SCALE(3)}} />;
        }}
        horizontal={false}
        data={allImages}
        numColumns={2}
        renderItem={renderImages}
        keyExtractor={(item, index) => index}
      />
    );
  };

  const renderImages = ({item, index, separators}) => (
    <Pressable
      onPress={() =>
        navigation.navigate('ImageView', {
          onView: true,
          dataBarcode: [],
          dataImage: item.node.image.uri,
          onDelete: getPhotos,
        })
      }>
      <Image
        key={index}
        style={[
          {
            marginRight: index % 2 === 0 ? SCALE(1) : 0,
            marginLeft: index % 2 === 1 ? SCALE(1) : 0,
            width: WIDTH / 2.2,
            height: WIDTH / 2.2,
          },
        ]}
        source={{uri: item.node.image.uri}}
      />
    </Pressable>
  );

  useEffect(() => {
    getPermissions();
    getPhotos();
    return () => {};
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <ImagesView />
    </View>
  );
}

const styles = StyleSheet.create({});
