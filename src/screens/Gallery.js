import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Text,
} from 'react-native';
import {COLORS} from '../styles/Colors';
import {HEIGHT, SCALE, WIDTH} from '../styles/Dimension';
import CameraRoll from '@react-native-community/cameraroll';

const Gallery = ({route, navigation}) => {
  const [allImages, setImages] = useState(null);
  const [countImg, setCount] = useState(50);
  const [nextPage, setPage] = useState(false);

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
    if (Platform.OS === 'android' && !getPermissions()) return;
    if (nextPage) {
      setCount((prev) => prev + 50);
    }

    CameraRoll.getPhotos({
      first: countImg,
      assetType: 'Photos',
      groupTypes: 'Album',
      groupName: 'WhatsApp Images',
    }).then((res) => {
      console.log('res', res);
      setImages(res.edges);
      setPage(res.page_info.has_next_page);
    });
  };

  const renderImages = useCallback(
    ({item, index, separators}) => (
      <Pressable
        key={index}
        onPress={() => {
          navigation.navigate('ImageView', {
            onView: true,
            dataBarcode: [],
            dataImage: item.node.image.uri,
            onDelete: getPhotos,
          });
        }}>
        <Image
          style={{
            marginRight: SCALE(1),
            width: WIDTH / 3.4,
            height: WIDTH / 3.4,
          }}
          source={{uri: item.node.image.uri}}
        />
      </Pressable>
    ),
    [],
  );

  const getItemLayout = useCallback(
    (data, index) => ({
      length: WIDTH / 3.4,
      offset: (WIDTH / 3.4) * index,
      index,
    }),
    [],
  );

  const keyImages = useCallback((item, index) => index, []);

  const flatListSeparator = useCallback(
    () => <View style={{height: SCALE(1)}} />,
    [],
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
        height: HEIGHT,
        backgroundColor: COLORS.white,
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{flex: 0}}>
        <Text
          style={{
            fontSize: SCALE(28),
            letterSpacing: 1,
            paddingBottom: SCALE(20),
            paddingHorizontal: SCALE(20),
          }}>
          Images
        </Text>
      </View>
      <FlatList
        style={{paddingHorizontal: SCALE(20)}}
        data={allImages}
        renderItem={renderImages}
        keyExtractor={keyImages}
        horizontal={false}
        numColumns={3}
        ItemSeparatorComponent={flatListSeparator}
        windowSize={11}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={SCALE(20)}
        onEndReached={getPhotos}
      />
    </View>
  );
};
export default Gallery;