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
import {HEIGHT, HP, WP, WIDTH} from '../styles/Dimension';
import CameraRoll from '@react-native-community/cameraroll';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';

const Gallery = ({route, navigation}) => {
  const isMounted = useRef(true);
  const [allImages, setImages] = useState(null);
  const [countImg, setCount] = useState(50);
  const [nextPage, setPage] = useState(false);
  const isFocused = useIsFocused();
  const [modalPermissions, setModalPermissions] = useState(false);

  const getPermissions = async () => {
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(readPermission);
    // console.log(`hasPermission`, hasPermission);
    if (hasPermission) {
      return true;
    } else {
      setModalPermissions(true);
    }
  };

  const actionPermissions = async (_action) => {
    if (_action) {
      setModalPermissions(false);
      const readPermission =
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const status = await PermissionsAndroid.request(readPermission);
      // console.log(`status`, status);
      if (status === 'granted') {
        getPhotos();
      }
      return status === 'granted';
    } else {
      setModalPermissions(false);
      navigation.goBack();
    }
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
      // console.log(`object`, isMounted.current);
      // if (!isMounted.current) return null;
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
            marginRight: HP('0.1%'),
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
    () => <View style={{height: HP('0.1%')}} />,
    [],
  );

  const emptyView = useCallback(
    () => (
      <View
        style={{
          paddingVertical: HP('10%'),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Ionicons
          name="ios-file-tray-outline"
          size={HP('3%')}
          color={COLORS.gainsboro}
        />
        <Text
          style={{
            fontSize: HP('2%'),
            fontFamily: 'MontserratSemibold',
            paddingBottom: WP('5%'),
            paddingHorizontal: WP('5%'),
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
          // console.log(`onDelete`, route.params.onDelete);
          getPhotos();
        }
      }
    }
    if (isMounted.current) {
      if (getPermissions()) {
        getPhotos();
      }
    }
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
            fontSize: HP('3%'),
            fontFamily: 'MontserratSemibold',
            paddingBottom: WP('5%'),
            paddingHorizontal: WP('5%'),
          }}>
          Images
        </Text>
      </View>
      <FlatList
        style={{paddingHorizontal: WP('5%')}}
        data={allImages}
        ListEmptyComponent={emptyView}
        renderItem={renderImages}
        keyExtractor={keyImages}
        horizontal={false}
        numColumns={3}
        ItemSeparatorComponent={flatListSeparator}
        windowSize={11}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={WP('5%')}
        onEndReached={getPhotos}
      />
      <Modal
        backdropOpacity={0}
        isVisible={modalPermissions}
        onSwipeComplete={() => setModalPermissions(false)}
        swipeDirection={['down']}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'column',
            paddingHorizontal: WP('3%'),
            height: HP('25%'),
            backgroundColor: COLORS.gainsboro,
          }}>
          <Ionicons
            name="reorder-two-outline"
            size={HP('3%')}
            color={COLORS.black}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: HP('2.5%'),
                fontFamily: 'MontserratSemibold',
              }}>
              Allow BarCodes to access photos, media and files on your device?
            </Text>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => actionPermissions(false)}
                style={{
                  flex: 1,
                  padding: WP('2%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: HP('2.5%'),
                    fontFamily: 'MontserratSemibold',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => actionPermissions(true)}
                style={{
                  flex: 1,
                  padding: WP('2%'),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.grey,
                }}>
                <Text
                  style={{
                    color: COLORS.gainsboro,
                    textAlign: 'center',
                    fontSize: HP('2.5%'),
                    fontFamily: 'MontserratSemibold',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Gallery;
