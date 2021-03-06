import React, {useEffect, useState} from 'react';
import ImageEditor from '@react-native-community/image-editor';
import {
  Image,
  StyleSheet,
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
} from '../styles/Dimension';
import {COLORS} from '../styles/Colors';
import Skeleton from 'react-native-skeleton-placeholder';
import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';

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
    console.log('route', route);
    setLoading(true);
    if (!onView) {
      cropImage();
    } else {
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
        paddingHorizontal: SCALE(20),
      }}>
      {!onView ? (
        <View style={{flex: 0}}>
          <Text style={{fontSize: SCALE(28)}}>Result</Text>
        </View>
      ) : null}
      <View
        style={{
          flex: !onView ? 0 : 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: !onView ? SCALE(30) : SCALE(20),
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
            <Text style={{fontSize: SCALE(16), color: COLORS.grey}}>
              Barcode details :
            </Text>
            <Text style={{fontSize: SCALE(18), color: COLORS.black}}>
              {dataBarcode.type}
            </Text>
            <Text style={{fontSize: SCALE(18), color: COLORS.black}}>
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
              <Text style={{fontSize: SCALE(16), color: COLORS.black}}>
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
              <Text style={{fontSize: SCALE(16), color: COLORS.black}}>
                Save Image
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 0,
            justifyContent: 'space-between',
            paddingVertical: SCALE(15),
          }}>
          <Pressable
            onPress={deleteImage}
            style={{
              backgroundColor: COLORS.gainsboro,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: SCALE(18),
              borderRadius: SCALE(1000),
            }}>
            <Text style={{fontSize: SCALE(16), color: COLORS.black}}>
              Delete Image
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ImageView;

const styles = StyleSheet.create({});
