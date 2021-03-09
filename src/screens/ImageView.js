import React, {useEffect, useState} from 'react';
import ImageEditor from '@react-native-community/image-editor';
import {
  Image,
  Text,
  View,
  Pressable,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  SCALE,
  FRAME_WIDTH,
  FRAME_HEIGTH,
  SCAN_AREA_X,
  SCAN_AREA_Y,
  SCAN_AREA_HEIGHT,
  SCAN_AREA_WIDTH,
  WIDTH,
} from '../styles/Dimension';
import {COLORS} from '../styles/Colors';
import Skeleton from 'react-native-skeleton-placeholder';
import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ImageView = ({route, navigation}) => {
  const {onView, dataBarcode, dataImage, onDelete} = route.params;
  const [imageUri, setimageUri] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const crop_config = {
    offset: {
      x: SCAN_AREA_X * dataImage.width - SCALE(10),
      y: SCAN_AREA_Y * dataImage.height - SCALE(10),
    },
    size: {
      width: SCAN_AREA_WIDTH * dataImage.width - SCALE(10),
      height: SCAN_AREA_HEIGHT * dataImage.height - SCALE(10),
    },
  };

  useEffect(() => {
    setLoading(true);
    if (!onView) {
      cropImage();
    } else {
      navigation.setOptions({
        headerShown: false,
      });
      setimageUri(dataImage);
      setLoading(false);
    }
    return () => {};
  }, []);

  const cropImage = () => {
    ImageEditor.cropImage(dataImage.uri, crop_config)
      .then((dataCrop) => {
        setimageUri(dataCrop);
        setLoading(false);
      })
      .catch((e) => console.log('e', e));
  };

  const getPermissions = async () => {
    const writePermission =
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(writePermission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(writePermission);
    return status === 'granted';
  };

  const copyText = () => {
    Clipboard.setString(`${dataBarcode.type}, ${dataBarcode.data}`);
    ToastAndroid.showWithGravity(
      'Text copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  const saveImage = () => {
    if (Platform.OS === 'android' && !getPermissions()) {
      return;
    }
    CameraRoll.save(imageUri, {album: 'Barcodes'}).then(() => {
      ToastAndroid.showWithGravity(
        'Image saved',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    });
  };

  const deleteImage = () => {
    CameraRoll.deletePhotos([imageUri]).then(() => {
      ToastAndroid.showWithGravity(
        'Image Deleted',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.goBack();
      onDelete();
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: onView ? 0 : SCALE(20),
      }}>
      {!onView ? (
        <View style={{flex: 0}}>
          <Text style={{fontSize: SCALE(28), letterSpacing: 1}}>Result</Text>
        </View>
      ) : null}
      <View
        style={{
          flex: !onView ? 0 : 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: !onView ? SCALE(20) : 0,
        }}>
        {isLoading ? (
          <Skeleton>
            <Skeleton.Item
              width={FRAME_HEIGTH}
              height={FRAME_WIDTH}
              borderRadius={SCALE(30)}
            />
          </Skeleton>
        ) : (
          <Image
            resizeMode="cover"
            style={{
              borderRadius: SCALE(5),
              width: !onView ? FRAME_HEIGTH : '100%',
              height: !onView ? FRAME_WIDTH : '100%',
            }}
            source={{uri: imageUri}}
          />
        )}
      </View>
      {!onView ? (
        <>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: SCALE(16),
                color: COLORS.grey,
                letterSpacing: 1,
              }}>
              Barcode details :
            </Text>
            <Text
              style={{
                fontSize: SCALE(18),
                color: COLORS.black,
                letterSpacing: 1,
              }}>
              {dataBarcode.type}
            </Text>
            <Text
              style={{
                fontSize: SCALE(18),
                color: COLORS.black,
                letterSpacing: 1,
              }}>
              {dataBarcode.data}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: SCALE(15),
            }}>
            <Pressable
              onPress={copyText}
              style={{
                backgroundColor: COLORS.gainsboro,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SCALE(18),
                borderRadius: SCALE(1000),
              }}>
              <Text
                style={{
                  fontSize: SCALE(16),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                Copy Text
              </Text>
            </Pressable>
            <View />
            <Pressable
              onPress={saveImage}
              style={{
                backgroundColor: COLORS.gainsboro,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SCALE(18),
                borderRadius: SCALE(1000),
              }}>
              <Text
                style={{
                  fontSize: SCALE(16),
                  color: COLORS.black,
                  letterSpacing: 1,
                }}>
                Save Image
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={COLORS.gradient}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            paddingVertical: SCALE(5),
            width: WIDTH,
            height: WIDTH / 2,
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: SCALE(30),
              left: SCALE(2),
              padding: SCALE(10),
            }}>
            <Ionicons name="arrow-back" size={SCALE(24)} color={COLORS.black} />
          </Pressable>
          <Pressable
            onPress={deleteImage}
            style={{
              position: 'absolute',
              top: SCALE(30),
              right: SCALE(2),
              padding: SCALE(10),
            }}>
            <Ionicons
              name="ios-trash-outline"
              size={SCALE(24)}
              color={COLORS.black}
            />
          </Pressable>
        </LinearGradient>
      )}
    </View>
  );
};

export default ImageView;
