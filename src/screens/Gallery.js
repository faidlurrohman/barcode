import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';
import {COLORS} from '../styles/Colors';
import {HEIGHT, SCALE, WIDTH} from '../styles/Dimension';
import CameraRoll from '@react-native-community/cameraroll';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';

const Gallery = ({route, navigation}) => {
  const isMounted = useRef(true);
  const [allImages, setImages] = useState(null);
  const [countImg, setCount] = useState(50);
  const [nextPage, setPage] = useState(false);
  const isFocused = useIsFocused();

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
      groupName: 'Barcodes',
    }).then((res) => {
      if (!isMounted.current) return null;

      setImages(res.edges);
      setPage(res.page_info.has_next_page);
    });
  };

  const renderImages = useCallback(
    ({item, index, separators}) => (
      <TouchableOpacity
        activeOpacity={0.5}
        key={index}
        onPress={() => {
          navigation.navigate('ImageView', {
            onView: true,
            dataBarcode: [],
            dataImage: item.node.image.uri,
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
      </TouchableOpacity>
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

  const emptyView = useCallback(
    () => (
      <View
        style={{
          paddingVertical: SCALE(70),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Ionicons
          name="ios-file-tray-outline"
          size={SCALE(40)}
          color={COLORS.gainsboro}
        />
        <Text
          style={{
            fontSize: SCALE(16),
            letterSpacing: 1,
            paddingBottom: SCALE(20),
            paddingHorizontal: SCALE(20),
            color: COLORS.gainsboro,
          }}>
          No image
        </Text>
      </View>
    ),
    [],
  );

  useEffect(() => {
    if (isFocused) {
      if (route.params) {
        if (route.params.onDelete) {
          getPhotos();
        }
      }
    }
    getPermissions();
    getPhotos();
    return () => {
      isMounted.current = false;
    };
  }, [isFocused]);

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
        ListEmptyComponent={emptyView}
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
